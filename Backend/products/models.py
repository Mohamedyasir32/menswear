from django.db import models


class Product(models.Model):

    CATEGORY_CHOICES = [
        ("Tshirt", "Tshirt"),
        ("Shirt", "Shirt"),
        ("Jeans", "Jeans"),
        ("Shoes", "Shoes"),
        ("Jacket", "Jacket"),
        ("Hoodie", "Hoodie"),
    ]

    SIZE_CHOICES = [
        ("S", "Small"),
        ("M", "Medium"),
        ("L", "Large"),
        ("XL", "Extra Large"),
        ("XXL", "Double XL"),
    ]

    name = models.CharField(max_length=150)

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    size = models.CharField(
        max_length=10,
        choices=SIZE_CHOICES
    )

    color = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    stock = models.PositiveIntegerField(default=0)

    sku = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True
    )

    brand = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True
    )

    image_url = models.URLField(
        blank=True,
        null=True
    )

    is_featured = models.BooleanField(default=False)

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    @property
    def final_price(self):
        return self.discount_price if self.discount_price else self.price

    @property
    def stock_status(self):
        if self.stock <= 0:
            return "Out of Stock"
        elif self.stock <= 5:
            return "Low Stock"
        return "In Stock"