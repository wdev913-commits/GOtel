"""
Run: python seed_data.py
Creates sample hotels, rooms, and a test user.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hotel_booking.settings')
django.setup()

from django.contrib.auth.models import User
from hotels.models import Hotel, Room

# Create superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@hotel.com', 'admin123')
    print("✅ Superuser created: admin / admin123")

# Create test user
if not User.objects.filter(username='testuser').exists():
    User.objects.create_user('testuser', 'test@hotel.com', 'test123')
    print("✅ Test user created: testuser / test123")

# Sample hotels
hotels_data = [
    {
        'name': 'Grand Palace Hotel',
        'description': 'Роскошный отель в самом сердце города с безупречным сервисом и видом на исторический центр.',
        'city': 'Москва',
        'address': 'ул. Тверская, 1',
        'stars': 5,
    },
    {
        'name': 'Astana Hilton',
        'description': 'Современный бизнес-отель с панорамным видом на столицу Казахстана.',
        'city': 'Астана',
        'address': 'пр. Нурсултан, 55',
        'stars': 5,
    },
    {
        'name': 'Comfort Inn',
        'description': 'Уютный отель для деловых поездок и семейного отдыха по доступным ценам.',
        'city': 'Алматы',
        'address': 'ул. Абая, 100',
        'stars': 3,
    },
    {
        'name': 'Sea View Resort',
        'description': 'Курортный отель с прямым выходом на пляж и всеми удобствами для релакса.',
        'city': 'Актау',
        'address': 'Набережная, 15',
        'stars': 4,
    },
    {
        'name': 'City Express',
        'description': 'Бюджетный отель в центре города, идеально подходит для краткосрочных поездок.',
        'city': 'Москва',
        'address': 'ул. Садовая, 22',
        'stars': 2,
    },
]

for data in hotels_data:
    hotel, created = Hotel.objects.get_or_create(name=data['name'], defaults=data)
    if created:
        print(f"✅ Hotel created: {hotel.name}")
        # Add rooms
        rooms = [
            {'title': 'Стандарт', 'price': 5000 * hotel.stars, 'capacity': 2, 'is_available': True},
            {'title': 'Делюкс', 'price': 8000 * hotel.stars, 'capacity': 2, 'is_available': True},
            {'title': 'Семейный', 'price': 12000 * hotel.stars, 'capacity': 4, 'is_available': True},
            {'title': 'Люкс', 'price': 20000 * hotel.stars, 'capacity': 2, 'is_available': True},
        ]
        for room_data in rooms:
            Room.objects.create(hotel=hotel, **room_data)
        print(f"   ✅ {len(rooms)} rooms created")

print("\n🏨 Seed data loaded successfully!")
print("📝 Credentials:")
print("   Admin:    admin / admin123")
print("   Test user: testuser / test123")
