from django.contrib import admin
from .models import Hotel, Room, Booking, Review


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'stars', 'created_at']
    list_filter = ['stars', 'city']
    search_fields = ['name', 'city']


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['title', 'hotel', 'price', 'capacity', 'is_available']
    list_filter = ['is_available', 'hotel']
    search_fields = ['title']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['user', 'room', 'check_in', 'check_out', 'created_at']
    list_filter = ['check_in', 'check_out']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'hotel', 'rating', 'created_at']
    list_filter = ['rating']
