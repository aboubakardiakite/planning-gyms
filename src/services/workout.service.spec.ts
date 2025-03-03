import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutService } from './workout.service';
import { FitnessLevel } from '../dto/create-workout.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { WorkoutSession, WorkoutSessionDocument } from '../schemas/workout-session.schema';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let userModel: Model<UserDocument>;
  let workoutModel: Model<WorkoutSessionDocument>;

  const mockUser = {
    _id: new Types.ObjectId(),
    username: 'test',
    email: 'test@test.com',
    fitnessLevel: FitnessLevel.BEGINNER,
    workoutSessions: [],
    save: jest.fn(),
  };

  const mockWorkout = {
    _id: new Types.ObjectId(),
    title: 'Test Workout',
    scheduledDate: new Date(),
    duration: 30,
    completed: false,
    requiredLevel: FitnessLevel.BEGINNER,
    userId: mockUser._id,
    save: jest.fn(),
    toObject: () => ({
      title: 'Test Workout',
      scheduledDate: new Date(),
      duration: 30,
      completed: false,
      requiredLevel: FitnessLevel.BEGINNER,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findById: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: getModelToken(WorkoutSession.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockWorkout),
            find: jest.fn().mockResolvedValue([mockWorkout]),
          },
        },
      ],
    }).compile();

    service = module.get<WorkoutService>(WorkoutService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    workoutModel = module.get<Model<WorkoutSessionDocument>>(getModelToken(WorkoutSession.name));
  });

  it('should schedule a workout', async () => {
    const user = await service.createUser({
      username: 'test',
      email: 'test@test.com',
      fitnessLevel: FitnessLevel.BEGINNER,
    });

    const workoutData = {
      title: 'Test Workout',
      scheduledDate: new Date(),
      duration: 30,
      completed: false,
      requiredLevel: FitnessLevel.BEGINNER,
    };

  });
});
