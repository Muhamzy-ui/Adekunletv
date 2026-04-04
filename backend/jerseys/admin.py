from django.contrib import admin
from django.utils.html import format_html
from .models import Jersey, JerseyImage, Club, Category, Review


class JerseyImageInline(admin.TabularInline):
    model   = JerseyImage
    extra   = 3
    fields  = ['image', 'is_primary', 'order']

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:60px;border-radius:4px;"/>', obj.image.url)
        return '—'
    image_preview.short_description = 'Preview'
    readonly_fields = ['image_preview']


@admin.register(Jersey)
class JerseyAdmin(admin.ModelAdmin):
    list_display  = ['title', 'club', 'category', 'price', 'old_price', 'badge', 'total_stock', 'is_featured', 'is_new', 'is_active', 'created_at']
    list_filter   = ['club', 'category', 'badge', 'is_featured', 'is_new', 'is_active']
    list_editable = ['is_featured', 'is_new', 'is_active', 'badge']
    search_fields = ['title', 'club__name']
    prepopulated_fields = {'slug': ('title',)}
    inlines       = [JerseyImageInline]
    readonly_fields = ['views', 'rating', 'review_count', 'created_at', 'updated_at', 'discount_percent']
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'slug', 'club', 'category', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'old_price', 'discount_percent')
        }),
        ('Stock (JSON format: {"S":5,"M":10,"L":8})', {
            'fields': ('sizes',)
        }),
        ('Display', {
            'fields': ('badge', 'is_featured', 'is_new', 'is_active')
        }),
        ('Stats', {
            'fields': ('views', 'rating', 'review_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def total_stock(self, obj):
        total = obj.total_stock()
        color = 'green' if total > 5 else 'orange' if total > 0 else 'red'
        return format_html('<span style="color:{};font-weight:600;">{}</span>', color, total)
    total_stock.short_description = 'Stock'


@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'country', 'color', 'order']
    list_editable = ['order']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'slug', 'order']
    list_editable = ['order']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ['customer', 'jersey', 'rating', 'city', 'is_approved', 'created_at']
    list_filter   = ['is_approved', 'rating']
    list_editable = ['is_approved']
    search_fields = ['customer', 'jersey__title']