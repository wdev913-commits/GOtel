from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    get_hotels,
    create_booking,
    BookingList,
    BookingDetail,
)

urlpatterns = [
    # 🔐 AUTH (JWT)
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),

    # 🏨 HOTELS (FBV)
    path('hotels/', get_hotels, name='get_hotels'),

    # 📅 BOOKINGS (FBV + CBV)
    path('bookings/create/', create_booking, name='create_booking'),   # POST
    path('bookings/', BookingList.as_view(), name='booking_list'),     # GET
    path('bookings/<int:pk>/', BookingDetail.as_view(), name='booking_detail'),  # DELETE
]