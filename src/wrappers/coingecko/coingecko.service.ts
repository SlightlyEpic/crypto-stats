import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EnvProviderService } from 'src/env-provider/env-provider.service';
import { type AxiosError } from 'axios';

export type CurrencyData = {
    price: number,
    marketCap: number,
    change24h: number,
};

@Injectable()
export class CoingeckoService {
    static readonly BaseURL = 'https://api.coingecko.com/api/v3';
    private authHeaders: Record<string, string>;

    constructor(
        private readonly envProvider: EnvProviderService,
        private readonly httpService: HttpService
    ) {
        this.authHeaders = {
            'x-cg-demo-api-key': this.envProvider.env.COINGECKO_API_KEY,
        }
    }

    async fetchCurrencyData(currency: 'bitcoin' | 'matic' | 'ethereum'): Promise<CurrencyData> {
        const reqUrl = new URL(`${CoingeckoService.BaseURL}/coins/${this.coinId(currency)}`);
        const queryParams = {
            'localization': 'false',
            'tickers': 'false',
            'market_data': 'true',
            'community_data': 'false',
            'developer_data': 'false',
            'sparkline': 'false',
        };
        for(const [k, v] of Object.entries(queryParams)) {
            reqUrl.searchParams.append(k, v);
        }

        try {
            const resp = await this.httpService.axiosRef.get(reqUrl.toString(), {
                headers: {
                    ...this.authHeaders,
                    'Accept': 'application/json',
                }
            });
            const data: CurrencyData = {
                price: resp.data?.market_data?.current_price,
                marketCap: resp.data?.market_data?.market_cap,
                change24h: resp.data?.market_data?.price_change_24h,
            };

            if(Object.values(data).includes(undefined)) {
                throw new Error('Unexpected API response');
            }

            return data;
        } catch(_err: unknown) {
            const err = _err as AxiosError;
            throw new Error('API request failed', { cause: err });
        }
    }

    private coinId(currency: 'bitcoin' | 'matic' | 'ethereum'): string {
        return currency === 'matic' ? 'matic-network' : currency;
    }
}
