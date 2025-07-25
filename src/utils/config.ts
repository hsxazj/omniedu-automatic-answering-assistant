export interface Config {
    apiType: 'moonshot' | 'deepseek' | 'chatgpt' | 'custom-openai';
    apiKeys: {
        moonshot?: string;
        deepseek?: string;
        chatgpt?: string;
        'custom-openai'?: string;
    };
    customOpenAIUrl?: string;
    customOpenAIModel?: string;
    questionBankToken?: string;
    debugMode: boolean;
}

const defaultConfig: Config = {
    apiType: 'moonshot',
    apiKeys: {},
    customOpenAIUrl: 'https://new.ljcljc.cn/v1',
    customOpenAIModel: 'gpt-4.1',
    debugMode: true
};

export function getConfig(): Config {
    const savedConfig = localStorage.getItem('auto-answer-config');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        // 兼容旧版本配置
        if ('apiKey' in config) {
            const oldApiKey = config.apiKey;
            config.apiKeys = {
                [config.apiType]: oldApiKey
            };
            delete config.apiKey;
            saveConfig(config);
        }
        return config;
    }
    return defaultConfig;
}

export function saveConfig(config: Config): void {
    localStorage.setItem('auto-answer-config', JSON.stringify(config));
}

export function debug(message: string): void {
    const config = getConfig();
    if (config.debugMode) {
        console.log('[自动答题助手]', message);
    }
}