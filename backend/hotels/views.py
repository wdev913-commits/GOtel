from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404

from .models import Hotel, Room, Booking, Review
from .serializers import (
    HotelSerializer, RoomSerializer, BookingSerializer,
    AuthSerializer, RegisterSerializer, ReviewSerializer
)


# ─── Function-Based Views ───────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """FBV: Login — returns JWT tokens."""
    serializer = AuthSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """FBV: Logout — blacklists the refresh token."""
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token обязателен.'}, status=status.HTTP_400_BAD_REQUEST)
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Выход выполнен успешно.'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """FBV: Register a new user."""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Class-Based Views (APIView) ────────────────────────────────────────────

class HotelListView(APIView):
    """CBV: List hotels with filtering support."""
    permission_classes = [AllowAny]

    def get(self, request):
        hotels = Hotel.objects.all()

        # Filters
        city = request.query_params.get('city')
        stars = request.query_params.get('stars')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        capacity = request.query_params.get('capacity')
        available = request.query_params.get('available')

        if city:
            hotels = hotels.filter(city__icontains=city)
        if stars:
            hotels = hotels.filter(stars=stars)
        if available and available.lower() == 'true':
            hotels = hotels.filter(rooms__is_available=True).distinct()
        if capacity:
            hotels = hotels.filter(rooms__capacity__gte=capacity).distinct()
        if min_price:
            hotels = hotels.filter(rooms__price__gte=min_price).distinct()
        if max_price:
            hotels = hotels.filter(rooms__price__lte=max_price).distinct()

        serializer = HotelSerializer(hotels, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return Response({'error': 'Недостаточно прав.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = HotelSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HotelDetailView(APIView):
    """CBV: Retrieve, update, delete a hotel."""
    permission_classes = [AllowAny]

    def get(self, request, pk):
        hotel = get_object_or_404(Hotel, pk=pk)
        serializer = HotelSerializer(hotel, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.is_staff:
            return Response({'error': 'Недостаточно прав.'}, status=status.HTTP_403_FORBIDDEN)
        hotel = get_object_or_404(Hotel, pk=pk)
        serializer = HotelSerializer(hotel, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response({'error': 'Недостаточно прав.'}, status=status.HTTP_403_FORBIDDEN)
        hotel = get_object_or_404(Hotel, pk=pk)
        hotel.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RoomListView(APIView):
    """CBV: List rooms for a hotel."""
    permission_classes = [AllowAny]

    def get(self, request, hotel_id):
        rooms = Room.objects.filter(hotel_id=hotel_id)
        serializer = RoomSerializer(rooms, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, hotel_id):
        if not request.user.is_staff:
            return Response({'error': 'Недостаточно прав.'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        data['hotel'] = hotel_id
        serializer = RoomSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingView(APIView):
    """CBV: Full CRUD for bookings."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).select_related('room', 'room__hotel')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        booking = get_object_or_404(Booking, pk=pk, user=request.user)
        serializer = BookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        booking = get_object_or_404(Booking, pk=pk, user=request.user)
        booking.delete()
        return Response({'message': 'Бронирование удалено.'}, status=status.HTTP_204_NO_CONTENT)


class ReviewView(APIView):
    """CBV: Reviews for a hotel."""
    permission_classes = [AllowAny]

    def get(self, request, hotel_id):
        reviews = Review.objects.filter(hotel_id=hotel_id).select_related('user')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, hotel_id):
        if not request.user.is_authenticated:
            return Response({'error': 'Необходима авторизация.'}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data.copy()
        data['hotel'] = hotel_id
        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
