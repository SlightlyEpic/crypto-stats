import { Module } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { EnvProviderModule } from 'src/env-provider/env-provider.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [EnvProviderModule, HttpModule],
  providers: [CoingeckoService]
})
export class CoingeckoModule {}
