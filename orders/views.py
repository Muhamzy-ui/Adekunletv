import hmac
import hashlib
import json
import requests

from django.conf import settings
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer


class OrderCreateView(generics.CreateAPIView):
    """Public — anyone can place an order"""
    serializer_class   = OrderCreateSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        response_data = OrderSerializer(order).data

        # If Paystack payment, initialize transaction
        if order.payment_method == 'Paystack' and settings.PAYSTACK_SECRET_KEY:
            try:
                paystack_resp = requests.post(
                    'https://api.paystack.co/transaction/initialize',
                    headers={
                        'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
                        'Content-Type': 'application/json',
                    },
                    json={
                        'email':     order.customer_email or f'order{order.id}@adekunletv.com',
                        'amount':    int(order.total * 100),  # kobo
                        'reference': f'ATV-{order.id}-{order.created_at.strftime("%Y%m%d%H%M%S")}',
                        'callback_url': f'{request.build_absolute_uri("/api/orders/paystack/verify/")}',
                        'metadata': {
                            'order_id':      order.id,
                            'customer_name': order.customer_name,
                            'custom_fields': [
                                {'display_name': 'Order ID', 'variable_name': 'order_id', 'value': str(order.id)},
                            ]
                        }
                    }
                )
                ps_data = paystack_resp.json()
                if ps_data.get('status'):
                    ref = ps_data['data']['reference']
                    Order.objects.filter(pk=order.pk).update(paystack_ref=ref)
                    response_data['paystack_url'] = ps_data['data']['authorization_url']
                    response_data['paystack_ref'] = ref
            except Exception as e:
                response_data['paystack_error'] = str(e)

        return Response(response_data, status=status.HTTP_201_CREATED)


class PaystackVerifyView(APIView):
    """Called by Paystack after payment"""
    permission_classes = [AllowAny]

    def get(self, request):
        ref = request.query_params.get('reference') or request.query_params.get('trxref')
        if not ref:
            return Response({'error': 'No reference provided'}, status=400)
        return self._verify(ref)

    def post(self, request):
        """Paystack webhook"""
        payload   = request.body
        signature = request.headers.get('X-Paystack-Signature', '')

        if settings.PAYSTACK_SECRET_KEY:
            expected = hmac.new(
                settings.PAYSTACK_SECRET_KEY.encode('utf-8'),
                payload, hashlib.sha512
            ).hexdigest()
            if not hmac.compare_digest(expected, signature):
                return Response({'error': 'Invalid signature'}, status=400)

        data  = json.loads(payload)
        event = data.get('event', '')
        if event == 'charge.success':
            ref = data['data']['reference']
            self._verify(ref)

        return Response({'message': 'OK'})

    def _verify(self, ref):
        try:
            resp = requests.get(
                f'https://api.paystack.co/transaction/verify/{ref}',
                headers={'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}'}
            )
            data = resp.json()
            if data.get('status') and data['data']['status'] == 'success':
                # Find and update order
                order = Order.objects.filter(paystack_ref=ref).first()
                if order and not order.payment_status:
                    order.payment_status = True
                    order.status = 'Paid'
                    order.save()
                return Response({
                    'message': 'Payment verified',
                    'order_id': order.id if order else None,
                    'status': 'success'
                })
            return Response({'message': 'Payment not successful', 'status': 'failed'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class AdminOrderListView(generics.ListAPIView):
    """Admin — view all orders"""
    serializer_class   = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs     = Order.objects.prefetch_related('items__jersey').order_by('-created_at')
        status = self.request.query_params.get('status')
        paid   = self.request.query_params.get('paid')
        if status: qs = qs.filter(status=status)
        if paid:   qs = qs.filter(payment_status=paid == 'true')
        return qs


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    """Admin — view + update single order status"""
    serializer_class   = OrderSerializer
    permission_classes = [IsAuthenticated]
    queryset           = Order.objects.prefetch_related('items__jersey')

    def partial_update(self, request, *args, **kwargs):
        order      = self.get_object()
        new_status = request.data.get('status')
        if new_status and new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save()
        return Response(OrderSerializer(order).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def order_by_ref(request, ref):
    """Customer can track their order by Paystack reference"""
    try:
        order = Order.objects.get(paystack_ref=ref)
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)