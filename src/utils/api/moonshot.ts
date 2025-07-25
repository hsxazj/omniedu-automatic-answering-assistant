import {APIProviderConfig, BaseAPIProvider} from './base';

export class MoonshotAPIProvider extends BaseAPIProvider {
    protected getDefaultBaseURL(): string {
        return 'https://api.moonshot.cn/v1';
    }

    protected getDefaultHeaders(): Record<string, string> {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    protected getConfig(): APIProviderConfig {
        return {
            model: {
                chat: 'moonshot-v1-8k',
                embedding: 'text-embedding-v1'
            }
        };
    }
} 