export interface Config {
    apiType: 'moonshot' | 'deepseek';
    apiKey: string;
    debugMode: boolean;
}

const defaultConfig: Config = {
    apiType: 'moonshot',
    apiKey: '',
    debugMode: true
};

export function getConfig(): Config {
    const savedConfig = localStorage.getItem('auto-answer-config');
    if (savedConfig) {
        return JSON.parse(savedConfig);
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