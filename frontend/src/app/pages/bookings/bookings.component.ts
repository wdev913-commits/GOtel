import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Мои бронирования</h1>
          <p class="subtitle">Управляйте своими бронями</p>
        </div>
        <a routerLink="/hotels" class="btn btn-outline">← Найти отель</a>
      </div>

      @if (loading) {
        <div class="spinner"></div>
      } @else if (bookings.length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🏨</div>
          <h3>Нет бронирований</h3>
          <p>Найдите идеальный отель и забронируйте номер</p>
          <a routerLink="/hotels" class="btn btn-primary" style="margin-top:16px">Найти отель</a>
        </div>
      } @else {
        @if (successMsg) {
          <div class="alert alert-success">{{ successMsg }}</div>
        }
        <div class="bookings-list">
          @for (booking of bookings; track booking.id) {
            <div class="booking-card" [class.past]="isPast(booking.check_out)">
              <div class="booking-left">
                <div class="hotel-icon">🏨</div>
              </div>
              <div class="booking-body">
                <div class="booking-top">
                  <div>
                    <h3>{{ booking.hotel_name }}</h3>
                    <p class="room-name">{{ booking.room_title }}</p>
                  </div>
                  @if (isPast(booking.check_out)) {
                    <span class="badge badge-red">Завершено</span>
                  } @else {
                    <span class="badge badge-green">Активно</span>
                  }
                </div>
                <div class="booking-dates">
                  <div class="date-block">
                    <span class="date-label">Заезд</span>
                    <span class="date-val">{{ formatDate(booking.check_in) }}</span>
                  </div>
                  <div class="date-arrow">→</div>
                  <div class="date-block">
                    <span class="date-label">Выезд</span>
                    <span class="date-val">{{ formatDate(booking.check_out) }}</span>
                  </div>
                  <div class="nights-badge">{{ calcNights(booking.check_in, booking.check_out) }} н.</div>
                </div>
              </div>
              <div class="booking-actions">
                <!-- Event: click "Удалить бронь" -->
                <button
                  class="btn btn-danger btn-sm"
                  (click)="deleteBooking(booking.id)"
                  [disabled]="deletingId === booking.id"
                >
                  {{ deletingId === booking.id ? '...' : 'Отменить' }}
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    h1 { font-family: 'Playfair Display', serif; font-size: 32px; }
    .subtitle { color: var(--text-muted); font-size: 13px; margin-top: 4px; }
    .bookings-list { display: flex; flex-direction: column; gap: 16px; }
    .booking-card {
      display: flex;
      gap: 20px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      transition: border-color 0.2s;
      align-items: center;
    }
    .booking-card:hover { border-color: var(--gold); }
    .booking-card.past { opacity: 0.6; }
    .booking-left { flex-shrink: 0; }
    .hotel-icon { font-size: 36px; width: 56px; height: 56px; background: var(--bg3); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .booking-body { flex: 1; }
    .booking-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; gap: 12px; }
    .booking-top h3 { font-size: 16px; margin-bottom: 3px; }
    .room-name { font-size: 12px; color: var(--text-muted); }
    .booking-dates { display: flex; align-items: center; gap: 12px; }
    .date-block { display: flex; flex-direction: column; }
    .date-label { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
    .date-val { font-size: 14px; font-weight: 500; }
    .date-arrow { color: var(--text-dim); }
    .nights-badge { margin-left: 8px; background: var(--gold-dim); color: var(--gold); border-radius: 20px; padding: 3px 10px; font-size: 12px; }
    .booking-actions { flex-shrink: 0; }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .empty-icon { font-size: 60px; margin-bottom: 16px; }
  `]
})
export class BookingsComponent implements OnInit {
  api = inject(ApiService);

  bookings: Booking[] = [];
  loading = false;
  deletingId: number | null = null;
  successMsg = '';

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.api.getBookings().subscribe({
      next: (data) => { this.bookings = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // Event: click "Удалить бронь"
  deleteBooking(id: number) {
    this.deletingId = id;
    this.api.deleteBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.id !== id);
        this.deletingId = null;
        this.successMsg = 'Бронирование отменено.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.deletingId = null; }
    });
  }

  isPast(checkOut: string): boolean {
    return new Date(checkOut) < new Date();
  }

  calcNights(checkIn: string, checkOut: string): number {
    return Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
