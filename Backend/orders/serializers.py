from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.SerializerMethodField()
    product_size = serializers.CharField(source="product.size", read_only=True)
    product_color = serializers.CharField(source="product.color", read_only=True)
    product_brand = serializers.CharField(source="product.brand", read_only=True)

    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "username",
            "email",
            "phone",
            "address",
            "product",
            "product_name",
            "product_image",
            "product_size",
            "product_color",
            "product_brand",
            "quantity",
            "total_price",
            "status",
            "ordered_at",
        ]
        read_only_fields = [
            "user",
            "username",
            "email",
            "total_price",
            "ordered_at",
        ]

    def get_product_image(self, obj):
        request = self.context.get("request")

        if obj.product.image:
            url = obj.product.image.url
            return request.build_absolute_uri(url) if request else url

        return obj.product.image_url or None


class OrderCreateSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "phone",
            "address",
            "total_price",
            "status",
            "ordered_at",
        ]
        read_only_fields = [
            "id",
            "product_name",
            "total_price",
            "status",
            "ordered_at",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value

    def create(self, validated_data):
        product = validated_data["product"]
        quantity = validated_data["quantity"]
        user = self.context["request"].user

        if product.stock < quantity:
            raise serializers.ValidationError("Not enough stock available.")

        total_price = product.final_price * quantity

        product.stock -= quantity
        product.save()

        return Order.objects.create(
            user=user,
            product=product,
            quantity=quantity,
            phone=validated_data.get("phone", ""),
            address=validated_data.get("address", ""),
            total_price=total_price,
        )


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]