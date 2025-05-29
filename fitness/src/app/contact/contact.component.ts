import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../user';
import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  user: User | null = null;
  currentRoute = ''; // ✅ Add this to track current route

  constructor(
    private router: Router,
    private authService: AuthService) {
    this.user = this.authService.getUser();
    this.currentRoute = this.router.url; // ✅ Capture current route
  }

  onDash() {
    this.router.navigate(['./dash']);
  }

  onAbout() {
    this.router.navigate(['./about']);
  }

  onContact() {
    this.router.navigate(['./contact']);
  }

  // ✅ Add helper method to check if route is active
  isActiveRoute(route: string): boolean {
    return this.currentRoute === route || this.router.url === route;
  }
}