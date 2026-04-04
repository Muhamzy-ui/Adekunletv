#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Create superuser if it doesn't exist
# We use environment variables for security, or defaults for initial setup
if [[ -z "$DJANGO_SUPERUSER_USERNAME" ]]; then
  export DJANGO_SUPERUSER_USERNAME=admin
fi

if [[ -z "$DJANGO_SUPERUSER_PASSWORD" ]]; then
  export DJANGO_SUPERUSER_PASSWORD=AdekunleTV_Admin_2025!
fi

if [[ -z "$DJANGO_SUPERUSER_EMAIL" ]]; then
  export DJANGO_SUPERUSER_EMAIL=admin@adekunletv.com
fi

# Run the custom python script to safely create/update the superuser
python set_admin.py || true

# Auto-seed the database since shell access is unavailable
python manage.py seed_data || true
