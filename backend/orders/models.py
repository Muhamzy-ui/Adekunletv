from django.db import models
from django.conf import settings
from jerseys.models import Jersey


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending',    'Pending Payment'),
        ('Paid',       'Payment Confirmed'),
        ('Processing', 'Processing Order'),
        ('Shipped',    'Shipped'),
        ('Delivered',  'Delivered'),
        ('Cancelled',  'Cancelled'),
        ('Refunded',   'Refunded'),
    ]
    PAYMENT_CHOICES = [
        ('Paystack', 'Paystack'),
        ('WhatsApp', 'WhatsApp/Manual'),
        ('Transfer', 'Bank Transfer'),
        ('POD',      'Pay on Delivery'),
    ]

    # Customer details
    customer_name  = models.CharField(max_length=200)
    customer_phone = models.CharField(max_length=20)
    customer_email = models.EmailField(blank=True)

    # Delivery address
    address  = models.TextField()
    city     = models.CharField(max_length=100)
    state    = models.CharField(max_length=100)
    landmark = models.CharField(max_length=200, blank=True)

    # Payment
    payment_method  = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='Paystack')
    paystack_ref    = models.CharField(max_length=200, blank=True, unique=True, null=True)
    payment_status  = models.BooleanField(default=False)

    # Order
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    subtotal        = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_fee    = models.DecimalField(max_digits=8, decimal_places=2, default=2500)
    total           = models.DecimalField(max_digits=12, decimal_places=2)
    notes           = models.TextField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Order #{self.id} — {self.customer_name} — {self.status}'

    def item_count(self):
        return self.items.aggregate(total=models.Sum('quantity'))['total'] or 0

    def whatsapp_summary(self):
        """Generate WhatsApp order summary message"""
        items = '\n'.join([
            f'• {i.jersey.title} (Size {i.size}) ×{i.quantity} = ₦{i.subtotal:,.0f}'
            for i in self.items.all()
        ])
        return (
            f'🧾 ORDER CONFIRMATION\n'
            f'Order #{self.id}\n\n'
            f'{items}\n\n'
            f'Subtotal: ₦{self.subtotal:,.0f}\n'
            f'Delivery: ₦{self.delivery_fee:,.0f}\n'
            f'TOTAL: ₦{self.total:,.0f}\n\n'
            f'Deliver to: {self.address}, {self.city}, {self.state}\n'
            f'Phone: {self.customer_phone}'
        )


class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    jersey   = models.ForeignKey(Jersey, on_delete=models.PROTECT, related_name='order_items')
    size     = models.CharField(max_length=5)
    quantity = models.PositiveSmallIntegerField(default=1)
    price    = models.DecimalField(max_digits=10, decimal_places=2)  # price at time of order

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f'{self.jersey.title} ({self.size}) ×{self.quantity}'

    @property
    def subtotal(self):
        return self.price * self.quantity