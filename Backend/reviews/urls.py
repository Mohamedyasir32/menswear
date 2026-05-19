from django.urls import path
from .views import ProductReviewsView

urlpatterns = [
    path('products/<int:product_id>/reviews/', ProductReviewsView.as_view()),
]