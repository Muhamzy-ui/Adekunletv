from django.db import models

class TikTokVideo(models.Model):
    title      = models.CharField(max_length=255)
    url        = models.URLField(max_length=500)
    thumbnail  = models.ImageField(upload_to='tiktok/', null=True, blank=True)
    views      = models.CharField(max_length=20, default='0')
    likes      = models.CharField(max_length=20, default='0')
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
