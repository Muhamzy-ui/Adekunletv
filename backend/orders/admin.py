from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model          = OrderItem
    extra          = 0
    readonly_fields = ['jersey', 'size', 'quantity', 'price', 'subtotal']
    can_delete     = False

    def subtotal(self, obj):
        return f'₦{obj.subtotal:,.0f}'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display  = ['id', 'customer_name', 'customer_phone', 'city', 'state',
                     'payment_method', 'payment_badge', 'status', 'total_display', 'created_at']
    list_filter   = ['status', 'payment_method', 'payment_status', 'city', 'state']
    list_editable = ['status']
    search_fields = ['customer_name', 'customer_phone', 'paystack_ref']
    readonly_fields = ['subtotal', 'delivery_fee', 'total', 'paystack_ref',
                       'payment_status', 'created_at', 'updated_at', 'whatsapp_link']
    inlines       = [OrderItemInline]

    fieldsets = (
        ('Customer', {
            'fields': ('customer_name', 'customer_phone', 'customer_email')
        }),
        ('Delivery', {
            'fields': ('address', 'city', 'state', 'landmark')
        }),
        ('Payment', {
            'fields': ('payment_method', 'paystack_ref', 'payment_status')
        }),
        ('Order', {
            'fields': ('status', 'subtotal', 'delivery_fee', 'total', 'notes')
        }),
        ('Links', {
            'fields': ('whatsapp_link',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def payment_badge(self, obj):
        color = 'green' if obj.payment_status else 'red'
        label = 'Paid' if obj.payment_status else 'Unpaid'
        return format_html('<span style="color:{};font-weight:600;">{}</span>', color, label)
    payment_badge.short_description = 'Payment'

    def total_display(self, obj):
        return format_html('<strong>₦{:,.0f}</strong>', obj.total)
    total_display.short_description = 'Total'

    def whatsapp_link(self, obj):
        msg = obj.whatsapp_summary().replace('\n', '%0A')
        url = f'https://wa.me/{obj.customer_phone.replace("+","").replace(" ","")}?text={msg}'
        return format_html('<a href="{}" target="_blank" class="button">📱 WhatsApp Customer</a>', url)
    whatsapp_link.short_description = 'WhatsApp'