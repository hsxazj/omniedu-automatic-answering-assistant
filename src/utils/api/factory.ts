import { BaseAPIProvider } from './base';
import { MoonshotAPIProvider } from './moonshot';
import { DeepSeekAPIProvider } from './deepseek';
import { getConfig } from '../config';

export class APIFactory {
    private static instance: APIFactory;
    private provider: BaseAPIProvider | null = null;

    private constructor() {}

    public static getInstance(): APIFactory {
        if (!APIFactory.instance) {
            APIFactory.instance = new APIFactory();
        }
        return APIFactory.instance;
    }

    public getProvider(): BaseAPIProvider {
        if (!this.provider) {
            const config = getConfig();
            switch (config.apiType) {
                case 'deepseek':
                    this.provider = new DeepSeekAPIProvider({
                        apiKey: config.apiKey,
                        baseURL: 'https://api.deepseek.com/v1'
                    });
                    break;
                case 'moonshot':
                default:
                    this.provider = new MoonshotAPIProvider({
                        apiKey: config.apiKey,
                        baseURL: 'https://api.moonshot.cn/v1'
                    });
                    break;
            }
        }
        return this.provider;
    }

    public resetProvider(): void {
        this.provider = null;
    }
} 