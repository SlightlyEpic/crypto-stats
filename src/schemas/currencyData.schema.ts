import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrencyDataDocument = HydratedDocument<CurrencyData>;

@Schema({ timestamps: true })
export class CurrencyData {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  marketCap: string;
}

export const CurrencyDataSchema = SchemaFactory.createForClass(CurrencyData);
CurrencyDataSchema.index({ createdAt: 'desc' });
