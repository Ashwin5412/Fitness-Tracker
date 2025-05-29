// src/app/user.service.ts
import { Injectable } from '@angular/core';
import { CouchDbConnectorService } from './couch.service';
import { User,Goal } from './user';
import { Observable, map } from 'rxjs';
import { switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUser: User | null = null;

  constructor(private couch: CouchDbConnectorService) {}

  signup(user: User): Observable<boolean> {
    user._id = user.email;
    user.type='user';
    return this.couch.create(user).pipe(map(() => true));
  }

  login(email: string, password: string): Observable<User | null> {
  return this.couch.getById(email).pipe(
    map((userDoc: any) => {
      console.log('User document fetched:', userDoc); 
      if (userDoc && userDoc.password === password) {
        this.currentUser = userDoc;
        return userDoc;
        }
        return null;
      })
    );
  }

updateUser(user: User) {
  return this.couch.getById(user._id!).pipe(
    switchMap((latestDoc: any) => {
      user._rev = latestDoc._rev; 
      return this.couch.update(user._id!, user._rev!, user);
    })
  );
}


  logout() {
  this.currentUser = null;
  localStorage.removeItem('currentUser');
  }

  fetchUserByEmail(email: string): Observable<User> {
  return this.couch.getById(email).pipe(
    map((doc: any) => doc as User)
  );
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getWorkoutHistory(email: string): Observable<any[]> {
  return this.couch.getWorkoutView().pipe(
    map((response: any) => 
      response.rows
        .map((row: any) => row.value)
        .filter((workout: any) => workout.email === email)  // filter by user email
    )
  );
}

  saveWorkout(email: string, goal: Goal): Observable<any> {
  const workoutDoc = {
    type: 'workout',         
    email: email,
    exerciseType: goal.exerciseType,
    targetCalories: goal.targetCalories,
    targetDuration: goal.targetDuration,
    date: goal.date
  };
  return this.couch.create(workoutDoc);
  }
}
