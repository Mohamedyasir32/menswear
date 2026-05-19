from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from products.models import Product
from orders.models import Order
from payments.models import Payment

from .models import UserProfile
from .serializers import RegisterSerializer, UserSerializer, UserProfileSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("-id")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "is_staff": request.user.is_staff,
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_sales = Payment.objects.filter(
            status__in=["paid", "success", "completed"]
        ).aggregate(total=Sum("amount"))["total"] or 0

        return Response({
            "products": Product.objects.count(),
            "users": User.objects.filter(is_staff=False).count(),
            "orders": Order.objects.count(),
            "payments": Payment.objects.count(),
            "low_stock": Product.objects.filter(stock__gt=0, stock__lte=5).count(),
            "out_of_stock": Product.objects.filter(stock__lte=0).count(),
            "total_sales": total_sales,
        })