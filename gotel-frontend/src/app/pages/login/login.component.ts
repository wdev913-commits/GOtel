import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  private auth = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Введите email и пароль';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/hotels']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Неверный email или пароль';
      }
    });
  }
}
