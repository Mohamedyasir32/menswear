from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Coupon
from .serializers import CouponSerializer


class ApplyCouponView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = request.data.get("code", "").strip().upper()

        if not code:
            return Response({"error": "Coupon code is required"}, status=400)

        try:
            coupon = Coupon.objects.get(code=code, active=True)
            return Response({
                "code": coupon.code,
                "discount_percent": coupon.discount_percent,
            })
        except Coupon.DoesNotExist:
            return Response({"error": "Invalid or inactive coupon"}, status=400)


class AdminCouponListCreateView(generics.ListCreateAPIView):
    queryset = Coupon.objects.all().order_by("-id")
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminCouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]