// src/app/signup.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private userService: UserService, private router: Router) { }


  isPasswordValid(): boolean {
  if (!this.password) return true;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
  return passwordRegex.test(this.password);
  }

isEmailValid(): boolean {
  if (!this.email) return true; 
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(this.email);
}

  onSubmit() {
    const user: User = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.userService.signup(user).subscribe({
      next: success => {
        if (success) this.router.navigate(['/login']);
        else this.error = 'Signup failed';
      },
      error: () => this.error = 'Signup failed'
    });

    
  }
}
