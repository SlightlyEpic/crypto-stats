import { Model } from 'mongoose';
import { Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CurrencyData } from './schemas/currencyData.schema';

type Currency = 'bitcoin' | 'matic' | 'ethereum';

@Injectable()
export class AppService {
    constructor(
        @InjectModel(CurrencyData.name) private currencyModel: Model<CurrencyData>,
    ) {}

    /**
     * Fetch the latest stats for a given cryptocurrency
     * @param currency The name of the currency
     * @returns The latest CurrencyData document
     */
    async getStats(currency: Currency): Promise<Omit<CurrencyData, 'name'>> {
        const latestData = await this.currencyModel
            .findOne({ name: currency })
            .sort({ createdAt: -1 }) // Sort by descending createdAt
            .exec();

        if (!latestData) {
            throw new NotFoundException(`No data found for currency: ${currency}`);
        }

        return {
            price: latestData.price,
            marketCap: latestData.marketCap,
            '24hChange': latestData['24hChange'],
        };
    }

    /**
     * Calculate the standard deviation of the price for the last 100 records
     * @param currency The name of the currency
     * @returns The deviation in the price
     */
    async getDeviation(currency: Currency): Promise<{ deviation: number }> {
        const data = await this.currencyModel
            .find({ name: currency })
            .sort({ createdAt: -1 })
            .limit(100)
            .exec();

        if (data.length === 0) {
            throw new NotFoundException(`No data found for currency: ${currency}`);
        }

        const prices = data.map(doc => doc.price);

        let mean = 0;
        for(const price of prices) mean += price;
        mean /= prices.length;

        let variance = 0;
        for(const price of prices) variance += Math.pow(price - mean, 2);
        variance /= prices.length;

        const stdDev = Math.sqrt(variance);

        return { deviation: stdDev };
    }
}
