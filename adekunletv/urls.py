from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView, TokenBlacklistView
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # JWT Auth
    path('api/auth/token/',          TokenObtainPairView.as_view(),   name='token_obtain'),
    path('api/auth/token/refresh/',  TokenRefreshView.as_view(),      name='token_refresh'),
    path('api/auth/token/blacklist/', TokenBlacklistView.as_view(),   name='token_blacklist'),

    # API apps
    path('api/jerseys/',   include('jerseys.urls')),
    path('api/orders/',    include('orders.urls')),
    path('api/brand/',     include('brand.urls')),
    path('api/blog/',      include('blog.urls')),
    path('api/newsletter/',include('newsletter.urls')),
    path('api/contact/',   include('contact.urls')),

    # API Docs
    path('api/schema/',    SpectacularAPIView.as_view(),              name='schema'),
    path('api/docs/',      SpectacularSwaggerView.as_view(url_name='schema'), name='swagger'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)