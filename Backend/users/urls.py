from django.urls import path
from .views import (
    RegisterView,
    AdminUserListView,
    MeView,
    ProfileView,
    AdminDashboardStatsView
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('me/', MeView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('admin/users/', AdminUserListView.as_view()),
    path('admin/dashboard-stats/', AdminDashboardStatsView.as_view()),
]