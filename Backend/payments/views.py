from rest_framework import generics, permissions
from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer

class CreatePaymentView(generics.CreateAPIView):
    serializer_class = PaymentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class MyPaymentsView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user).order_by('-paid_at')


class AdminPaymentsView(generics.ListAPIView):
    queryset = Payment.objects.all().order_by('-paid_at')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAdminUser]