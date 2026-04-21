import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel, Room, Booking, Review, AuthResponse, HotelFilter } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // ─── Auth ─────────────────────────────────────────────
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login/`, { username, password });
  }

  logout(refresh: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout/`, { refresh });
  }

  register(username: string, email: string, password: string, password2: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register/`, { username, email, password, password2 });
  }

  // ─── Hotels ───────────────────────────────────────────
  getHotels(filters?: HotelFilter): Observable<Hotel[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params = params.set(key, String(value));
        }
      });
    }
    return this.http.get<Hotel[]>(`${this.baseUrl}/hotels/`, { params });
  }

  getHotel(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.baseUrl}/hotels/${id}/`);
  }

  createHotel(data: Partial<Hotel>): Observable<Hotel> {
    return this.http.post<Hotel>(`${this.baseUrl}/hotels/`, data);
  }

  updateHotel(id: number, data: Partial<Hotel>): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.baseUrl}/hotels/${id}/`, data);
  }

  deleteHotel(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/hotels/${id}/`);
  }

  // ─── Rooms ────────────────────────────────────────────
  getRooms(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/hotels/${hotelId}/rooms/`);
  }

  // ─── Bookings ─────────────────────────────────────────
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/`);
  }

  createBooking(data: { room: number; check_in: string; check_out: string }): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/bookings/`, data);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/bookings/${id}/`);
  }

  // ─── Reviews ──────────────────────────────────────────
  getReviews(hotelId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/hotels/${hotelId}/reviews/`);
  }

  createReview(hotelId: number, data: { rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/hotels/${hotelId}/reviews/`, data);
  }
}
