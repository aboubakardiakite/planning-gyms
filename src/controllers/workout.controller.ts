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
 * 
 * @group Workouts - Opérations sur les séances d'entraînement
 */
@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  /**
   * Planifie une nouvelle séance d'entraînement pour un utilisateur
   * 
   * @param userId - Identifiant de l'utilisateur
   * @param workoutData - Données de la séance d'entraînement à créer
   * @returns La séance d'entraînement créée
   * 
   * @example
   * POST /workouts/123
   * {
   *   "title": "Séance de musculation",
   *   "scheduledDate": "2024-02-13T10:00:00Z",
   *   "duration": 60,
   *   "requiredLevel": "INTERMEDIATE"
   * }
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
   * 
   * @param userId - Identifiant de l'utilisateur
   * @param startDate - Date de début de la semaine (format: YYYY-MM-DD)
   * @returns Liste des séances d'entraînement de la semaine
   * 
   * @example
   * GET /workouts/123/weekly?startDate=2024-02-12
   */
  @Get(':userId/weekly')
  async getWeeklyWorkouts(
    @Param('userId') userId: number,
    @Query('startDate') startDate: string,
  ) {
    return this.workoutService.getWeeklyWorkouts(userId, new Date(startDate));
  }

  /**
   * Vérifie la complétion des séances hebdomadaires d'un utilisateur
   * 
   * @param userId - Identifiant de l'utilisateur
   * @param startDate - Date de début de la semaine (format: YYYY-MM-DD)
   * @returns Statut de complétion des séances de la semaine
   * 
   * @example
   * POST /workouts/123/check-completion?startDate=2024-02-12
   */
  @Post(':userId/check-completion')
  async checkWeeklyCompletion(
    @Param('userId') userId: number,
    @Query('startDate') startDate: string,
  ) {
    return this.workoutService.checkWeeklyCompletion(userId, new Date(startDate));
  }
}
