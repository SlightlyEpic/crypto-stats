import { Module } from '@nestjs/common';
import { EnvProviderService } from './env-provider.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [EnvProviderService],
  exports: [EnvProviderService],
})
export class EnvProviderModule {}
