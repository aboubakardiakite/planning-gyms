import { WorkoutSession } from "./workout-session.entity";

export class User {
  id: number;
  username: string;
  email: string;
  fitnessLevel: 'BEGINNER' | 'PRE_INTERMEDIATE' | 'INTERMEDIATE' | 'ADVANCED' = 'BEGINNER';
  workoutSessions: WorkoutSession[] = [];
} 