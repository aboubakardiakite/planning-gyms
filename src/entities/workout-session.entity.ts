export class WorkoutSession {
  id: number;
  title: string;
  scheduledDate: Date;
  duration: number;
  completed: boolean;
  requiredLevel: 'BEGINNER' | 'PRE_INTERMEDIATE' | 'INTERMEDIATE' | 'ADVANCED';
  userId: number;
}
