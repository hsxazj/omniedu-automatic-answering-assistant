import { BaseAPIProvider } from './base';
import { MoonshotAPIProvider } from './moonshot';
import { DeepSeekAPIProvider } from './deepseek';
import { ChatGPTAPIProvider } from './chatgpt';
import { CustomOpenAIAPIProvider } from './custom-openai';
import { QuestionBankAPI } from './question-bank';
import { getConfig } from '../config';

export class APIFactory {
    private static instance: APIFactory;
    private provider: BaseAPIProvider | null = null;
    private questionBank: QuestionBankAPI | null = null;

    private constructor() {}

    public static getInstance(): APIFactory {
        if (!APIFactory.instance) {
            APIFactory.instance = new APIFactory();
        }
        return APIFactory.instance;
    }

    public getQuestionBank(): QuestionBankAPI | null {
        const config = getConfig();
        if (config.questionBankToken) {
            if (!this.questionBank) {
                this.questionBank = new QuestionBankAPI(config.questionBankToken);
            }
            return this.questionBank;
        }
        return null;
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
                case 'custom-openai':
                    this.provider = new CustomOpenAIAPIProvider({
                        apiKey,
                        baseURL: config.customOpenAIUrl || 'https://api.openai.com/v1'
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
        this.questionBank = null;
    }
}