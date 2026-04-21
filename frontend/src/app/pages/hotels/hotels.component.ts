import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Hotel, HotelFilter } from '../../models/models';
import { CommonModule, SlicePipe } from '@angular/common';
@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, SlicePipe],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Отели</h1>
          <p class="subtitle">{{ hotels.length }} {{ countLabel(hotels.length) }} найдено</p>
        </div>
      </div>

      <!-- Filter Form (ngModel, 4 fields) -->
      <div class="filters-bar">
        <div class="filter-group">
          <label>🌆 Город</label>
          <input
            type="text"
            [(ngModel)]="filter.city"
            name="city"
            placeholder="Любой город"
            (ngModelChange)="onFilter()"
          />
        </div>
        <div class="filter-group">
          <label>⭐ Звёзды</label>
          <select [(ngModel)]="filter.stars" name="stars" (ngModelChange)="onFilter()">
            <option value="">Любые</option>
            <option value="1">1 звезда</option>
            <option value="2">2 звезды</option>
            <option value="3">3 звезды</option>
            <option value="4">4 звезды</option>
            <option value="5">5 звёзд</option>
          </select>
        </div>
        <div class="filter-group">
          <label>💰 Цена от</label>
          <input
            type="number"
            [(ngModel)]="filter.min_price"
            name="min_price"
            placeholder="0"
            (ngModelChange)="onFilter()"
          />
        </div>
        <div class="filter-group">
          <label>💰 Цена до</label>
          <input
            type="number"
            [(ngModel)]="filter.max_price"
            name="max_price"
            placeholder="∞"
            (ngModelChange)="onFilter()"
          />
        </div>
        <div class="filter-group filter-check">
          <label class="check-label">
            <input
              type="checkbox"
              [(ngModel)]="filter.available"
              name="available"
              (ngModelChange)="onFilter()"
            />
            Только свободные номера
          </label>
        </div>
        <!-- Event: click "Фильтр" reset -->
        <button class="btn btn-outline" (click)="resetFilter()">Сбросить</button>
      </div>

      @if (loading) {
        <div class="spinner"></div>
      } @else if (hotels.length === 0) {
        <div class="empty-state">
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить параметры фильтра</p>
        </div>
      } @else {
        <div class="hotels-grid">
          @for (hotel of hotels; track hotel.id) {
            <div class="card hotel-card">
              <div class="hotel-img">
                @if (hotel.image) {
                  <img [src]="hotel.image" [alt]="hotel.name" />
                } @else {
                  <div class="img-placeholder">🏨</div>
                }
                <div class="stars-badge">
                  {{ getStars(hotel.stars) }}
                </div>
              </div>
              <div class="hotel-body">
                <div class="hotel-meta">
                  <span class="city">📍 {{ hotel.city }}</span>
                  @if (hotel.avg_rating) {
                    <span class="rating">★ {{ hotel.avg_rating }}</span>
                  }
                </div>
                <h3>{{ hotel.name }}</h3>
                <p class="desc">{{ hotel.description | slice:0:100 }}...</p>
                <div class="hotel-footer">
                  <span class="rooms-count">
                    {{ hotel.rooms_count }} {{ roomLabel(hotel.rooms_count) }}
                  </span>
                  <a [routerLink]="['/hotels', hotel.id]" class="btn btn-primary btn-sm">
                    Подробнее
                  </a>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px;
    }
    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 28px;
    }
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      color: var(--text);
    }
    .subtitle { color: var(--text-muted); font-size: 13px; margin-top: 4px; }
    .filters-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: flex-end;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 32px;
    }
    .filter-group { display: flex; flex-direction: column; min-width: 150px; flex: 1; }
    .filter-group label { font-size: 11px; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
    .filter-group input, .filter-group select { padding: 9px 12px; font-size: 13px; }
    .filter-check { justify-content: flex-end; }
    .check-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-muted);
      cursor: pointer;
      text-transform: none;
      letter-spacing: 0;
    }
    .check-label input { width: auto; }
    .hotels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .hotel-card { cursor: pointer; }
    .hotel-img {
      position: relative;
      height: 200px;
      background: var(--bg3);
      overflow: hidden;
    }
    .hotel-img img { width: 100%; height: 100%; object-fit: cover; }
    .img-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 60px;
      opacity: 0.3;
    }
    .stars-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(0,0,0,0.7);
      color: var(--gold);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 13px;
      letter-spacing: 2px;
    }
    .hotel-body { padding: 20px; }
    .hotel-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .city { font-size: 12px; color: var(--text-muted); }
    .rating {
      font-size: 12px;
      color: var(--gold);
      font-weight: 600;
    }
    h3 { font-size: 17px; margin-bottom: 8px; color: var(--text); }
    .desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; }
    .hotel-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .rooms-count { font-size: 12px; color: var(--text-dim); }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
  `]
})
export class HotelsComponent implements OnInit {
  api = inject(ApiService);

  hotels: Hotel[] = [];
  loading = false;
  filter: HotelFilter = {};

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.loading = true;
    this.api.getHotels(this.filter).subscribe({
      next: (data) => { this.hotels = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // Event: click "Фильтр"
  onFilter() {
    this.loadHotels();
  }

  resetFilter() {
    this.filter = {};
    this.loadHotels();
  }

  getStars(n: number): string {
    return '★'.repeat(n);
  }

  countLabel(n: number): string {
    if (n === 1) return 'отель';
    if (n >= 2 && n <= 4) return 'отеля';
    return 'отелей';
  }

  roomLabel(n: number): string {
    if (n === 1) return 'свободный номер';
    if (n >= 2 && n <= 4) return 'свободных номера';
    return 'свободных номеров';
  }
}
