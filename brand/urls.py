from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TikTokVideoViewSet

router = DefaultRouter()
router.register('tiktok', TikTokVideoViewSet, basename='tiktok')

urlpatterns = [
    path('', include(router.urls)),
]
