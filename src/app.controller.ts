import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ZodValidationPipe } from './validation/zod-validation.pipe';
import { z } from 'zod';

const currencySchema = z.enum(['bitcoin', 'matic', 'ethereum']);

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/stats/:currency')
    async getStats(
        @Param('currency', new ZodValidationPipe(currencySchema)) currency: z.infer<typeof currencySchema>,
    ): Promise<{
        price: number,
        marketCap: number,
        '24hChange': number,
    }> {
        return this.appService.getStats(currency);
    }

    @Get('/deviation/:currency')
    async getDeviation(
        @Param('currency', new ZodValidationPipe(currencySchema)) currency: z.infer<typeof currencySchema>,
    ): Promise<{ deviation: number }> {
        return this.appService.getDeviation(currency);
    }
}
