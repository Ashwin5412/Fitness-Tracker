export interface Goal {
  exerciseType: string;
  targetCalories: number;
  targetDuration: number;
  date?: string;
}

export interface User {
  _id?: string;
  _rev?: string;
  email: string;
  password: string;
  username?: string;
  goals?: Goal;
  goalsHistory?: Goal[];
  type?: string;
}
