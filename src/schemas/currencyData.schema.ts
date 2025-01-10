import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrencyDataDocument = HydratedDocument<CurrencyData>;

@Schema({ timestamps: true })
export class CurrencyData {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  marketCap: number;

  @Prop({ required: true })
  change24h: number
}

export const CurrencyDataSchema = SchemaFactory.createForClass(CurrencyData);
CurrencyDataSchema.index({ createdAt: 'desc' });
