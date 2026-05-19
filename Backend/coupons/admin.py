from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Coupon


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ("id", "code", "discount_percent", "active")
    list_filter = ("active",)
    search_fields = ("code",)