import { IsString, IsISO8601, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkoutDto {
  @IsString()
  title: string;

  @IsISO8601()
  @Type(() => Date)
  scheduledDate: Date;

  @IsNumber()
  @Type(() => Number)
  duration: number;

  @IsBoolean()
  completed: boolean;

  @IsEnum(['BEGINNER', 'PRE_INTERMEDIATE', 'INTERMEDIATE', 'ADVANCED'] as const)
  requiredLevel: 'BEGINNER' | 'PRE_INTERMEDIATE' | 'INTERMEDIATE' | 'ADVANCED';
} 