import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Hotel, Room } from '../../models/hotel.model';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

  getHotels(filters?: { min_price?: number; max_price?: number; stars?: number }) {
    let params = new HttpParams();
    if (filters?.min_price) params = params.set('min_price', filters.min_price);
    if (filters?.max_price) params = params.set('max_price', filters.max_price);
    if (filters?.stars) params = params.set('stars', filters.stars);
    return this.http.get<Hotel[]>(`${this.apiUrl}/hotels/`, { params });
  }

  getHotelById(id: number) {
    return this.http.get<Hotel>(`${this.apiUrl}/hotels/${id}/`);
  }

  getRoomsByHotel(hotelId: number) {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms/?hotel=${hotelId}`);
  }
}
