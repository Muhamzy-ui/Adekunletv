from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

admin.site.unregister(User)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'is_staff', 'is_active', 'date_joined']

# Customize Django Admin branding
admin.site.site_header  = 'Adekunle TV Jerseys Admin'
admin.site.site_title   = 'ATV Admin'
admin.site.index_title  = 'Store Management Dashboard'