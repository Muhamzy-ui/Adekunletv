from rest_framework import serializers
from django.conf import settings
from .models import Order, OrderItem
from jerseys.models import Jersey


class OrderItemSerializer(serializers.ModelSerializer):
    jersey_title = serializers.CharField(source='jersey.title', read_only=True)
    jersey_club  = serializers.CharField(source='jersey.club.name', read_only=True)
    subtotal     = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model  = OrderItem
        fields = ['id', 'jersey', 'jersey_title', 'jersey_club', 'size', 'quantity', 'price', 'subtotal']
        read_only_fields = ['price']


class OrderItemCreateSerializer(serializers.Serializer):
    jersey_id = serializers.IntegerField()
    size      = serializers.CharField(max_length=5)
    quantity  = serializers.IntegerField(min_value=1, default=1)

    def validate(self, data):
        try:
            jersey = Jersey.objects.get(id=data['jersey_id'], is_active=True)
        except Jersey.DoesNotExist:
            raise serializers.ValidationError(f"Jersey with id {data['jersey_id']} not found")

        sizes = jersey.sizes or {}
        stock = sizes.get(data['size'], 0)
        if stock < data['quantity']:
            raise serializers.ValidationError(
                f"Only {stock} left in size {data['size']} for {jersey.title}"
            )
        data['jersey'] = jersey
        return data


class OrderCreateSerializer(serializers.Serializer):
    # Customer
    customer_name  = serializers.CharField(max_length=200)
    customer_phone = serializers.CharField(max_length=20)
    customer_email = serializers.EmailField(required=False, allow_blank=True)

    # Delivery
    address  = serializers.CharField()
    city     = serializers.CharField(max_length=100)
    state    = serializers.CharField(max_length=100)
    landmark = serializers.CharField(max_length=200, required=False, allow_blank=True)

    # Payment
    payment_method = serializers.ChoiceField(choices=['Paystack', 'WhatsApp', 'Transfer', 'POD'], default='Paystack')
    notes          = serializers.CharField(required=False, allow_blank=True)

    # Cart items
    items = OrderItemCreateSerializer(many=True)

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Order must have at least one item")
        return items

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        # Calculate totals
        subtotal = sum(
            item['jersey'].price * item['quantity']
            for item in items_data
        )
        delivery_fee = 0 if subtotal >= settings.FREE_DELIVERY_AMOUNT else settings.DELIVERY_FEE
        total = subtotal + delivery_fee

        # Create order
        order = Order.objects.create(
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total=total,
            **validated_data
        )

        # Create order items
        for item in items_data:
            jersey = item['jersey']
            OrderItem.objects.create(
                order=order,
                jersey=jersey,
                size=item['size'],
                quantity=item['quantity'],
                price=jersey.price,
            )

            # Reduce stock
            sizes = jersey.sizes.copy()
            sizes[item['size']] = max(0, sizes.get(item['size'], 0) - item['quantity'])
            Jersey.objects.filter(pk=jersey.pk).update(sizes=sizes)

        return order


class OrderSerializer(serializers.ModelSerializer):
    items       = OrderItemSerializer(many=True, read_only=True)
    item_count  = serializers.ReadOnlyField()
    wa_summary  = serializers.SerializerMethodField()

    class Meta:
        model  = Order
        fields = [
            'id', 'customer_name', 'customer_phone', 'customer_email',
            'address', 'city', 'state', 'landmark',
            'payment_method', 'paystack_ref', 'payment_status',
            'status', 'subtotal', 'delivery_fee', 'total',
            'notes', 'items', 'item_count', 'wa_summary',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['paystack_ref', 'payment_status', 'created_at', 'updated_at']

    def get_wa_summary(self, obj):
        return obj.whatsapp_summary()