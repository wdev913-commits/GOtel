import { Component, OnInit, inject } from '@angular/core';
import { Booking } from '../../models/hotel.model';
import { BookingService } from '../../core/services/booking.service';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [DecimalPipe, DatePipe],
  templateUrl: './bookings.component.html'
})
export class BookingsComponent implements OnInit {
  private bookingService = inject(BookingService);

  bookings: Booking[] = [];
  isLoading = false;
  loadError = '';
  deleteError = '';
  deleteSuccess = false;

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.loadError = '';
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'Ошибка загрузки броней. Попробуйте снова.';
        this.isLoading = false;
      }
    });
  }

  cancelBooking(id: number) {
    if (!confirm('Вы уверены, что хотите отменить бронь?')) return;
    this.deleteError = '';

    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.id !== id);
        this.deleteSuccess = true;
        setTimeout(() => this.deleteSuccess = false, 3000);
      },
      error: () => {
        this.deleteError = 'Ошибка отмены брони. Попробуйте снова.';
      }
    });
  }
}
