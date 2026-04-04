from rest_framework import viewsets, permissions
from .models import TikTokVideo
from .serializers import TikTokVideoSerializer

class TikTokVideoViewSet(viewsets.ModelViewSet):
    queryset = TikTokVideo.objects.filter(is_active=True)
    serializer_class = TikTokVideoSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
