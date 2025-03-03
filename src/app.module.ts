import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutController } from './controllers/workout.controller';
import { UserController } from './controllers/user.controller';
import { WorkoutService } from './services/workout.service';
import { User, UserSchema } from './schemas/user.schema';
import { WorkoutSession, WorkoutSessionSchema } from './schemas/workout-session.schema';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: WorkoutSession.name, schema: WorkoutSessionSchema },
    ]),
  ],
  controllers: [WorkoutController, UserController],
  providers: [WorkoutService],
})
export class AppModule {}
