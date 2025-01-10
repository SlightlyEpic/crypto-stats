import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviationDocument = HydratedDocument<Deviation>;

@Schema({ timestamps: true })
export class Deviation {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  deviation: number;
}

export const DeviationSchema = SchemaFactory.createForClass(Deviation);
DeviationSchema.index({ createdAt: 'desc' });
