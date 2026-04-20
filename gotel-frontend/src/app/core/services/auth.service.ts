import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../../models/hotel.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = '/api';

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(
  `${this.apiUrl}/login/`, { username: email, password }

    ).pipe(
      tap(tokens => {
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
      })
    );
  }

  logout() {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      this.http.post(`${this.apiUrl}/token/logout/`, { refresh }).subscribe();
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
