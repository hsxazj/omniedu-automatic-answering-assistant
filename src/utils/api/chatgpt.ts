import { BaseAPIProvider, APIProviderConfig } from './base';

export class ChatGPTAPIProvider extends BaseAPIProvider {
    protected getDefaultBaseURL(): string {
        return 'https://api.openai.com/v1';
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
                chat: 'gpt-3.5-turbo',
                embedding: 'text-embedding-ada-002'
            }
        };
    }
} 