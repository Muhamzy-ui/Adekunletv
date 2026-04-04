from django.urls import path
from .views import (
    OrderCreateView, PaystackVerifyView,
    AdminOrderListView, AdminOrderDetailView, order_by_ref
)

urlpatterns = [
    # Public
    path('',                    OrderCreateView.as_view(),       name='order-create'),
    path('paystack/verify/',    PaystackVerifyView.as_view(),    name='paystack-verify'),
    path('track/<str:ref>/',    order_by_ref,                    name='order-track'),

    # Admin
    path('admin/',              AdminOrderListView.as_view(),    name='admin-orders'),
    path('admin/<int:pk>/',     AdminOrderDetailView.as_view(),  name='admin-order-detail'),
]