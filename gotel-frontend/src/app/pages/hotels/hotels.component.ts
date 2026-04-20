import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Hotel, Room, Booking } from '../../models/hotel.model';
import { HotelService } from '../../core/services/hotel.service';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './hotels.component.html'
})
export class HotelsComponent implements OnInit {
  private hotelService = inject(HotelService);
  private bookingService = inject(BookingService);

  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  rooms: Room[] = [];

  // ── Filter form controls ([(ngModel)]) ──────────────────
  searchDestination = '';   // form control 1
  priceMax = 150000;        // form control 2
  priceMin = 5000;          // form control 3
  selectedStars = 0;        // form control 4

  // ── Booking modal ────────────────────────────────────────
  showModal = false;
  selectedHotel: Hotel | null = null;
  checkIn = '';             // form control 5
  checkOut = '';            // form control 6
  guests = 2;               // form control 7
  selectedRoomId: number | null = null;  // form control 8

  // ── State ────────────────────────────────────────────────
  isLoading = false;
  loadError = '';
  bookingError = '';
  bookingSuccess = false;
  bookingLoading = false;

  ngOnInit() {
    this.loadHotels(); // click event 1 equivalent — also called on init
  }

  // ── CLICK EVENT 1: Load / Search hotels ──────────────────
  loadHotels() {
    this.isLoading = true;
    this.loadError = '';
    this.hotelService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'Ошибка загрузки отелей. Проверьте подключение.';
        this.isLoading = false;
      }
    });
  }

  // ── CLICK EVENT 2: Apply filters ─────────────────────────
  applyFilters() {
    this.filteredHotels = this.hotels.filter(h => {
      const matchPrice = h.price >= this.priceMin && h.price <= this.priceMax;
      const matchDest = !this.searchDestination ||
        h.name.toLowerCase().includes(this.searchDestination.toLowerCase()) ||
        h.location.toLowerCase().includes(this.searchDestination.toLowerCase());
      const matchStars = this.selectedStars === 0 || h.stars === this.selectedStars;
      return matchPrice && matchDest && matchStars;
    });
  }

  resetFilters() {
    this.searchDestination = '';
    this.priceMin = 5000;
    this.priceMax = 150000;
    this.selectedStars = 0;
    this.applyFilters();
  }

  // ── CLICK EVENT 3: Open booking modal ────────────────────
  openBooking(hotel: Hotel) {
    this.selectedHotel = hotel;
    this.bookingError = '';
    this.bookingSuccess = false;
    this.checkIn = '';
    this.checkOut = '';
    this.guests = 2;
    this.selectedRoomId = null;
    this.rooms = [];
    this.showModal = true;

    // Load rooms for this hotel
    this.hotelService.getRoomsByHotel(hotel.id).subscribe({
      next: (data) => { this.rooms = data; },
      error: () => { this.bookingError = 'Ошибка загрузки номеров.'; }
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedHotel = null;
  }

  // ── CLICK EVENT 4: Confirm booking ───────────────────────
  confirmBooking() {
    if (!this.checkIn || !this.checkOut || !this.selectedRoomId) {
      this.bookingError = 'Заполните все поля: даты и номер комнаты.';
      return;
    }
    if (new Date(this.checkIn) >= new Date(this.checkOut)) {
      this.bookingError = 'Дата выезда должна быть позже даты заезда.';
      return;
    }

    this.bookingLoading = true;
    this.bookingError = '';

    const booking: Booking = {
      room: this.selectedRoomId,
      check_in: this.checkIn,
      check_out: this.checkOut,
      guests: this.guests
    };

    this.bookingService.createBooking(booking).subscribe({
      next: () => {
        this.bookingLoading = false;
        this.bookingSuccess = true;
        setTimeout(() => this.closeModal(), 2000);
      },
      error: () => {
        this.bookingLoading = false;
        this.bookingError = 'Ошибка бронирования. Попробуйте снова.';
      }
    });
  }

  // ── Helpers ──────────────────────────────────────────────
  renderStars(n: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < n ? '★' : '☆');
  }

  calcNights(): number {
    if (!this.checkIn || !this.checkOut) return 0;
    const diff = new Date(this.checkOut).getTime() - new Date(this.checkIn).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  calcTotal(): number {
    return (this.selectedHotel?.price || 0) * this.calcNights();
  }
}
