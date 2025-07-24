import { BaseAPIProvider } from './base';
import { MoonshotAPIProvider } from './moonshot';
import { DeepSeekAPIProvider } from './deepseek';
import { ChatGPTAPIProvider } from './chatgpt';
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
            const apiKey = config.apiKeys[config.apiType];
            
            if (!apiKey) {
                throw new Error(`未设置 ${config.apiType} 的API密钥`);
            }

            switch (config.apiType) {
                case 'deepseek':
                    this.provider = new DeepSeekAPIProvider({
                        apiKey
                    });
                    break;
                case 'chatgpt':
                    this.provider = new ChatGPTAPIProvider({
                        apiKey
                    });
                    break;
                case 'moonshot':
                default:
                    this.provider = new MoonshotAPIProvider({
                        apiKey
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