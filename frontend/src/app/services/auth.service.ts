import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<CurrentUser | null>(this.loadUser());

  readonly user = this._user.asReadonly();

  constructor(private api: ApiService, private router: Router) {}

  private loadUser(): CurrentUser | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  login(username: string, password: string) {
    return this.api.login(username, password).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        localStorage.setItem('user', JSON.stringify(res.user));
        this._user.set(res.user);
      })
    );
  }

  register(username: string, email: string, password: string, password2: string) {
    return this.api.register(username, email, password, password2).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        localStorage.setItem('user', JSON.stringify(res.user));
        this._user.set(res.user);
      })
    );
  }

  logout() {
    const refresh = localStorage.getItem('refresh_token') || '';
    this.api.logout(refresh).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
