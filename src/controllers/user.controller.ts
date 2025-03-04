import { Controller, Post, Get, Body, Param, ValidationPipe, NotFoundException } from '@nestjs/common';
import { WorkoutService } from '../services/workout.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.workoutService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers() {
    return this.workoutService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.workoutService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
} 