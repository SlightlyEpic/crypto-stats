import { Injectable } from '@nestjs/common';

type Currency = 'bitcoin' | 'matic' | 'ethereum';

@Injectable()
export class AppService {
    getStats(currency: Currency): string {
        return 'Stats';
    }

    getDeviation(currency: Currency): string {
        return 'Deviation';
    }
}
