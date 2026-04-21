import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-box">
        <div class="login-header">
          <div class="logo">🏨</div>
          <h1>LuxStay</h1>
          <p>{{ isRegister ? 'Создать аккаунт' : 'Добро пожаловать' }}</p>
        </div>

        <div class="tabs">
          <button [class.active]="!isRegister" (click)="isRegister = false">Войти</button>
          <button [class.active]="isRegister" (click)="isRegister = true">Регистрация</button>
        </div>

        @if (error) {
          <div class="alert alert-error">{{ error }}</div>
        }

        <!-- Login Form (ngModel) -->
        @if (!isRegister) {
          <form (ngSubmit)="onLogin()">
            <div class="form-group">
              <label>Логин</label>
              <input
                type="text"
                [(ngModel)]="loginData.username"
                name="username"
                placeholder="Введите логин"
                required
              />
            </div>
            <div class="form-group">
              <label>Пароль</label>
              <input
                type="password"
                [(ngModel)]="loginData.password"
                name="password"
                placeholder="Введите пароль"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
              {{ loading ? 'Входим...' : 'Войти' }}
            </button>
          </form>
        }

        <!-- Register Form (ngModel) -->
        @if (isRegister) {
          <form (ngSubmit)="onRegister()">
            <div class="form-group">
              <label>Логин</label>
              <input
                type="text"
                [(ngModel)]="regData.username"
                name="username"
                placeholder="Придумайте логин"
                required
              />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                [(ngModel)]="regData.email"
                name="email"
                placeholder="email@example.com"
              />
            </div>
            <div class="form-group">
              <label>Пароль</label>
              <input
                type="password"
                [(ngModel)]="regData.password"
                name="password"
                placeholder="Минимум 6 символов"
                required
              />
            </div>
            <div class="form-group">
              <label>Повторите пароль</label>
              <input
                type="password"
                [(ngModel)]="regData.password2"
                name="password2"
                placeholder="Повторите пароль"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
              {{ loading ? 'Создаём...' : 'Зарегистрироваться' }}
            </button>
          </form>
        }

        <p class="hint">Тестовые данные: <strong>testuser</strong> / <strong>test123</strong></p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%);
    }
    .login-box {
      width: 100%;
      max-width: 400px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
    }
    .login-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .logo { font-size: 40px; margin-bottom: 8px; }
    .login-header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      color: var(--gold);
      margin-bottom: 4px;
    }
    .login-header p { color: var(--text-muted); font-size: 13px; }
    .tabs {
      display: flex;
      background: var(--bg3);
      border-radius: 8px;
      padding: 3px;
      margin-bottom: 24px;
      gap: 3px;
    }
    .tabs button {
      flex: 1;
      padding: 8px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .tabs button.active {
      background: var(--card);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .w-full { width: 100%; justify-content: center; }
    .hint {
      margin-top: 20px;
      text-align: center;
      color: var(--text-dim);
      font-size: 12px;
    }
    .hint strong { color: var(--text-muted); }
  `]
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  isRegister = false;
  loading = false;
  error = '';

  loginData = { username: '', password: '' };
  regData = { username: '', email: '', password: '', password2: '' };

  // Event: click "Войти"
  onLogin() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.loginData.username, this.loginData.password).subscribe({
      next: () => this.router.navigate(['/hotels']),
      error: (err) => {
        this.error = err.error?.non_field_errors?.[0] || 'Ошибка входа';
        this.loading = false;
      }
    });
  }

  onRegister() {
    this.error = '';
    this.loading = true;
    this.auth.register(
      this.regData.username,
      this.regData.email,
      this.regData.password,
      this.regData.password2
    ).subscribe({
      next: () => this.router.navigate(['/hotels']),
      error: (err) => {
        const errs = err.error;
        this.error = errs?.username?.[0] || errs?.password?.[0] || errs?.non_field_errors?.[0] || 'Ошибка регистрации';
        this.loading = false;
      }
    });
  }
}
