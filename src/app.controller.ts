import { Controller, Get, Inject, Param } from '@nestjs/common';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { z } from 'zod';
import { AppService } from './app.service';
import { ZodValidationPipe } from './validation/zod-validation.pipe';

const currencySchema = z.enum(['bitcoin', 'matic', 'ethereum']);

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Get('/stats/:currency')
    async getStats(
        @Param('currency', new ZodValidationPipe(currencySchema)) currency: z.infer<typeof currencySchema>,
    ): Promise<{
        price: number,
        marketCap: number,
        '24hChange': number,
    }> {
        const data = await this.appService.getStats(currency);
        this.cacheManager.set(`/stats/${currency}`, data);
        return data;
    }

    @Get('/deviation/:currency')
    async getDeviation(
        @Param('currency', new ZodValidationPipe(currencySchema)) currency: z.infer<typeof currencySchema>,
    ): Promise<{ deviation: number }> {
        const data = await this.appService.getDeviation(currency);
        this.cacheManager.set(`/deviation/${currency}`, data);
        return data;
    }
}
