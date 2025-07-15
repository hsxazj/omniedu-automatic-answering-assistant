import { BaseAPIProvider, APIResponse } from './base';

interface ChatMessage {
    role: string;
    content: string;
}

interface ChatCompletionResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

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

    private async customFetch(endpoint: string, options: { method: string; headers: Record<string, string>; body?: any }): Promise<any> {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method,
                url: `${this.baseURL}${endpoint}`,
                headers: options.headers,
                data: options.body ? JSON.stringify(options.body) : undefined,
                responseType: 'json',
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`HTTP Error: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network Error: ' + error.error));
                }
            });
        });
    }

    public async chat(messages: ChatMessage[]): Promise<APIResponse> {
        try {
            const response = await this.customFetch('/chat/completions', {
                method: 'POST',
                headers: this.getDefaultHeaders(),
                body: {
                    model: 'moonshot-v1-8k',
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个专业的答题助手，请严格按照指定格式回答题目。'
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
            throw new Error(`Moonshot API Error: ${error.message}`);
        }
    }

    public async embeddings(input: string | string[]): Promise<APIResponse> {
        try {
            const response = await this.customFetch('/embeddings', {
                method: 'POST',
                headers: this.getDefaultHeaders(),
                body: {
                    model: 'text-embedding-v1',
                    input: Array.isArray(input) ? input : [input],
                }
            });

            return {
                code: 200,
                message: 'success',
                data: response
            };
        } catch (error) {
            throw new Error(`Moonshot API Error: ${error.message}`);
        }
    }
} 