from rest_framework import serializers
from .models import *

# ModelSerializer
class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

# Serializer (custom)
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class RoomSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    number = serializers.IntegerField()
    price = serializers.FloatField()