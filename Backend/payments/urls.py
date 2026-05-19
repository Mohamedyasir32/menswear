from django.urls import path
from .views import CreatePaymentView, MyPaymentsView, AdminPaymentsView

urlpatterns = [
    path('payments/create/', CreatePaymentView.as_view()),
    path('my-payments/', MyPaymentsView.as_view()),
    path('admin/payments/', AdminPaymentsView.as_view()),
]