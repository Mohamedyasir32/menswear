from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    final_price = serializers.ReadOnlyField()
    stock_status = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_image(self, obj):
        request = self.context.get("request")

        if obj.image:
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url

        return obj.image_url or None

    def validate(self, data):
        price = data.get("price", getattr(self.instance, "price", None))
        discount_price = data.get(
            "discount_price",
            getattr(self.instance, "discount_price", None),
        )

        if price is not None and price <= 0:
            raise serializers.ValidationError({
                "price": "Price must be greater than 0."
            })

        if discount_price is not None and price is not None:
            if discount_price >= price:
                raise serializers.ValidationError({
                    "discount_price": "Discount price must be less than price."
                })

        return data