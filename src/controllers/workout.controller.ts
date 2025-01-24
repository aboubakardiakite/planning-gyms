import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WorkoutService } from '../services/workout.service';
import { CreateWorkoutDto } from '../dto/create-workout.dto';

@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post(':userId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async scheduleWorkout(@Param('userId') userId: number, @Body() workoutData: CreateWorkoutDto) {
    return this.workoutService.scheduleWorkout(userId, workoutData);
  }

  @Get(':userId/weekly')
  async getWeeklyWorkouts(@Param('userId') userId: number, @Query('startDate') startDate: string) {
    return this.workoutService.getWeeklyWorkouts(userId, new Date(startDate));
  }

  @Post(':userId/check-completion')
  async checkWeeklyCompletion(
    @Param('userId') userId: number,
    @Query('startDate') startDate: string,
  ) {
    return this.workoutService.checkWeeklyCompletion(userId, new Date(startDate));
  }
}
