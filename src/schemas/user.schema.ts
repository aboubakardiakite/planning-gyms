import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FitnessLevel } from '../dto/create-workout.dto';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ 
    type: String, 
    enum: FitnessLevel, 
    default: FitnessLevel.BEGINNER 
  })
  fitnessLevel: FitnessLevel;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'WorkoutSession' }] })
  workoutSessions: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User); 