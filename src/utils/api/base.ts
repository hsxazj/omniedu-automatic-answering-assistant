import { EventEmitter } from './event-emitter';

export interface APIConfig {
    apiKey: string;
    baseURL?: string;
}

export interface APIResponse {
    code: number;
    message: string;
    data?: any;
}

export abstract class BaseAPIProvider extends EventEmitter {
    protected apiKey: string;
    protected baseURL: string;

    constructor(config: APIConfig) {
        super();
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || this.getDefaultBaseURL();
    }

    protected abstract getDefaultBaseURL(): string;
    protected abstract getDefaultHeaders(): Record<string, string>;
    public abstract chat(messages: Array<{ role: string; content: string }>): Promise<APIResponse>;
    public abstract embeddings(input: string | string[]): Promise<APIResponse>;
} 