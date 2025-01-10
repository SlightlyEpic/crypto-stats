import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvProviderModule } from './env-provider/env-provider.module';
import { EnvProviderService } from './env-provider/env-provider.service';
import { CoingeckoModule } from './wrappers/coingecko/coingecko.module';
import { CurrencyData, CurrencyDataSchema } from './schemas/currencyData.schema';
import { BackgroundModule } from './background/background.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [EnvProviderModule],
            inject: [EnvProviderService],
            useFactory: (envProvider: EnvProviderService) => ({
                uri: envProvider.env.MONGO_URI,
                dbName: 'koinx-crypto'
            }),
        }),
        MongooseModule.forFeature([
            { name: CurrencyData.name, schema: CurrencyDataSchema },
        ]),
        CacheModule.register({
            isGlobal: true,
            ttl: 60 * 60,
        }),
        EnvProviderModule,
        CoingeckoModule,
        BackgroundModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
