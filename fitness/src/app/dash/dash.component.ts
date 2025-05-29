import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { User, Goal } from '../user';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  user: User | null = null;
  exerciseType = '';
  targetCalories = 0;
  targetDuration: number | null = null;
  workoutHistory: Goal[] = [];
  filteredGoals: Goal[] = [];  

  selectedMonth: string = '';  
selectedDate: string = '';   
selectedYear: string = '';
   

  currentRoute = '';
  noDataFound: boolean = false;

  private calorieRates: Record<string, number> = {
    running: 11,
    cycling: 8,
    swimming: 10,
    jumping: 13,
    yoga: 3,
    walking: 4
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const cachedUser = this.authService.getUser();
    if (!cachedUser) {
      alert('No user info found. Please login again.');
      this.router.navigate(['/login']);
      return;
    }
    // Fetch latest user data from CouchDB
    this.userService.fetchUserByEmail(cachedUser.email).subscribe({
      next: (userFromDb) => {
        this.user = userFromDb;
        this.authService.setUser(userFromDb);  // update cached user
        this.loadWorkoutHistory();
      },
      error: () => {
        alert('Failed to load user data. Please login again.');
        this.authService.setUser(null);
        this.router.navigate(['/login']);
      }
    });
  }

  loadWorkoutHistory(): void {
    if (!this.user) return;
    
    // Use the goalsHistory array inside the user document to display workouts
    this.workoutHistory = this.user.goalsHistory || [];
    this.filteredGoals = this.workoutHistory;
    this.applyFilter();
  }

  calculateCalories() {
    if (this.exerciseType && this.targetDuration && this.targetDuration > 0) {
      const rate = this.calorieRates[this.exerciseType] || 0;
      this.targetCalories = rate * this.targetDuration;
    } else {
      this.targetCalories = 0;
    }
  }

  updateGoal() {
    if (!this.user) return;

    if (this.targetDuration === null || this.targetDuration <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    const newGoal: Goal = {
      exerciseType: this.exerciseType,
      targetCalories: this.targetCalories,
      targetDuration: this.targetDuration,
      date: new Date().toISOString()
    };

    if (!this.user.goalsHistory) {
      this.user.goalsHistory = [];
    }

    this.user.goalsHistory.push(newGoal);
    this.user.goals = newGoal;

    this.userService.updateUser(this.user).subscribe({
      next: () => {
        // Refresh user and workout data to sync latest state after update
        this.loadUserData();
        alert('Goal and history updated!');
        
        this.userService.saveWorkout(this.user!.email, newGoal).subscribe({
          next: () => console.log('Workout saved to separate document'),
          error: () => console.error('Failed to save workout to workout view')
        });
      },
      error: () => alert('Failed to update goal')
    });
  }

  applyFilter() {
  const selectedMonth = this.selectedMonth;
  const selectedDate = this.selectedDate;
  const selectedYear = this.selectedYear;

  this.filteredGoals = this.workoutHistory.filter(goal => {
    if (!goal.date) {
      return false;
    }

    const goalDate = new Date(goal.date);
    const monthMatches = selectedMonth ? (goalDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth : true;
    const dateMatches = selectedDate ? goalDate.getDate().toString().padStart(2, '0') === selectedDate : true;
    const yearMatches = selectedYear ? goalDate.getFullYear().toString() === selectedYear : true;

    return monthMatches && dateMatches && yearMatches;
  });

  this.noDataFound = this.filteredGoals.length === 0;
}


  get totalCalories(): number {
    if (!this.user?.goalsHistory) return 0;
    return this.user.goalsHistory.reduce((sum, goal) => sum + goal.targetCalories, 0);
  }

  get totalWeightLoss(): number {
    if (!this.user?.goalsHistory?.length) return 0;
    const totalCaloriesBurned = this.user.goalsHistory.reduce(
      (sum, goal) => sum + goal.targetCalories, 0
    );
    return +(totalCaloriesBurned / 7700).toFixed(2);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
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

  isActiveRoute(route: string): boolean {
    return this.currentRoute === route || this.router.url === route;
  }
}
