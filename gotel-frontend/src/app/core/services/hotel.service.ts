import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hotel, Room } from '../../models/hotel.model';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

  getHotels() {
    return this.http.get<Hotel[]>(`${this.apiUrl}/hotels/`);
  }

  getRoomsByHotel(hotelId: number) {
    return this.http.get<Room[]>(`${this.apiUrl}/hotels/${hotelId}/rooms/`);
  }
}
