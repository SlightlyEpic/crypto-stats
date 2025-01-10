import { Controller, Get, Inject, Param } from '@nestjs/common';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { z } from 'zod';
import { AppService } from './app.service';
import { ZodValidationPipe } from './validation/zod-validation.pipe';
import { ApiOkResponse, ApiOperation, ApiProperty, ApiQuery } from '@nestjs/swagger';

const currencySchema = z.enum(['bitcoin', 'matic', 'ethereum']);

class StatsResponseDto {
    @ApiProperty({ example: 40000.1234, description: 'The current price of the cryptocurrency in USD' })
    price: number;
  
    @ApiProperty({ example: 800000000, description: 'The current market cap of the cryptocurrency in USD' })
    marketCap: number;
  
    @ApiProperty({ example: 3.4, description: 'The 24-hour price change of the cryptocurrency' })
    '24hChange': number;
}

class DeviationResponseDto {
    @ApiProperty({ example: 123.456, description: 'The recent standard deviation of the cryptocurrency' })
    deviation: number;
}


@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Get('/stats/:currency')
    @ApiOperation({ summary: 'Get cryptocurrency stats', description: 'Fetch the latest stats for a specified cryptocurrency' })
    @ApiQuery({ name: 'coin', enum: ['bitcoin', 'matic', 'ethereum'], description: 'The name of the cryptocurrency to fetch stats for' })
    @ApiOkResponse({
        description: 'Successfully fetched the cryptocurrency stats',
        type: StatsResponseDto,
    })
    async getStats(
        @Param('currency', new ZodValidationPipe(currencySchema)) currency: z.infer<typeof currencySchema>,
    ): Promise<StatsResponseDto> {
        const data = await this.appService.getStats(currency);
        return data;
    }

    @Get('/deviation/:currency')
    @ApiOperation({ summary: 'Get price deviation', description: 'Fetch the recent standard deviation of the cryptocurrency' })
    @ApiQuery({ name: 'coin', enum: ['bitcoin', 'matic', 'ethereum'], description: 'The name of the cryptocurrency to calculate the deviation for' })
    @ApiOkResponse({
        description: 'Successfully fetched the standard deviation',
        type: DeviationResponseDto
    })
    async getDeviation(
        @Param('currency', new ZodValidationPipe(currencySchema)) currency: z.infer<typeof currencySchema>,
    ): Promise<DeviationResponseDto> {
        const data = await this.appService.getDeviation(currency);
        this.cacheManager.set(`/deviation/${currency}`, data);
        return data;
    }
}
