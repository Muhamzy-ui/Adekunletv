from django.db import models
from django.utils.text import slugify


class Club(models.Model):
    name    = models.CharField(max_length=100, unique=True)
    slug    = models.SlugField(unique=True, blank=True)
    country = models.CharField(max_length=100, blank=True)
    logo    = models.ImageField(upload_to='clubs/', null=True, blank=True)
    color   = models.CharField(max_length=7, default='#E8001E', help_text='Hex color e.g. #E8001E')
    order   = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Category(models.Model):
    name  = models.CharField(max_length=100, unique=True)
    slug  = models.SlugField(unique=True, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Jersey(models.Model):
    BADGE_CHOICES = [
        ('New',   'New Arrival'),
        ('Hot',   'Hot Seller'),
        ('Retro', 'Retro Classic'),
        ('Sale',  'On Sale'),
    ]

    # Core fields
    title       = models.CharField(max_length=250)
    slug        = models.SlugField(unique=True, blank=True, max_length=260)
    club        = models.ForeignKey(Club, on_delete=models.SET_NULL, null=True, related_name='jerseys')
    category    = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='jerseys')
    description = models.TextField(blank=True)

    # Pricing
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    old_price   = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Stock per size (JSON: {"XS":5, "S":8, "M":10, "L":8, "XL":5, "XXL":2})
    sizes       = models.JSONField(default=dict, help_text='Size:Stock pairs e.g. {"S":5,"M":10,"L":8}')

    # Display
    badge       = models.CharField(max_length=20, choices=BADGE_CHOICES, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_new      = models.BooleanField(default=True)
    is_active   = models.BooleanField(default=True)

    # Stats
    views       = models.PositiveIntegerField(default=0)
    rating      = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    review_count = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering  = ['-created_at']
        verbose_name_plural = 'Jerseys'

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug, n = base, 1
            while Jersey.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base}-{n}'; n += 1
            self.slug = slug
        # Auto WhatsApp link in description if empty
        super().save(*args, **kwargs)

    def total_stock(self):
        return sum(self.sizes.values()) if self.sizes else 0

    def discount_percent(self):
        if self.old_price and self.old_price > self.price:
            return round((1 - float(self.price) / float(self.old_price)) * 100)
        return 0

    def __str__(self):
        return self.title


class JerseyImage(models.Model):
    jersey     = models.ForeignKey(Jersey, on_delete=models.CASCADE, related_name='images')
    image      = models.ImageField(upload_to='jerseys/')
    is_primary = models.BooleanField(default=False)
    order      = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.jersey.title} — Image {self.order}'


class Review(models.Model):
    jersey      = models.ForeignKey(Jersey, on_delete=models.CASCADE, related_name='reviews')
    customer    = models.CharField(max_length=150)
    city        = models.CharField(max_length=100, blank=True)
    rating      = models.PositiveSmallIntegerField(default=5)
    comment     = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.customer} — {self.jersey.title} ({self.rating}★)'