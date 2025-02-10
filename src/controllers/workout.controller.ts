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

/**
 * Contrôleur pour la gestion des séances d'entraînement
 * @class WorkoutController
 */
@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  /**
   * Planifie une nouvelle séance d'entraînement
   * @param userId - L'identifiant de l'utilisateur
   * @param workoutData - Les données de la séance d'entraînement
   * @returns La séance d'entraînement créée
   */
  @Post(':userId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async scheduleWorkout(
    @Param('userId') userId: number,
    @Body() workoutData: CreateWorkoutDto,
  ) {
    return this.workoutService.scheduleWorkout(userId, workoutData);
  }

  /**
   * Récupère les séances d'entraînement hebdomadaires d'un utilisateur
   * @param userId - L'identifiant de l'utilisateur
   * @param startDate - La date de début de la semaine
   * @returns Liste des séances d'entraînement
   */
  @Get(':userId/weekly')
  async getWeeklyWorkouts(
    @Param('userId') userId: number,
    @Query('startDate') startDate: string,
  ) {
    return this.workoutService.getWeeklyWorkouts(userId, new Date(startDate));
  }

  /**
   * Vérifie la complétion des séances hebdomadaires
   * @param userId - L'identifiant de l'utilisateur
   * @param startDate - La date de début de la semaine
   */
  @Post(':userId/check-completion')
  async checkWeeklyCompletion(
    @Param('userId') userId: number,
    @Query('startDate') startDate: string,
  ) {
    return this.workoutService.checkWeeklyCompletion(userId, new Date(startDate));
  }
}
