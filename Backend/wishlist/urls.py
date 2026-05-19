from django.urls import path
from .views import WishlistListCreateView, WishlistDeleteView

urlpatterns = [
    path('wishlist/', WishlistListCreateView.as_view()),
    path('wishlist/delete/<int:pk>/', WishlistDeleteView.as_view()),
]