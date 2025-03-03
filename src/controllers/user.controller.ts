import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { WorkoutService } from '../services/workout.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.workoutService.createUser(createUserDto);
  }
} 