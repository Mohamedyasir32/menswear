from django.urls import path
from .views import CreateOrderView, MyOrdersView, AdminOrdersView, AdminOrderUpdateView, AdminOrderDetailView

urlpatterns = [
    path('orders/create/', CreateOrderView.as_view()),
    path('my-orders/', MyOrdersView.as_view()),
    path('admin/orders/', AdminOrdersView.as_view()),
    path('admin/orders/<int:pk>/', AdminOrderDetailView.as_view()),
    path('admin/orders/update/<int:pk>/', AdminOrderUpdateView.as_view()),
]