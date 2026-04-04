from rest_framework import viewsets, generics, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Jersey, JerseyImage, Club, Category, Review
from .serializers import (
    JerseyListSerializer, JerseyDetailSerializer, JerseyWriteSerializer,
    ClubSerializer, CategorySerializer, ReviewSerializer
)


class ClubViewSet(viewsets.ReadOnlyModelViewSet):
    queryset         = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [AllowAny]
    lookup_field     = 'slug'


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset         = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field     = 'slug'


class JerseyViewSet(viewsets.ModelViewSet):
    queryset       = Jersey.objects.select_related('club', 'category').prefetch_related('images')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['club__slug', 'category__slug', 'badge', 'is_featured', 'is_new']
    search_fields  = ['title', 'club__name', 'description']
    ordering_fields = ['price', 'created_at', 'rating', 'review_count']
    ordering       = ['-created_at']
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field   = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return JerseyListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return JerseyWriteSerializer
        return JerseyDetailSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured', 'stats', 'by_club']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs     = super().get_queryset().filter(is_active=True)
        params = self.request.query_params

        club      = params.get('club')
        category  = params.get('category')
        min_price = params.get('min_price')
        max_price = params.get('max_price')
        search    = params.get('search')
        new_only  = params.get('new')
        sale_only = params.get('sale')

        if club:      qs = qs.filter(club__name__icontains=club)
        if category:  qs = qs.filter(category__name__icontains=category)
        if min_price: qs = qs.filter(price__gte=min_price)
        if max_price: qs = qs.filter(price__lte=max_price)
        if search:    qs = qs.filter(Q(title__icontains=search) | Q(club__name__icontains=search))
        if new_only:  qs = qs.filter(is_new=True)
        if sale_only: qs = qs.filter(badge='Sale')

        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Jersey.objects.filter(pk=instance.pk).update(views=instance.views + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """Create jersey + handle uploaded images"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        jersey = serializer.save()

        # Handle multiple image uploads
        images = request.FILES.getlist('images')
        for i, img in enumerate(images):
            JerseyImage.objects.create(
                jersey=jersey, image=img,
                is_primary=(i == 0), order=i
            )

        return Response(JerseyDetailSerializer(jersey, context={'request': request}).data,
                        status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        jerseys = Jersey.objects.filter(is_featured=True, is_active=True).select_related('club', 'category').prefetch_related('images')[:8]
        return Response(JerseyListSerializer(jerseys, many=True, context={'request': request}).data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def stats(self, request):
        return Response({
            'total_jerseys': Jersey.objects.filter(is_active=True).count(),
            'clubs':         Club.objects.count(),
            'categories':    Category.objects.count(),
            'new_arrivals':  Jersey.objects.filter(is_new=True, is_active=True).count(),
        })

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def add_review(self, request, *args, **kwargs):
        jersey = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(jersey=jersey)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated],
            parser_classes=[MultiPartParser, FormParser])
    def upload_images(self, request, *args, **kwargs):
        """Upload images to existing jersey"""
        jersey = self.get_object()
        images = request.FILES.getlist('images')
        if not images:
            return Response({'error': 'No images provided'}, status=400)
        current_count = jersey.images.count()
        for i, img in enumerate(images):
            JerseyImage.objects.create(
                jersey=jersey, image=img,
                is_primary=(current_count == 0 and i == 0),
                order=current_count + i
            )
        return Response({'message': f'{len(images)} image(s) uploaded successfully'})

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def set_primary_image(self, request, *args, **kwargs):
        jersey   = self.get_object()
        image_id = request.data.get('image_id')
        if not image_id:
            return Response({'error': 'image_id required'}, status=400)
        jersey.images.all().update(is_primary=False)
        jersey.images.filter(id=image_id).update(is_primary=True)
        return Response({'message': 'Primary image updated'})

    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def delete_image(self, request, *args, **kwargs):
        image_id = request.data.get('image_id')
        try:
            img = JerseyImage.objects.get(id=image_id, jersey=self.get_object())
            img.delete()
            return Response({'message': 'Image deleted'})
        except JerseyImage.DoesNotExist:
            return Response({'error': 'Image not found'}, status=404)