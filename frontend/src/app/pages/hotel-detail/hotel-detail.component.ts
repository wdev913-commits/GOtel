import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Hotel, Room, Review } from '../../models/models';
import { CommonModule, DecimalPipe, SlicePipe } from '@angular/common';
@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, DecimalPipe, SlicePipe],
  template: `
    <div class="page">
      @if (loading) {
        <div class="spinner"></div>
      } @else if (hotel) {
        <!-- Hotel Header -->
        <div class="hotel-hero">
          @if (hotel.image) {
            <img [src]="hotel.image" [alt]="hotel.name" class="hero-img" />
          } @else {
            <div class="hero-placeholder">🏨</div>
          }
          <div class="hero-overlay">
            <div class="hero-content">
              <div class="hero-stars">{{ getStars(hotel.stars) }}</div>
              <h1>{{ hotel.name }}</h1>
              <p>📍 {{ hotel.city }}, {{ hotel.address }}</p>
              @if (hotel.avg_rating) {
                <div class="rating-badge">★ {{ hotel.avg_rating }} / 5</div>
              }
            </div>
          </div>
        </div>

        <div class="content">
          <p class="description">{{ hotel.description }}</p>

          <!-- Rooms Section -->
          <section>
            <h2>Номера</h2>
            @if (rooms.length === 0) {
              <p class="text-muted">Номера пока не добавлены.</p>
            } @else {
              <div class="rooms-grid">
                @for (room of rooms; track room.id) {
                  <div class="room-card" [class.unavailable]="!room.is_available">
                    <div class="room-header">
                      <span class="room-title">{{ room.title }}</span>
                      @if (room.is_available) {
                        <span class="badge badge-green">Свободен</span>
                      } @else {
                        <span class="badge badge-red">Занят</span>
                      }
                    </div>
                    <div class="room-details">
                      <span>👥 до {{ room.capacity }} чел.</span>
                      <span class="price">{{ room.price | number }} ₸/ночь</span>
                    </div>
                    @if (room.is_available) {
                      <button
                        class="btn btn-primary btn-sm"
                        (click)="openBooking(room)"
                      >
                        Забронировать
                      </button>
                    }
                  </div>
                }
              </div>
            }
          </section>

          <!-- Reviews Section -->
          <section>
            <h2>Отзывы</h2>

            @if (auth.isLoggedIn()) {
              <div class="review-form">
                <h4>Оставить отзыв</h4>
                <div class="form-group">
                  <label>Оценка</label>
                  <select [(ngModel)]="newReview.rating" name="rating">
                    <option value="5">★★★★★ Отлично</option>
                    <option value="4">★★★★ Хорошо</option>
                    <option value="3">★★★ Нормально</option>
                    <option value="2">★★ Плохо</option>
                    <option value="1">★ Ужасно</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Комментарий</label>
                  <textarea [(ngModel)]="newReview.comment" name="comment" rows="3" placeholder="Напишите ваш отзыв..."></textarea>
                </div>
                <button class="btn btn-primary" (click)="submitReview()">Отправить</button>
              </div>
            }

            @if (reviews.length === 0) {
              <p class="text-muted">Пока нет отзывов.</p>
            } @else {
              <div class="reviews-list">
                @for (review of reviews; track review.id) {
                  <div class="review-item">
                    <div class="review-header">
                      <strong>{{ review.user_name }}</strong>
                      <span class="review-stars">{{ getStars(review.rating) }}</span>
                      <span class="review-date">{{ review.created_at | slice:0:10 }}</span>
                    </div>
                    <p>{{ review.comment }}</p>
                  </div>
                }
              </div>
            }
          </section>
        </div>
      }
    </div>

    <!-- Booking Modal -->
    @if (showBookingModal && selectedRoom) {
      <div class="modal-overlay" (click)="closeBooking()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Бронирование: {{ selectedRoom.title }}</h3>
            <button class="close-btn" (click)="closeBooking()">✕</button>
          </div>
          <div class="modal-body">
            <p class="room-price">{{ selectedRoom.price | number }} ₸/ночь</p>

            @if (bookingError) {
              <div class="alert alert-error">{{ bookingError }}</div>
            }
            @if (bookingSuccess) {
              <div class="alert alert-success">{{ bookingSuccess }}</div>
            }

            <!-- Booking Form (ngModel) -->
            <div class="form-group">
              <label>Дата заезда</label>
              <input type="date" [(ngModel)]="bookingData.check_in" name="check_in" [min]="today" />
            </div>
            <div class="form-group">
              <label>Дата выезда</label>
              <input type="date" [(ngModel)]="bookingData.check_out" name="check_out" [min]="bookingData.check_in || today" />
            </div>

            @if (bookingData.check_in && bookingData.check_out) {
              <div class="total-price">
                Итого: {{ calcTotal() | number }} ₸
                <span>({{ calcNights() }} ночей)</span>
              </div>
            }

            @if (!auth.isLoggedIn()) {
              <p class="auth-hint">Для бронирования необходима <a href="/login">авторизация</a></p>
            } @else {
              <button class="btn btn-primary w-full" (click)="submitBooking()" [disabled]="bookingLoading">
                {{ bookingLoading ? 'Бронируем...' : 'Подтвердить' }}
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; padding: 0 0 60px; }
    .hotel-hero { position: relative; height: 350px; overflow: hidden; }
    .hero-img { width: 100%; height: 100%; object-fit: cover; }
    .hero-placeholder { height: 100%; background: var(--bg3); display: flex; align-items: center; justify-content: center; font-size: 80px; opacity: 0.3; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%); display: flex; align-items: flex-end; }
    .hero-content { padding: 32px; }
    .hero-stars { color: var(--gold); font-size: 18px; letter-spacing: 3px; margin-bottom: 8px; }
    .hero-content h1 { font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 6px; }
    .hero-content p { color: rgba(255,255,255,0.7); font-size: 13px; }
    .rating-badge { display: inline-block; margin-top: 8px; background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); border-radius: 20px; padding: 4px 12px; font-size: 13px; }
    .content { padding: 32px 24px; }
    .description { color: var(--text-muted); line-height: 1.7; margin-bottom: 40px; }
    section { margin-bottom: 40px; }
    h2 { font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
    .rooms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .room-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 18px; transition: border-color 0.2s; }
    .room-card:hover { border-color: var(--gold); }
    .room-card.unavailable { opacity: 0.6; }
    .room-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .room-title { font-weight: 600; font-size: 15px; }
    .room-details { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-size: 13px; color: var(--text-muted); }
    .price { color: var(--gold); font-weight: 600; font-size: 15px; }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .text-muted { color: var(--text-muted); font-size: 13px; }
    .review-form { background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-bottom: 20px; }
    .review-form h4 { margin-bottom: 16px; font-size: 14px; color: var(--text-muted); }
    .reviews-list { display: flex; flex-direction: column; gap: 12px; }
    .review-item { background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
    .review-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .review-stars { color: var(--gold); font-size: 13px; }
    .review-date { color: var(--text-dim); font-size: 11px; margin-left: auto; }
    .review-item p { font-size: 13px; color: var(--text-muted); }
    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; }
    .modal { background: var(--card); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 440px; overflow: hidden; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
    .modal-header h3 { font-family: 'Playfair Display', serif; font-size: 18px; }
    .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 18px; padding: 4px; }
    .close-btn:hover { color: var(--text); }
    .modal-body { padding: 24px; }
    .room-price { color: var(--gold); font-size: 20px; font-weight: 600; margin-bottom: 20px; }
    .total-price { background: var(--gold-dim); border: 1px solid rgba(201,168,76,0.2); border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; color: var(--gold); font-weight: 600; font-size: 16px; }
    .total-price span { color: var(--text-muted); font-size: 12px; font-weight: 400; margin-left: 8px; }
    .auth-hint { font-size: 13px; color: var(--text-muted); text-align: center; }
    .auth-hint a { color: var(--gold); }
    .w-full { width: 100%; justify-content: center; }
  `]
})
export class HotelDetailComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  hotel: Hotel | null = null;
  rooms: Room[] = [];
  reviews: Review[] = [];
  loading = true;

  showBookingModal = false;
  selectedRoom: Room | null = null;
  bookingData = { check_in: '', check_out: '' };
  bookingLoading = false;
  bookingError = '';
  bookingSuccess = '';

  newReview = { rating: 5, comment: '' };

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getHotel(id).subscribe({ next: (h) => { this.hotel = h; this.loading = false; } });
    this.api.getRooms(id).subscribe({ next: (r) => this.rooms = r });
    this.api.getReviews(id).subscribe({ next: (r) => this.reviews = r });
  }

  getStars(n: number): string { return '★'.repeat(n); }

  // Event: click "Забронировать"
  openBooking(room: Room) {
    if (!this.auth.isLoggedIn()) { this.router.navigate(['/login']); return; }
    this.selectedRoom = room;
    this.showBookingModal = true;
    this.bookingError = '';
    this.bookingSuccess = '';
    this.bookingData = { check_in: '', check_out: '' };
  }

  closeBooking() {
    this.showBookingModal = false;
    this.selectedRoom = null;
  }

  calcNights(): number {
    if (!this.bookingData.check_in || !this.bookingData.check_out) return 0;
    const d1 = new Date(this.bookingData.check_in);
    const d2 = new Date(this.bookingData.check_out);
    return Math.max(0, Math.ceil((d2.getTime() - d1.getTime()) / 86400000));
  }

  calcTotal(): number {
    return this.calcNights() * Number(this.selectedRoom?.price || 0);
  }

  submitBooking() {
    if (!this.selectedRoom) return;
    this.bookingError = '';
    this.bookingLoading = true;
    this.api.createBooking({
      room: this.selectedRoom.id,
      check_in: this.bookingData.check_in,
      check_out: this.bookingData.check_out
    }).subscribe({
      next: () => {
        this.bookingSuccess = 'Бронирование успешно создано!';
        this.bookingLoading = false;
        setTimeout(() => this.closeBooking(), 1500);
      },
      error: (err) => {
        const e = err.error;
        this.bookingError = e?.non_field_errors?.[0] || e?.check_in?.[0] || e?.check_out?.[0] || 'Ошибка бронирования';
        this.bookingLoading = false;
      }
    });
  }

  submitReview() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.createReview(id, this.newReview).subscribe({
      next: (r) => {
        this.reviews.unshift(r);
        this.newReview = { rating: 5, comment: '' };
      }
    });
  }
}
