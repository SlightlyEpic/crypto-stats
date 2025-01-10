import { Module } from '@nestjs/common';
import { CoinsStatsService } from './coins-stats.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyData, CurrencyDataSchema } from 'src/schemas/currencyData.schema';
import { Deviation } from 'src/schemas/deviation.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: CurrencyData.name, schema: CurrencyDataSchema },
      { name: Deviation.name, schema: Deviation },
    ])
  ],
  providers: [CoinsStatsService]
})
export class BackgroundModule {}
