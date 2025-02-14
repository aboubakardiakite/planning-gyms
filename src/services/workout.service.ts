import { Injectable, BadRequestException } from '@nestjs/common';
import { WorkoutSession } from '../entities/workout-session.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class WorkoutService {
  private users: User[] = [];
  private workouts: WorkoutSession[] = [];
  private lastUserId = 0;
  private lastWorkoutId = 0;

  async scheduleWorkout(userId: number, workoutData: Partial<WorkoutSession>) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    const workout = {
      id: ++this.lastWorkoutId,
      ...workoutData,
      userId,
    } as WorkoutSession;

    this.workouts.push(workout);
    return workout;
  }

  async getWeeklyWorkouts(userId: number, startDate: Date) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    return this.workouts.filter(
      w => w.userId === userId && w.scheduledDate >= startDate && w.scheduledDate <= endDate,
    );
  }

  async checkWeeklyCompletion(userId: number, startDate: Date) {
    const workouts = await this.getWeeklyWorkouts(userId, startDate);
    const missedWorkouts = workouts.filter(w => !w.completed);

    if (missedWorkouts.length > 0) {
      const nextWeekStart = new Date(startDate);
      nextWeekStart.setDate(nextWeekStart.getDate() + 7);

      for (const workout of missedWorkouts) {
        await this.scheduleWorkout(userId, {
          ...workout,
          scheduledDate: nextWeekStart,
          duration: workout.duration + 15,
        });
      }
    }
  }

  // Méthodes utilitaires pour la gestion des utilisateurs
  createUser(userData: Partial<User>): User {
    const user = {
      id: ++this.lastUserId,
      ...userData,
      workoutSessions: [],
    } as User;

    this.users.push(user);
    return user;
  }

  getUser(userId: number): User | undefined {
    return this.users.find(u => u.id === userId);
  }

  getHello() {
    return 'hello world';
  }
}
