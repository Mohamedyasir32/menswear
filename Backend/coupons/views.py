from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Coupon


class ApplyCouponView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = request.data.get("code", "").strip().upper()

        if not code:
            return Response(
                {"error": "Coupon code is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            coupon = Coupon.objects.get(code=code, active=True)

            return Response({
                "code": coupon.code,
                "discount_percent": coupon.discount_percent,
            })

        except Coupon.DoesNotExist:
            return Response(
                {"error": "Invalid or inactive coupon"},
                status=status.HTTP_400_BAD_REQUEST,
            )