import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Services/auth.service';
import { User } from '../user';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  user: User | null = null;
  currentPage = 'about';
  
  constructor(
    private router: Router,
    private authService: AuthService) {
    this.user = this.authService.getUser();
  }

  onDash() {
    this.router.navigate(['/dash']);
  }

  onAbout() {
    this.router.navigate(['/about']);
  }

  onContact() {
    this.router.navigate(['/contact']);
  }

  isActive(page: string): boolean {
    return this.currentPage === page;
  }
}