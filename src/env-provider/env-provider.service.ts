import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Env } from 'src/types/env';

@Injectable()
export class EnvProviderService {
    readonly env: Env;
    
    constructor(private configService: ConfigService) {
        const MONGO_URI = this.configService.get('MONGO_URI');
        if(!MONGO_URI) throw Error('MONGO_URI environment variable is missing');

        const PORT = this.configService.get('PORT');
        if(!PORT) throw Error('PORT environment variable is missing');
        
        const COINGECKO_API_KEY = this.configService.get('COINGECKO_API_KEY');
        if(!COINGECKO_API_KEY) throw Error('COINGECKO_API_KEY environment variable is missing');
        this.env = {
            MONGO_URI,
            PORT,
            COINGECKO_API_KEY,
        };
    }
}
