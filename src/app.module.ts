import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvProviderModule } from './env-provider/env-provider.module';
import { EnvProviderService } from './env-provider/env-provider.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CoingeckoModule } from './wrappers/coingecko/coingecko.module';

@Module({
    imports: [
        EnvProviderModule,
        MongooseModule.forRootAsync({
            imports: [EnvProviderModule],
            inject: [EnvProviderService],
            useFactory: (envProvider: EnvProviderService) => ({
                uri: envProvider.env.MONGO_URI,
            }),
        }),
        CoingeckoModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
