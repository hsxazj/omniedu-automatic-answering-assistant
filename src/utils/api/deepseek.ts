import { BaseAPIProvider, APIProviderConfig } from './base';

export class DeepSeekAPIProvider extends BaseAPIProvider {
    protected getDefaultBaseURL(): string {
        return 'https://api.deepseek.com/v1';
    }

    protected getDefaultHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };
    }

    protected getConfig(): APIProviderConfig {
        return {
            model: {
                chat: 'deepseek-chat'
            }
        };
    }
} 