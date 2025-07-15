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
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个专业的答题助手，请严格按照指定格式回答题目。'
                        },
                        ...messages
                    ],
                    temperature: 0.3, // 使用较低的温度以提高答案的准确性
                }
            }) as ChatCompletionResponse;

            return {
                code: 200,
                message: 'success',
                data: response
            };
        } catch (error) {
            throw new Error(`DeepSeek API Error: ${error.message}`);
        }
    }

    public async embeddings(input: string | string[]): Promise<APIResponse> {
        throw new Error('DeepSeek API does not support embeddings yet');
    }
} 