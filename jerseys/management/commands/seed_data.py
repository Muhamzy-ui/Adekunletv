import os
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from jerseys.models import Club, Category, Jersey, JerseyImage, Review
from brand.models import TikTokVideo

class Command(BaseCommand):
    help = 'Seeds initial data from STATIC_DATA'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        # 1. Categories
        categories_data = [
            {'name':'Home Kits',        'slug':'home'},
            {'name':'Away Kits',        'slug':'away'},
            {'name':'Retro Classics',   'slug':'retro'},
            {'name':'National Teams',   'slug':'national'},
            {'name':'Special Edition',  'slug':'special'},
        ]
        for c in categories_data:
            Category.objects.get_or_create(name=c['name'], defaults={'slug': c['slug']})

        # 2. Clubs
        clubs_data = [
            {'name':'Manchester United', 'slug':'man-united', 'country':'England', 'color':'#E8001E'},
            {'name':'Chelsea',           'slug':'chelsea',    'country':'England', 'color':'#034694'},
            {'name':'Arsenal',           'slug':'arsenal',    'country':'England', 'color':'#EF0107'},
            {'name':'Barcelona',         'slug':'barcelona',  'country':'Spain',   'color':'#A50044'},
            {'name':'Real Madrid',       'slug':'real-madrid','country':'Spain',   'color':'#FEBE10'},
            {'name':'Liverpool',         'slug':'liverpool',  'country':'England', 'color':'#C8102E'},
            {'name':'Nigeria',           'slug':'nigeria',    'country':'Nigeria', 'color':'#008751'},
            {'name':'PSG',               'slug':'psg',        'country':'France',  'color':'#004170'},
            {'name':'Bayern Munich',     'slug':'bayern',     'country':'Germany', 'color':'#DC052D'},
            {'name':'Man City',          'slug':'man-city',   'country':'England', 'color':'#6CABDD'},
        ]
        for c in clubs_data:
            Club.objects.get_or_create(name=c['name'], defaults=c)

        # 3. Jerseys (Simplified import for first 5)
        jerseys_data = [
            {
                'title':'Manchester United Home 2025/26', 'club':'Manchester United', 'category':'Home Kits',
                'price':15000, 'badge':'New', 'is_featured':True, 'slug':'man-united-home-2025',
                'sizes':{"XS":5, "S":8, "M":10, "L":8, "XL":5, "XXL":2},
                'desc':'Official 2025/26 Manchester United home kit. Premium quality fabric.'
            },
            {
                'title':'Nigeria Super Eagles AFCON 2025', 'club':'Nigeria', 'category':'National Teams',
                'price':12000, 'old_price':16000, 'badge':'Hot', 'is_featured':True, 'slug':'nigeria-afcon-2025',
                'sizes':{"XS":3, "S":6, "M":10, "L":8, "XL":5, "XXL":1},
                'desc':'Wear the pride of Nigeria. Official Super Eagles jersey for AFCON 2025.'
            },
            {
                'title':'Nigeria Retro Jersey 1994 World Cup', 'club':'Nigeria', 'category':'Retro Classics',
                'price':18000, 'old_price':22000, 'badge':'Retro', 'is_featured':True, 'slug':'nigeria-retro-1994',
                'sizes':{"XS":1, "S":3, "M":5, "L":4, "XL":2, "XXL":0},
                'desc':"The legendary Nigeria 1994 World Cup jersey."
            },
        ]

        for j in jerseys_data:
            club = Club.objects.get(name=j['club'])
            cat = Category.objects.get(name=j['category'])
            obj, created = Jersey.objects.get_or_create(
                slug=j['slug'],
                defaults={
                    'title': j['title'],
                    'club': club,
                    'category': cat,
                    'price': j['price'],
                    'old_price': j.get('old_price'),
                    'badge': j['badge'],
                    'is_featured': j['is_featured'],
                    'sizes': j['sizes'],
                    'description': j['desc']
                }
            )

        # 4. Reviews
        reviews_data = [
            {'customer':'Chukwuemeka O.', 'city':'Lagos', 'rating':5, 'comment':'Quality is mad 🔥 This is the real plug.', 'jersey_slug':'man-united-home-2025'},
            {'customer':'Biodun A.', 'city':'Ibadan', 'rating':5, 'comment':'Legendary 1994 jersey looks amazing.', 'jersey_slug':'nigeria-retro-1994'},
        ]
        for r in reviews_data:
            try:
                jersey = Jersey.objects.get(slug=r['jersey_slug'])
                Review.objects.get_or_create(
                    customer=r['customer'],
                    jersey=jersey,
                    defaults={'city':r['city'], 'rating':r['rating'], 'comment':r['comment'], 'is_approved':True}
                )
            except Jersey.DoesNotExist:
                pass

        # 5. TikTok (Placeholder)
        TikTokVideo.objects.get_or_create(
            title='Manchester United Home Jersey Review',
            url='https://www.tiktok.com/@adekunle_tv5',
            defaults={'views':'2.1M', 'likes':'180K'}
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded formal data!'))
