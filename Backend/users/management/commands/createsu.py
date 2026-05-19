from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Create default superuser"

    def handle(self, *args, **kwargs):

        if not User.objects.filter(username="admin").exists():

            User.objects.create_superuser(
                username="zakeeya",
                email="zakeeya18@gmail.com",
                password="zaxya123"
            )

            self.stdout.write(
                self.style.SUCCESS(
                    "Superuser created successfully"
                )
            )

        else:
            self.stdout.write(
                "Superuser already exists"
            )