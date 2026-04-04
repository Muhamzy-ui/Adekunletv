from django.contrib import admin
from .models import TikTokVideo

@admin.register(TikTokVideo)
class TikTokVideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'views', 'likes', 'created_at', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'url')
