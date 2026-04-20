from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.views import APIView

@api_view(['GET'])
def get_hotels(request):
    hotels = Hotel.objects.all()
    return Response(HotelSerializer(hotels, many=True).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data)
    return Response(serializer.errors)




class BookingList(APIView):
    def get(self, request):
        bookings = Booking.objects.filter(user=request.user)
        return Response(BookingSerializer(bookings, many=True).data)

class BookingDetail(APIView):
    def delete(self, request, pk):
        booking = Booking.objects.get(id=pk)
        booking.delete()
        return Response({"message": "Deleted"})