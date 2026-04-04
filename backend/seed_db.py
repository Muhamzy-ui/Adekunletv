from jerseys.models import Club, Category, Jersey, JerseyImage, Review
from django.utils.text import slugify

# ── Categories ────────────────────────────────────────────────
categories = [
    {'name': 'Home Kits',      'slug': 'home',     'order': 1},
    {'name': 'Away Kits',      'slug': 'away',     'order': 2},
    {'name': 'Retro Classics', 'slug': 'retro',    'order': 3},
    {'name': 'National Teams', 'slug': 'national', 'order': 4},
    {'name': 'Special Edition','slug': 'special',  'order': 5},
]

for cat in categories:
    Category.objects.get_or_create(slug=cat['slug'], defaults=cat)

# ── Clubs ─────────────────────────────────────────────────────
clubs = [
    {'name': 'Manchester United', 'country': 'England', 'color': '#E8001E', 'order': 1},
    {'name': 'Chelsea',           'country': 'England', 'color': '#034694', 'order': 2},
    {'name': 'Arsenal',           'country': 'England', 'color': '#EF0107', 'order': 3},
    {'name': 'Barcelona',         'country': 'Spain',   'color': '#A50044', 'order': 4},
    {'name': 'Real Madrid',       'country': 'Spain',   'color': '#FEBE10', 'order': 5},
    {'name': 'Liverpool',         'country': 'England', 'color': '#C8102E', 'order': 6},
    {'name': 'Nigeria',           'country': 'Nigeria', 'color': '#008751', 'order': 7},
    {'name': 'PSG',               'country': 'France',  'color': '#004170', 'order': 8},
    {'name': 'Bayern Munich',     'country': 'Germany', 'color': '#DC052D', 'order': 9},
    {'name': 'Man City',          'country': 'England', 'color': '#6CABDD', 'order': 10},
    {'name': 'Tottenham',         'country': 'England', 'color': '#132257', 'order': 11},
    {'name': 'Inter Milan',       'country': 'Italy',   'color': '#0068A8', 'order': 12},
    {'name': 'AC Milan',          'country': 'Italy',   'color': '#FB090B', 'order': 13},
    {'name': 'Juventus',          'country': 'Italy',   'color': '#000000', 'order': 14},
    {'name': 'Dortmund',          'country': 'Germany', 'color': '#FDE100', 'order': 15},
    {'name': 'Atletico Madrid',   'country': 'Spain',   'color': '#CB3524', 'order': 16},
    {'name': 'Napoli',            'country': 'Italy',   'color': '#12A0D7', 'order': 17},
]

for cl in clubs:
    Club.objects.update_or_create(name=cl['name'], defaults=cl)

# ── Jerseys ────────────────────────────────────────────────────
# Extracting some from data.js
jerseys_data = [
    {
        'title': 'Manchester United Home 2025/26',
        'club': 'Manchester United', 'category': 'Home Kits', 'price': 15000,
        'sizes': {"XS": 5, "S": 8, "M": 0, "L": 6, "XL": 4, "XXL": 2},
        'badge': 'New', 'is_featured': True, 'rating': 4.8, 'review_count': 124,
        'description': 'Official 2025/26 Manchester United home kit. Premium quality fabric. Nike Dri-FIT technology.'
    },
    {
        'title': 'Nigeria Super Eagles AFCON 2025',
        'club': 'Nigeria', 'category': 'National Teams', 'price': 12000, 'old_price': 16000,
        'sizes': {"XS": 3, "S": 6, "M": 10, "L": 8, "XL": 5, "XXL": 1},
        'badge': 'Hot', 'is_featured': True, 'rating': 4.9, 'review_count': 89,
        'description': 'Wear the pride of Nigeria. Official Super Eagles jersey for AFCON 2025. Green and white perfection.'
    },
    {
        'title': 'Chelsea FC Home Kit 2025/26',
        'club': 'Chelsea', 'category': 'Home Kits', 'price': 14000,
        'sizes': {"XS": 2, "S": 5, "M": 7, "L": 9, "XL": 6, "XXL": 3},
        'badge': 'New', 'is_featured': True, 'rating': 4.7, 'review_count': 67,
        'description': 'Chelsea FC official home kit 2025/26. Iconic blue. Puma quality.'
    },
    {
        'title': 'FC Barcelona Home 2025/26',
        'club': 'Barcelona', 'category': 'Home Kits', 'price': 14500,
        'sizes': {"XS": 0, "S": 4, "M": 8, "L": 10, "XL": 7, "XXL": 2},
        'badge': 'New', 'is_featured': False, 'rating': 4.8, 'review_count': 92,
        'description': 'FC Barcelona 2025/26 home jersey. Classic blaugrana stripes. Nike Dri-FIT.'
    },
    {
        'title': 'Nigeria Retro Jersey 1994 World Cup',
        'club': 'Nigeria', 'category': 'Retro Classics', 'price': 18000, 'old_price': 22000,
        'sizes': {"XS": 1, "S": 3, "M": 5, "L": 4, "XL": 2, "XXL": 0},
        'badge': 'Retro', 'is_featured': True, 'rating': 5.0, 'review_count': 156,
        'description': 'The legendary Nigeria 1994 World Cup jersey.'
    },
    {
        'title': 'Real Madrid Home 2025/26',
        'club': 'Real Madrid', 'category': 'Home Kits', 'price': 15500,
        'sizes': {"XS": 4, "S": 6, "M": 9, "L": 11, "XL": 8, "XXL": 3},
        'badge': None, 'is_featured': False, 'rating': 4.6, 'review_count': 78,
        'description': 'Real Madrid official home kit 2025/26. Pure white. Adidas quality.'
    },
]

for jd in jerseys_data:
    club = Club.objects.get(name=jd['club'])
    cat = Category.objects.get(name=jd['category'])
    
    jersey, created = Jersey.objects.update_or_create(
        title=jd['title'],
        defaults={
            'club': club,
            'category': cat,
            'price': jd['price'],
            'old_price': jd.get('old_price'),
            'sizes': jd['sizes'],
            'badge': jd['badge'],
            'is_featured': jd['is_featured'],
            'rating': jd['rating'],
            'review_count': jd['review_count'],
            'description': jd['description']
        }
    )
    print(f"{'Created' if created else 'Updated'} jersey: {jersey.title}")

print("Seeding complete!")
