import { Module } from '@nestjs/common';
import { CoinsStatsService } from './coins-stats.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyData, CurrencyDataSchema } from 'src/schemas/currencyData.schema';
import { CoingeckoModule } from 'src/wrappers/coingecko/coingecko.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        MongooseModule.forFeature([
            { name: CurrencyData.name, schema: CurrencyDataSchema },
        ]),
        CoingeckoModule,
    ],
    providers: [CoinsStatsService]
})
export class BackgroundModule {}
