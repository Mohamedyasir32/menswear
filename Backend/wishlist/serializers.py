from rest_framework import serializers
from .models import Wishlist


class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()
    product_category = serializers.CharField(source="product.category", read_only=True)
    product_size = serializers.CharField(source="product.size", read_only=True)
    product_color = serializers.CharField(source="product.color", read_only=True)
    product_stock = serializers.IntegerField(source="product.stock", read_only=True)

    class Meta:
        model = Wishlist
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "product_image",
            "product_category",
            "product_size",
            "product_color",
            "product_stock",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_product_price(self, obj):
        return obj.product.final_price

    def get_product_image(self, obj):
        request = self.context.get("request")

        if obj.product.image:
            url = obj.product.image.url
            return request.build_absolute_uri(url) if request else url

        return obj.product.image_url or None

    def validate(self, data):
        request = self.context.get("request")
        product = data.get("product")

        if request and product:
            exists = Wishlist.objects.filter(
                user=request.user,
                product=product
            ).exists()

            if exists:
                raise serializers.ValidationError(
                    {"product": "Product already exists in wishlist."}
                )

        return data