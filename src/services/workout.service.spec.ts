import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutService } from './workout.service';
import { User } from '../entities/user.entity';
import { WorkoutSession } from '../entities/workout-session.entity';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutService],
    }).compile();

    service = module.get<WorkoutService>(WorkoutService);
  });

  it('should schedule a workout', async () => {
    const user = service.createUser({
      username: 'test',
      email: 'test@test.com',
    });

    const workoutData = {
      title: 'Test Workout',
      scheduledDate: new Date(),
      duration: 30,
      completed: false,
      requiredLevel: 'BEGINNER' as const,
    };

    const result = await service.scheduleWorkout(user.id, workoutData);
    expect(result).toBeDefined();
    expect(result.userId).toBe(user.id);
    expect(result.title).toBe(workoutData.title);
  });
}); 