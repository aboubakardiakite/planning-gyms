import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { WorkoutSession, WorkoutSessionDocument } from '../schemas/workout-session.schema';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(WorkoutSession.name) private workoutModel: Model<WorkoutSessionDocument>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async scheduleWorkout(userId: string, workoutData: CreateWorkoutDto): Promise<WorkoutSessionDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    const workout = new this.workoutModel({
      ...workoutData,
      userId: new Types.ObjectId(userId),
    });

    const savedWorkout = await workout.save();
    user.workoutSessions.push(savedWorkout._id as Types.ObjectId);
    await user.save();

    return savedWorkout;
  }

  async getWeeklyWorkouts(userId: string, startDate: Date): Promise<WorkoutSessionDocument[]> {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    return this.workoutModel.find({
      userId: new Types.ObjectId(userId),
      scheduledDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).exec();
  }

  async checkWeeklyCompletion(userId: string, startDate: Date): Promise<void> {
    const workouts = await this.getWeeklyWorkouts(userId, startDate) as WorkoutSessionDocument[];
    const missedWorkouts = workouts.filter(w => !w.completed);

    if (missedWorkouts.length > 0) {
      const nextWeekStart = new Date(startDate);
      nextWeekStart.setDate(nextWeekStart.getDate() + 7);

      for (const workout of missedWorkouts) {
        await this.scheduleWorkout(userId, {
          ...workout.toObject(),
          scheduledDate: nextWeekStart,
          duration: workout.duration + 15,
        });
      }
    }
  }
}
