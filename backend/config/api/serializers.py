from rest_framework import serializers
from .models import *

# ModelSerializer
class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'
class RoomSerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(source='hotel.name', read_only=True)

    class Meta:
        model = Room
        fields = '__all__'
class BookingSerializer(serializers.ModelSerializer):
    room_info = RoomSerializer(source='room', read_only=True)
    hotel_name = serializers.CharField(source='room.hotel.name', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'

# Serializer (custom)
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

