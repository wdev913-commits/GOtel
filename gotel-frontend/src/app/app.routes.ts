import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/hotels', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'hotels',
    loadComponent: () =>
      import('./pages/hotels/hotels.component').then(m => m.HotelsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'bookings',
    loadComponent: () =>
      import('./pages/bookings/bookings.component').then(m => m.BookingsComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/hotels' }
];
