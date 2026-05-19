from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="order.user.username", read_only=True)
    product_name = serializers.CharField(source="order.product.name", read_only=True)
    order_status = serializers.CharField(source="order.status", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "username",
            "product_name",
            "payment_method",
            "amount",
            "status",
            "order_status",
            "paid_at",
        ]
        read_only_fields = ["amount", "status", "order_status", "paid_at"]


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["order", "payment_method"]

    def create(self, validated_data):
        order = validated_data["order"]
        payment_method = validated_data["payment_method"]
        user = self.context["request"].user

        if order.user != user:
            raise serializers.ValidationError(
                "You cannot pay for another user's order."
            )

        existing_payment = Payment.objects.filter(order=order).first()

        if existing_payment:
            raise serializers.ValidationError(
                "Payment already exists for this order."
            )

        if payment_method == "Cash on Delivery":
            payment_status = "pending"
            order_status = "pending"
        else:
            payment_status = "success"
            order_status = "confirmed"

        payment = Payment.objects.create(
            order=order,
            payment_method=payment_method,
            amount=order.total_price,
            status=payment_status,
        )

        order.status = order_status
        order.save()

        return payment