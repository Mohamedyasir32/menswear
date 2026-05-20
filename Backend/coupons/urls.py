from django.urls import path
from .views import ApplyCouponView, AdminCouponListCreateView, AdminCouponDetailView

urlpatterns = [
    path("coupon/apply/", ApplyCouponView.as_view()),
    path("admin/coupons/", AdminCouponListCreateView.as_view()),
    path("admin/coupons/<int:pk>/", AdminCouponDetailView.as_view()),
]