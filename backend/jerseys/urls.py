from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JerseyViewSet, ClubViewSet, CategoryViewSet

router = DefaultRouter()
router.register('clubs',      ClubViewSet,    basename='club')
router.register('categories', CategoryViewSet, basename='category')
router.register('',           JerseyViewSet,  basename='jersey')

urlpatterns = [path('', include(router.urls))]