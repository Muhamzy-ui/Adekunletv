from rest_framework import serializers
from .models import Jersey, JerseyImage, Club, Category, Review


class ClubSerializer(serializers.ModelSerializer):
    jersey_count = serializers.SerializerMethodField()
    logo         = serializers.SerializerMethodField()

    class Meta:
        model  = Club
        fields = ['id', 'name', 'slug', 'country', 'logo', 'color', 'jersey_count']

    def get_logo(self, obj):
        if obj.logo:
            req = self.context.get('request')
            return req.build_absolute_uri(obj.logo.url) if req else obj.logo.url
        return None

    def get_jersey_count(self, obj):
        return obj.jerseys.filter(is_active=True).count()


class CategorySerializer(serializers.ModelSerializer):
    jersey_count = serializers.SerializerMethodField()

    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug', 'jersey_count']

    def get_jersey_count(self, obj):
        return obj.jerseys.filter(is_active=True).count()


class JerseyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model  = JerseyImage
        fields = ['id', 'image', 'is_primary', 'order']

    def get_image(self, obj):
        if obj.image:
            req = self.context.get('request')
            return req.build_absolute_uri(obj.image.url) if req else obj.image.url
        return None


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Review
        fields = ['id', 'customer', 'city', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']


class JerseyListSerializer(serializers.ModelSerializer):
    club          = ClubSerializer(read_only=True)
    category      = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    total_stock   = serializers.ReadOnlyField()
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model  = Jersey
        fields = [
            'id', 'title', 'slug', 'club', 'category',
            'price', 'old_price', 'sizes', 'badge',
            'is_featured', 'is_new', 'rating', 'review_count',
            'primary_image', 'total_stock', 'discount_percent',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            req = self.context.get('request')
            return req.build_absolute_uri(img.image.url) if req else img.image.url
        return None


class JerseyDetailSerializer(serializers.ModelSerializer):
    club             = ClubSerializer(read_only=True)
    category         = CategorySerializer(read_only=True)
    images           = JerseyImageSerializer(many=True, read_only=True)
    reviews          = ReviewSerializer(many=True, read_only=True, source='reviews.filter(is_approved=True)')
    total_stock      = serializers.ReadOnlyField()
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model  = Jersey
        fields = [
            'id', 'title', 'slug', 'club', 'category',
            'description', 'price', 'old_price', 'sizes',
            'badge', 'is_featured', 'is_new', 'views',
            'rating', 'review_count', 'images', 'reviews',
            'total_stock', 'discount_percent',
            'created_at', 'updated_at',
        ]


class JerseyWriteSerializer(serializers.ModelSerializer):
    """Used by admin to create/update jerseys"""
    club_id     = serializers.PrimaryKeyRelatedField(queryset=Club.objects.all(), source='club')
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category')

    class Meta:
        model  = Jersey
        fields = [
            'title', 'club_id', 'category_id', 'description',
            'price', 'old_price', 'sizes', 'badge',
            'is_featured', 'is_new', 'is_active',
        ]