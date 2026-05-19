from rest_framework import generics, permissions, serializers
from .models import Review
from .serializers import ReviewSerializer


class ProductReviewsView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Review.objects.filter(
            product_id=self.kwargs["product_id"]
        ).order_by("-created_at")

    def perform_create(self, serializer):
        product_id = self.kwargs["product_id"]

        if Review.objects.filter(
            product_id=product_id,
            user=self.request.user
        ).exists():
            raise serializers.ValidationError(
                "You already reviewed this product."
            )

        serializer.save(
            user=self.request.user,
            product_id=product_id
        )