import {BaseAPIProvider} from './base';
import {debug} from '../config';

interface QuestionBankResponse {
    code: number;
    data?: {
        question: string;
        answer: string;
        times: number;
    };
    message: string;
}

export class QuestionBankAPI extends BaseAPIProvider {
    private token: string;

    constructor(token: string) {
        super({apiKey: token});
        this.token = token;
    }

    // 测试题库连接
    async testConnection(): Promise<boolean> {
        try {
            const url = new URL('query', this.getDefaultBaseURL());
            url.searchParams.set('token', this.token);
            url.searchParams.set('title', '下列选项中，用于获取POST请求参数的是');

            const res = await fetch(url.toString(), {method: 'GET'});
            const response = await res.json() as QuestionBankResponse;

            debug(`题库测试响应：${JSON.stringify(response)}`);
            return response.code === 1;
        } catch (error) {
            debug(`题库测试失败: ${error.message}`);
            return false;
        }
    }

    async query(title: string, options?: string[]): Promise<{ answer: string; } | null> {
        try {
            const url = new URL('query', this.getDefaultBaseURL());
            url.searchParams.set('token', this.token);
            url.searchParams.set('title', title);

            const res = await fetch(url.toString(), {method: 'GET'});
            const response = await res.json() as QuestionBankResponse;

            debug(`题库响应：${JSON.stringify(response)}`);

            if (response.code === 1 && response.data) {
                const rawAnswer = response.data.answer;
                debug(`题库返回原始答案: ${rawAnswer}`);

                if (options && options.length > 0) {
                    if (this.isJudgementQuestion(options)) {
                        const matchedOption = this.processJudgementAnswer(rawAnswer, options);
                        if (matchedOption) {
                            debug(`题库答案匹配到选项: ${matchedOption}`);
                            return {answer: matchedOption};
                        }
                    } else {
                        const matchedOption = this.findAnswerOption(rawAnswer, options);
                        if (matchedOption) {
                            debug(`题库答案匹配到选项: ${matchedOption}`);
                            return {answer: matchedOption};
                        }
                    }
                    debug(`题库答案未能匹配到选项，原始答案: ${rawAnswer}，可用选项: ${options.join(', ')}`);
                    return null;
                }

                const processedAnswer = this.processAnswer(rawAnswer, options);
                debug(`题库答案处理后: ${processedAnswer}`);
                return {answer: processedAnswer};
            }

            debug(`题库未匹配到答案: ${response.message}`);
            return null;
        } catch (error) {
            debug(`题库查询失败: ${error.message}`);
            return null;
        }
    }

    protected getDefaultBaseURL(): string {
        return 'https://tk.enncy.cn';
    }

    protected getDefaultHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json'
        };
    }

    protected getConfig() {
        return {
            model: {
                chat: 'question-bank'
            }
        };
    }

    // 判断是否为判断题
    private isJudgementQuestion(options: string[]): boolean {
        if (options.length !== 2) return false;

        const optionTexts = options.map(opt =>
            opt.replace(/^[A-Z]\.\s*/, '').toLowerCase().trim()
        );

        const hasCorrect = optionTexts.some(text =>
            text === '正确' || text === 'true' || text === '对' || text === '√'
        );
        const hasIncorrect = optionTexts.some(text =>
            text === '错误' || text === 'false' || text === '错' || text === '×'
        );

        return hasCorrect && hasIncorrect;
    }

    // 处理判断题答案
    private processJudgementAnswer(answer: string, options: string[]): string | null {
        const cleanAnswer = answer.toLowerCase().trim();
        const isCorrect = cleanAnswer === '正确' ||
            cleanAnswer === 'true' ||
            cleanAnswer === '对' ||
            cleanAnswer === '√' ||
            cleanAnswer === 'a';

        const optionTexts = options.map(opt =>
            opt.replace(/^[A-Z]\.\s*/, '').toLowerCase().trim()
        );

        const correctFirst = optionTexts[0] === '正确' ||
            optionTexts[0] === 'true' ||
            optionTexts[0] === '对' ||
            optionTexts[0] === '√';

        return correctFirst ? (isCorrect ? 'A' : 'B') : (isCorrect ? 'B' : 'A');
    }

    // 查找答案对应的选项
    private findAnswerOption(answer: string, options: string[]): string | null {
        const cleanAnswer = answer.replace(/[.,，。、\s]/g, '').toLowerCase();

        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const optionContent = option.replace(/^[A-Z]\.\s*/, '').replace(/[.,，。、\s]/g, '').toLowerCase();

            if (optionContent.includes(cleanAnswer) || cleanAnswer.includes(optionContent)) {
                return String.fromCharCode(65 + i);
            }
        }

        return null;
    }

    // 处理题库答案格式
    private processAnswer(answer: string, options?: string[]): string {
        const cleanAnswer = answer.trim();

        if (options && options.length > 0) {
            return cleanAnswer;
        }

        if (cleanAnswer.includes(';')) {
            return cleanAnswer.split(';')
                .map(part => part.trim())
                .filter(part => part)
                .join(':::');
        }

        return cleanAnswer;
    }
} 