import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a class="brand" routerLink="/hotels">
        <span class="brand-icon"></span>
        <span class="brand-text">GOtel</span>
      </a>

      <div class="nav-links">
        <a routerLink="/hotels" routerLinkActive="active">Отели</a>
        @if (auth.isLoggedIn()) {
          <a routerLink="/bookings" routerLinkActive="active">Мои брони</a>
        }
      </div>

      <div class="nav-actions">
        @if (auth.isLoggedIn()) {
          <span class="username">{{ auth.user()?.username }}</span>
          <button class="btn btn-outline btn-sm" (click)="logout()">Выйти</button>
        } @else {
          <a routerLink="/login" class="btn btn-primary btn-sm">Войти</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 0 32px;
      height: 64px;
      background: var(--bg2);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-icon { font-size: 22px; }
    .brand-text {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      color: var(--gold);
      font-weight: 600;
    }
    .nav-links {
      display: flex;
      gap: 4px;
      flex: 1;
    }
    .nav-links a {
      padding: 6px 14px;
      border-radius: 6px;
      text-decoration: none;
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--text);
      background: var(--bg3);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .username {
      font-size: 13px;
      color: var(--text-muted);
    }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
