from django.urls import path
from . import views

urlpatterns = [
    # Auth (FBV)
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/register/', views.register_view, name='register'),

    # Hotels (CBV)
    path('hotels/', views.HotelListView.as_view(), name='hotel-list'),
    path('hotels/<int:pk>/', views.HotelDetailView.as_view(), name='hotel-detail'),

    # Rooms (CBV)
    path('hotels/<int:hotel_id>/rooms/', views.RoomListView.as_view(), name='room-list'),

    # Bookings (CBV - CRUD)
    path('bookings/', views.BookingView.as_view(), name='booking-list'),
    path('bookings/<int:pk>/', views.BookingView.as_view(), name='booking-detail'),

    # Reviews (CBV)
    path('hotels/<int:hotel_id>/reviews/', views.ReviewView.as_view(), name='review-list'),
]
