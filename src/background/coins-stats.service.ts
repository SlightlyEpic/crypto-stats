import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoingeckoService } from 'src/wrappers/coingecko/coingecko.service';
import { CurrencyData } from 'src/schemas/currencyData.schema';

@Injectable()
export class CoinsStatsService {
    private readonly logger = new Logger(CoinsStatsService.name);

    constructor(
        private readonly coingeckoService: CoingeckoService,
        @InjectModel(CurrencyData.name) private currencyModel: Model<CurrencyData>,
    ) {}

    @Cron('0 */2 * * *', { name: 'updateCoinStats' })
    async updateCoinStats() {
        const coins = ['bitcoin', 'matic', 'ethereum'] as const;
        const maxRetry = 3;
        const retryDelayMs = 2000;
        for(const coin of coins) {
            this.logger.log(`Updating data for ${coin}`);
            let i = 0;
            for(i = 0; i < maxRetry; i++) {
                try {
                    const coinData = await this.coingeckoService.fetchCurrencyData(coin);
                    const dataRecord = new this.currencyModel({
                        name: coin,
                        ...coinData
                    });
                    await dataRecord.save()
                    this.logger.log(`Updated data for ${coin}`);
                    break;
                } catch(err: unknown) {
                    await new Promise(r => setTimeout(r, retryDelayMs));
                }
            }

            if(i === maxRetry) {
                this.logger.warn(`Failed to update data for ${coin}`);
            }
        }
    }
}
