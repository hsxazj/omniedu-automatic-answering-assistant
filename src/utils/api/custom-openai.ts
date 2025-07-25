import {APIProviderConfig, BaseAPIProvider} from './base';
import {getConfig} from '../config';

export class CustomOpenAIAPIProvider extends BaseAPIProvider {
    protected getDefaultBaseURL(): string {
        const config = getConfig();
        return config.customOpenAIUrl || 'https://new.ljcljc.cn/v1';
    }

    protected getDefaultHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };
    }

    protected getConfig(): APIProviderConfig {
        const config = getConfig();
        return {
            model: {
                chat: config.customOpenAIModel || 'gpt-4.1',
                embedding: 'text-embedding-3-large'
            }
        };
    }
}