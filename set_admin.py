import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'adekunletv.settings')
django.setup()

from django.contrib.auth.models import User

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'Admin')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')
email    = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@adekunletv.com')

try:
    user = User.objects.get(username=username)
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print(f"Successfully updated password for user: {username}")
except User.DoesNotExist:
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Successfully created superuser: {username}")
