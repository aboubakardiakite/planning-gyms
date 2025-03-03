import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FitnessLevel } from '../dto/create-workout.dto';

export type WorkoutSessionDocument = WorkoutSession & Document;

@Schema()
export class WorkoutSession {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ required: true })
  duration: number;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ 
    type: String, 
    enum: FitnessLevel, 
    required: true 
  })
  requiredLevel: FitnessLevel;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const WorkoutSessionSchema = SchemaFactory.createForClass(WorkoutSession); 