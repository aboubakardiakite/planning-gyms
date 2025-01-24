import { IsEmail, IsString, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsEnum(['BEGINNER', 'PRE_INTERMEDIATE', 'INTERMEDIATE', 'ADVANCED'])
  fitnessLevel: string;
}
