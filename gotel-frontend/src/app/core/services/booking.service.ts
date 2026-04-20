import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../../models/hotel.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  getMyBookings() {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/`);
  }

  createBooking(booking: Booking) {
    return this.http.post<Booking>(`${this.apiUrl}/bookings/create/`, booking);
  }

  deleteBooking(id: number) {
    return this.http.delete(`${this.apiUrl}/bookings/${id}/`);
  }
}
