from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Hotel, Room, Booking, Review
from datetime import date


# ModelSerializer
class HotelSerializer(serializers.ModelSerializer):
    avg_rating = serializers.SerializerMethodField()
    rooms_count = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = ['id', 'name', 'description', 'city', 'address', 'stars',
                  'image', 'created_at', 'avg_rating', 'rooms_count']

    def get_avg_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return None

    def get_rooms_count(self, obj):
        return obj.rooms.filter(is_available=True).count()


# ModelSerializer
class RoomSerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(source='hotel.name', read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'hotel', 'hotel_name', 'title', 'price',
                  'capacity', 'is_available', 'image']


# Serializer with custom validation
class BookingSerializer(serializers.ModelSerializer):
    room_title = serializers.CharField(source='room.title', read_only=True)
    hotel_name = serializers.CharField(source='room.hotel.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'user', 'room', 'room_title', 'hotel_name',
                  'user_name', 'check_in', 'check_out', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate(self, data):
        check_in = data.get('check_in')
        check_out = data.get('check_out')

        if check_in and check_out:
            if check_in >= check_out:
                raise serializers.ValidationError(
                    "Дата выезда должна быть позже даты заезда."
                )
            if check_in < date.today():
                raise serializers.ValidationError(
                    "Дата заезда не может быть в прошлом."
                )

        room = data.get('room')
        if room and not room.is_available:
            raise serializers.ValidationError("Этот номер недоступен для бронирования.")

        # Check overlapping bookings
        if room and check_in and check_out:
            overlapping = Booking.objects.filter(
                room=room,
                check_in__lt=check_out,
                check_out__gt=check_in
            )
            if self.instance:
                overlapping = overlapping.exclude(pk=self.instance.pk)
            if overlapping.exists():
                raise serializers.ValidationError(
                    "Номер уже забронирован на выбранные даты."
                )

        return data


# Auth Serializer (custom)
class AuthSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data.get('username'),
            password=data.get('password')
        )
        if not user:
            raise serializers.ValidationError("Неверный логин или пароль.")
        if not user.is_active:
            raise serializers.ValidationError("Аккаунт деактивирован.")
        data['user'] = user
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Пароли не совпадают.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'hotel', 'rating', 'comment', 'created_at', 'user_name']
        read_only_fields = ['user', 'created_at']
