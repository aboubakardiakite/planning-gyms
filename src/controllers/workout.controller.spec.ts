// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from '../app.module';
// import { WorkoutService } from '../services/workout.service';
// import { CreateWorkoutDto, FitnessLevel } from '../dto/create-workout.dto';
// import { CreateUserDto } from '../dto/create-user.dto';
// import { Types } from 'mongoose';
// import { User, UserDocument } from '../schemas/user.schema';

// describe('WorkoutController (Integration)', () => {
//   let app: INestApplication;
//   let workoutService: WorkoutService;

//   const mockUser: Partial<UserDocument> = {
//     _id: new Types.ObjectId(),
//     username: 'testuser',
//     email: 'test@example.com',
//     fitnessLevel: FitnessLevel.BEGINNER,
//     workoutSessions: [],
//   };

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     app.useGlobalPipes(new ValidationPipe({ transform: true }));
//     workoutService = moduleFixture.get<WorkoutService>(WorkoutService);
//     await app.init();
//   });

//   beforeEach(() => {
//     // Réinitialiser les données du service entre chaque test
//     jest.clearAllMocks();
//   });

//   describe('POST /workouts/:userId', () => {
//     it('should return 400 when workout data is invalid', async () => {
//       const userData: CreateUserDto = {
//         username: 'testuser2',
//         email: 'test2@example.com',
//         fitnessLevel: FitnessLevel.BEGINNER,
//       };

//       jest.spyOn(workoutService, 'createUser').mockResolvedValue(mockUser as UserDocument);

//       const user = await workoutService.createUser(userData);

//       const invalidWorkoutData = {
//         title: '',
//         scheduledDate: 'invalid-date',
//         duration: 'not-a-number',
//         completed: 'not-a-boolean',
//         requiredLevel: 'INVALID_LEVEL',
//       };

//       await request(app.getHttpServer())
//         .post(`/workouts/${user._id}`)
//         .send(invalidWorkoutData)
//         .expect(400);
//     });
//   });

//   describe('GET /workouts/:userId/weekly', () => {
//     it('should return weekly workouts', async () => {
//       const userData: CreateUserDto = {
//         username: 'testuser3',
//         email: 'test3@example.com',
//         fitnessLevel: FitnessLevel.BEGINNER,
//       };

//       jest.spyOn(workoutService, 'createUser').mockResolvedValue(mockUser as UserDocument);

//       const user = await workoutService.createUser(userData);

//       const workoutData: CreateWorkoutDto = {
//         title: 'Test Workout',
//         scheduledDate: new Date(),
//         duration: 30,
//         completed: false,
//         requiredLevel: FitnessLevel.BEGINNER,
//       };

//       await workoutService.scheduleWorkout(user._id.toString(), workoutData);

//       const response = await request(app.getHttpServer())
//         .get(`/workouts/${user._id}/weekly`)
//         .query({ startDate: workoutData.scheduledDate.toISOString() })
//         .expect(200);

//       expect(Array.isArray(response.body)).toBeTruthy();
//     });
//   });

//   describe('POST /workouts/:userId/check-completion', () => {
//     it('should check weekly completion and create new workouts if needed', async () => {
//       const userData: CreateUserDto = {
//         username: 'testuser4',
//         email: 'test4@example.com',
//         fitnessLevel: FitnessLevel.BEGINNER,
//       };

//       jest.spyOn(workoutService, 'createUser').mockResolvedValue(mockUser as UserDocument);

//       const user = await workoutService.createUser(userData);

//       const workoutData: CreateWorkoutDto = {
//         title: 'Missed Workout',
//         scheduledDate: new Date(),
//         duration: 30,
//         completed: false,
//         requiredLevel: FitnessLevel.BEGINNER,
//       };

//       await workoutService.scheduleWorkout(user._id.toString(), workoutData);

//       await request(app.getHttpServer())
//         .post(`/workouts/${user._id}/check-completion`)
//         .query({ startDate: workoutData.scheduledDate.toISOString() })
//         .expect(201);
//     });
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
