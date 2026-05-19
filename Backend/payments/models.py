from django.db import models
from orders.models import Order

class Payment(models.Model):
    PAYMENT_STATUS = (
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('pending', 'Pending'),
    )

    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=PAYMENT_STATUS, default='pending')
    paid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order.user.username} - {self.status}"