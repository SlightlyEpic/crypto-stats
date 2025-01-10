import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ZodValidationPipe } from './validation/zod-validation.pipe';
import { z } from 'zod';

const currencySchema = z.enum(['bitcoin', 'matic', 'ethereum']);

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get('/stats/:currency')
    getStats(
        @Param('currency', new ZodValidationPipe(currencySchema)) currency: z.infer<typeof currencySchema>,
    ): string {
        return this.appService.getStats(currency);
    }

    @Get('/deviation/:currency')
    getDeviation(
        @Param('currency', new ZodValidationPipe(currencySchema)) currency: z.infer<typeof currencySchema>,
    ): string {
        return this.appService.getDeviation(currency);
    }
}
