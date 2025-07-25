import {EventEmitter} from './event-emitter';

export interface APIConfig {
    apiKey: string;
    baseURL?: string;
}

export interface APIResponse {
    code: number;
    message: string;
    data?: any;
}

export interface ChatMessage {
    role: string;
    content: string;
}

export interface ChatCompletionResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export interface APIProviderConfig {
    model: {
        chat: string;
        embedding?: string;
    };
    systemPrompt?: string;
}

export abstract class BaseAPIProvider extends EventEmitter {
    protected apiKey: string;
    protected baseURL: string;

    constructor(config: APIConfig) {
        super();
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || this.getDefaultBaseURL();
    }

    public async chat(messages: ChatMessage[]): Promise<APIResponse> {
        try {
            const config = this.getConfig();
            const response = await this.customFetch('/chat/completions', {
                method: 'POST',
                headers: this.getDefaultHeaders(),
                body: {
                    model: config.model.chat,
                    messages: [
                        {
                            role: 'system',
                            content: config.systemPrompt || '你是一位严谨的软件工程师，碰到问题会认真思考，请严格按照指定格式回答题目。'
                        },
                        ...messages
                    ],
                    temperature: 0.3,
                }
            }) as ChatCompletionResponse;

            return {
                code: 200,
                message: 'success',
                data: response
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`API Error: ${errorMessage}`);
        }
    }

    public async embeddings(input: string | string[]): Promise<APIResponse> {
        try {
            const config = this.getConfig();
            if (!config.model.embedding) {
                throw new Error('Embeddings not supported by this provider');
            }

            const response = await this.customFetch('/embeddings', {
                method: 'POST',
                headers: this.getDefaultHeaders(),
                body: {
                    model: config.model.embedding,
                    input: Array.isArray(input) ? input : [input],
                }
            });

            return {
                code: 200,
                message: 'success',
                data: response
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`API Error: ${errorMessage}`);
        }
    }

    protected abstract getDefaultBaseURL(): string;

    protected abstract getDefaultHeaders(): Record<string, string>;

    protected abstract getConfig(): APIProviderConfig;

    protected async customFetch(endpoint: string, options: {
        method: string;
        headers: Record<string, string>;
        body?: any
    }): Promise<any> {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method,
                url: `${this.baseURL}${endpoint}`,
                headers: options.headers,
                data: options.body ? JSON.stringify(options.body) : undefined,
                responseType: 'json',
                onload: function (response: any) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`HTTP Error: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function (error: any) {
                    reject(new Error('Network Error: ' + error.error));
                }
            });
        });
    }
}