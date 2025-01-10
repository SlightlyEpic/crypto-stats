import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Env } from 'src/types/env';

@Injectable()
export class EnvProviderService {
    readonly env: Env;
    
    constructor(private configService: ConfigService) {
        const mongoUri = this.configService.get('MONGO_URI');
        if(!mongoUri) throw Error('MONGO_URI environment variable is missing');
        this.env = { mongoUri };
    }
}
