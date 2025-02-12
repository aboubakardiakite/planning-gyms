import { IsString, IsISO8601, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Niveaux de fitness possibles pour une séance
 */
export enum FitnessLevel {
  BEGINNER = 'BEGINNER',
  PRE_INTERMEDIATE = 'PRE_INTERMEDIATE',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

/**
 * DTO pour la création d'une séance d'entraînement
 */
export class CreateWorkoutDto {
  /**
   * Titre de la séance d'entraînement
   * @example "Séance de musculation"
   */
  @IsString()
  title: string;

  /**
   * Date et heure prévues pour la séance
   * @example "2024-02-13T10:00:00Z"
   */
  @IsISO8601()
  @Type(() => Date)
  scheduledDate: Date;

  /**
   * Durée de la séance en minutes
   * @example 60
   */
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @IsBoolean()
  completed: boolean;

  /**
   * Niveau de fitness requis pour la séance
   * @example "INTERMEDIATE"
   */
  @IsEnum(FitnessLevel)
  requiredLevel: FitnessLevel;
}
