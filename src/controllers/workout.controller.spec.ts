import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { WorkoutService } from '../services/workout.service';
import { CreateWorkoutDto, FitnessLevel } from '../dto/create-workout.dto';

describe('WorkoutController (Integration)', () => {
  let app: INestApplication;
  let workoutService: WorkoutService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    workoutService = moduleFixture.get<WorkoutService>(WorkoutService);
    await app.init();
  });

  beforeEach(() => {
    // Réinitialiser les données du service entre chaque test
    jest.clearAllMocks();
  });

  describe('POST /workouts/:userId', () => {
    it('should return 400 when user does not exist', async () => {
      const workoutData: CreateWorkoutDto = {
        title: 'Morning Workout',
        scheduledDate: new Date(),
        duration: 45,
        completed: false,
        requiredLevel: FitnessLevel.BEGINNER,
      };

      await request(app.getHttpServer())
        .post('/workouts/999')
        .send({
          ...workoutData,
          scheduledDate: workoutData.scheduledDate.toISOString(),
        })
        .expect(400);
    });

    it('should return 400 when workout data is invalid', async () => {
      const user = workoutService.createUser({
        username: 'testuser2',
        email: 'test2@example.com',
      });

      const invalidWorkoutData = {
        title: '',
        scheduledDate: 'invalid-date',
        duration: 'not-a-number',
        completed: 'not-a-boolean',
        requiredLevel: 'INVALID_LEVEL',
      };

      await request(app.getHttpServer())
        .post(`/workouts/${user.id}`)
        .send(invalidWorkoutData)
        .expect(400);
    });
  });

  describe('GET /workouts/:userId/weekly', () => {
    it('should return weekly workouts', async () => {
      const user = workoutService.createUser({
        username: 'testuser3',
        email: 'test3@example.com',
      });

      // Créer quelques séances d'entraînement
      const startDate = new Date();
      const workoutData: CreateWorkoutDto = {
        title: 'Test Workout',
        scheduledDate: startDate,
        duration: 30,
        completed: false,
        requiredLevel: FitnessLevel.BEGINNER,
      };

      await workoutService.scheduleWorkout(user.id, workoutData);

      const response = await request(app.getHttpServer())
        .get(`/workouts/${user.id}/weekly`)
        .query({ startDate: startDate.toISOString() })
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /workouts/:userId/check-completion', () => {
    it('should check weekly completion and create new workouts if needed', async () => {
      const user = workoutService.createUser({
        username: 'testuser4',
        email: 'test4@example.com',
      });

      const startDate = new Date();
      const duration = 30;
      const workoutData: CreateWorkoutDto = {
        title: 'Missed Workout',
        scheduledDate: startDate,
        duration,
        completed: false,
        requiredLevel: FitnessLevel.BEGINNER,
      };

      await workoutService.scheduleWorkout(user.id, workoutData);

      await request(app.getHttpServer())
        .post(`/workouts/${user.id}/check-completion`)
        .query({ startDate: startDate.toISOString() })
        .expect(201);

      const nextWeekWorkouts = await workoutService.getWeeklyWorkouts(
        user.id,
        new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      );

      expect(nextWeekWorkouts.length).toBeGreaterThan(0);
      expect(nextWeekWorkouts[0].duration).toBe(duration + 15);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
