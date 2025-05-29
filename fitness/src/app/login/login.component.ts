// src/app/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService) { }

  onSubmit() {
    this.userService.login(this.email, this.password).subscribe({
      next: user => {
        if (user) {
          this.authService.setUser(user);
          this.router.navigate(['/about']);
        } else {
          this.error = 'Invalid credentials';
        }
      },
      error: () => this.error = 'Login failed'
    });
  }


  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
