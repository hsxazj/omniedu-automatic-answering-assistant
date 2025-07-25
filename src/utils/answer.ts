import {debug} from './config';
import {PromptGenerator} from './prompt-generator';
import {APIFactory} from './api/factory';

export interface Question {
    index: number;
    content: string;
    options?: string[];
    type: 'single' | 'multiple' | 'text' | 'judgement';
    answer?: string;
    element: HTMLElement;
    blanks?: BlankInput[];
}

interface BlankInput {
    number: number;
    element: HTMLInputElement;
}

// 用于清理文本的工具函数
function cleanText(text: string): string {
    // 1. 基本清理
    let cleaned = text.replace(/\s+/g, ' ').trim()
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/[（）]/g, "()")
        .replace(/[【】]/g, "[]");

    // 2. 移除（数字分）格式
    cleaned = cleaned.replace(/[（(]\s*\d+\s*分\s*[）)]/g, '');

    // 3. 处理括号
    let firstLeftBracket = cleaned.indexOf('(');
    let lastRightBracket = cleaned.lastIndexOf(')');

    if (firstLeftBracket !== -1 && lastRightBracket !== -1) {
        // 提取括号前、括号中、括号后的内容
        let beforeBracket = cleaned.substring(0, firstLeftBracket);
        let afterBracket = cleaned.substring(lastRightBracket + 1);

        // 清理括号中的内容（移除其他括号）
        let insideBracket = cleaned.substring(firstLeftBracket + 1, lastRightBracket)
            .replace(/[()（）]/g, '');

        // 重新组合文本
        cleaned = beforeBracket + '(' + insideBracket + ')' + afterBracket;
    }

    // 4. 最后的清理
    cleaned = cleaned.replace(/\s+/g, ' ').trim() // 再次清理多余空格
        .replace(/\(\s+/g, '(') // 清理左括号后的空格
        .replace(/\s+\)/g, ')'); // 清理右括号前的空格

    return cleaned;
}

export class AnswerHandler {
    private static instance: AnswerHandler;
    private questions: Question[] = [];
    private isProcessing: boolean = false;

    private constructor() {
    }

    public static getInstance(): AnswerHandler {
        if (!AnswerHandler.instance) {
            AnswerHandler.instance = new AnswerHandler();
        }
        return AnswerHandler.instance;
    }

    public async scanQuestions(): Promise<Question[]> {
        try {
            const questions: Question[] = [];

            // 用于收集每种题型的题目
            const questionsByType: {
                single: string[];
                multiple: string[];
                judgement: string[];
                text: string[];
            } = {
                single: [],
                multiple: [],
                judgement: [],
                text: []
            };

            // 首先找到题目列表容器
            const groupList = document.querySelector('.group-list.scrollbar');
            if (!groupList) {
                debug('未找到题目列表容器');
                return [];
            }

            // 找到所有题型组
            const groups = groupList.querySelectorAll('.group');
            if (groups.length === 0) {
                debug('未找到题型组');
                return [];
            }

            let questionIndex = 1;
            // 遍历每个题型组
            groups.forEach(group => {
                // 获取题型标题
                const titleEl = group.querySelector('.title');
                const groupTitle = titleEl?.textContent?.trim() || '';

                // 解析题型信息
                let questionType: Question['type'] = 'single'; // 默认为单选题
                let questionCount = 0;
                let totalScore = 0;

                // 使用正则表达式解析题型标题
                const titleInfo = groupTitle.match(/[一二三四五六七八九十]+、(.+?)（共(\d+)题，共(\d+)分）/);
                if (titleInfo) {
                    const [_, typeText, count, score] = titleInfo;
                    questionCount = parseInt(count);
                    totalScore = parseInt(score);

                    // 根据题型文本判断类型
                    if (typeText.includes('单选')) {
                        questionType = 'single';
                    } else if (typeText.includes('多选')) {
                        questionType = 'multiple';
                    } else if (typeText.includes('判断')) {
                        questionType = 'judgement';
                    } else if (typeText.includes('填空') || typeText.includes('简答')) {
                        questionType = 'text';
                    }
                }

                // 找到该组下的所有题目
                const questionElements = group.querySelectorAll('.question');
                questionElements.forEach(questionEl => {
                    // 查找题目内容
                    const titleContent = questionEl.querySelector('.ck-content.title');
                    let titleText = '';

                    if (titleContent) {
                        // 处理简答题的特殊格式
                        if (questionType === 'text') {
                            const allParagraphs = titleContent.querySelectorAll('span p');
                            titleText = Array.from(allParagraphs).map(p => {
                                // 获取所有带背景色的代码片段
                                const codeSpans = p.querySelectorAll('span[style*="background-color"]');
                                if (codeSpans.length > 0) {
                                    // 如果有代码片段，替换原始HTML中的空格实体
                                    return Array.from(codeSpans).map(span =>
                                        span.innerHTML
                                            .replace(/&nbsp;/g, ' ')
                                            .trim()
                                    ).join(' ');
                                }
                                // 普通文本直接返回
                                return p.textContent?.trim() || '';
                            }).filter(text => text).join('\n');
                        } else {
                            // 其他题型保持原有处理方式
                            titleText = titleContent.querySelector('span p')?.textContent || '';
                        }
                    }

                    if (!titleText) {
                        debug(`未找到题目内容: 第 ${questionIndex} 题`);
                        return;
                    }

                    // 移除（数字分）格式，保持原始文本不变
                    const content = titleText.replace(/[（(]\s*\d+\s*分\s*[）)]/g, '').trim();

                    // 解析选项
                    const optionList = questionEl.querySelector('.option-list');
                    const options: string[] = [];

                    if (optionList) {
                        const optionElements = optionList.querySelectorAll('.option');
                        optionElements.forEach(optionEl => {
                            const item = optionEl.querySelector('.item')?.textContent?.trim() || '';
                            const optContent = optionEl.querySelector('.ck-content.opt-content span p')?.textContent?.trim() || '';
                            if (item && optContent) {
                                options.push(`${item}. ${optContent}`);
                            }
                        });
                    }

                    // 基本题目信息
                    const question: Question = {
                        index: questionIndex++,
                        content,
                        type: questionType,
                        element: questionEl as HTMLElement,
                        options: options.length > 0 ? options : undefined
                    };

                    // 如果是判断题，检测正确选项是否在前
                    if (questionType === 'judgement' && options.length === 2) {
                        const firstOptionText = options[0].replace(/^[A-Z]\.\s*/, '').toLowerCase().trim();
                        question.answer = firstOptionText === '正确' ||
                            firstOptionText === 'true' ||
                            firstOptionText === '对' ||
                            firstOptionText === '√';
                        debug(`判断题 ${question.index} 的正确选项在${question.answer ? '前' : '后'}`);
                    }

                    // 如果是填空题，识别答题框
                    if (questionType === 'text') {
                        const textQue = questionEl.querySelector('.que-title')?.nextElementSibling;
                        if (textQue?.classList.contains('text-que')) {
                            const blanks: BlankInput[] = [];
                            const opts = textQue.querySelectorAll('.opt');

                            opts.forEach(opt => {
                                const numberSpan = opt.querySelector('span');
                                const inputWrapper = opt.querySelector('.el-input.el-input--small.el-input--suffix');
                                const input = inputWrapper?.querySelector('.el-input__inner') as HTMLInputElement;

                                if (numberSpan && input) {
                                    blanks.push({
                                        number: parseInt(numberSpan.textContent?.replace(/[^\d]/g, '') || '0'),
                                        element: input
                                    });
                                }
                            });

                            if (blanks.length > 0) {
                                question.blanks = blanks;
                            }
                        }
                    }

                    questions.push(question);

                    // 将题目添加到对应题型的列表中
                    questionsByType[questionType].push(`${question.index}. ${content}`);
                });
            });

            this.questions = questions;

            // 按题型打印题目列表
            if (questionsByType.single.length > 0) {
                debug('单选题：');
                questionsByType.single.forEach(q => debug(q));
            }

            if (questionsByType.multiple.length > 0) {
                debug('多选题：');
                questionsByType.multiple.forEach(q => debug(q));
            }

            if (questionsByType.judgement.length > 0) {
                debug('判断题：');
                questionsByType.judgement.forEach(q => debug(q));
            }

            if (questionsByType.text.length > 0) {
                debug('填空/简答题：');
                questionsByType.text.forEach(q => debug(q));
            }

            debug(`共扫描到 ${questions.length} 个题目`);
            return questions;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            debug('扫描题目失败: ' + errorMessage);
            return [];
        }
    }

    public async startAutoAnswer(): Promise<void> {
        if (this.isProcessing) {
            debug('已有答题任务正在进行中');
            return;
        }

        try {
            this.isProcessing = true;
            debug('开始自动答题');

            const questions = await this.scanQuestions();
            if (questions.length === 0) {
                throw new Error('未找到任何题目');
            }

            // 获取API工厂实例
            const apiFactory = APIFactory.getInstance();

            // 尝试使用题库
            const questionBank = apiFactory.getQuestionBank();
            const answers: Record<string, string> = {};

            if (questionBank) {
                debug('检测到题库配置，开始测试题库连接');

                // 测试题库连接
                const isConnected = await questionBank.testConnection();

                if (!isConnected) {
                    debug('题库连接测试失败，跳过题库搜题');
                } else {
                    debug('题库连接测试成功，开始使用题库查询答案');

                    // 先尝试从题库获取答案
                    for (const question of questions) {
                        try {
                            const result = await questionBank.query(
                                question.content,
                                question.options
                            );
                            if (result) {
                                debug(`题库匹配成功 - 题目 ${question.index}: ${result.answer}`);
                                answers[question.index.toString()] = result.answer;
                            }
                        } catch (error) {
                            debug(`题库查询失败 - 题目 ${question.index}: ${error.message}`);
                        }
                    }

                    // 统计题库匹配结果
                    const matchedCount = Object.keys(answers).length;
                    debug(`题库匹配结果：共 ${questions.length} 题，匹配成功 ${matchedCount} 题`);

                    // 如果所有题目都匹配到了答案，直接处理
                    if (matchedCount === questions.length) {
                        debug('所有题目都在题库中找到答案，开始填写');
                        await this.processAIResponse(JSON.stringify(answers));
                        debug('题库答题完成');
                        return;
                    }

                    // 如果有部分题目匹配到答案
                    if (matchedCount > 0) {
                        debug('部分题目在题库中找到答案，继续使用AI回答剩余题目');
                    }
                }
            }

            // 对于未匹配到答案的题目，使用AI回答
            const remainingQuestions = questions.filter(q => !answers[q.index.toString()]);
            if (remainingQuestions.length > 0) {
                debug(`使用AI回答${remainingQuestions.length}道题目`);

                // 生成提示词
                const prompt = PromptGenerator.generatePrompt(remainingQuestions);
                debug('生成的提示词：\n' + prompt);

                // 获取API提供者
                const provider = apiFactory.getProvider();

                // 发送请求
                const response = await provider.chat([
                    {role: 'user', content: prompt}
                ]);

                if (response.data?.choices?.[0]?.message?.content) {
                    const aiAnswer = response.data.choices[0].message.content;
                    debug('收到AI回答：\n' + aiAnswer);

                    // 解析AI答案
                    try {
                        const cleanedResponse = aiAnswer.replace(/^```json\n|\n```$/g, '');
                        const aiAnswers = JSON.parse(cleanedResponse);

                        // 合并题库答案和AI答案
                        Object.assign(answers, aiAnswers);
                    } catch (error) {
                        debug('解析AI回答失败：' + error.message);
                        throw error;
                    }
                } else {
                    throw new Error('API响应格式错误');
                }
            }

            // 处理所有答案
            await this.processAIResponse(JSON.stringify(answers));
            debug('自动答题完成');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            debug('自动答题失败: ' + errorMessage);
        } finally {
            this.isProcessing = false;
        }
    }

    public stopAutoAnswer(): void {
        this.isProcessing = false;
        debug('停止自动答题');
    }

    public getQuestions(): Question[] {
        return this.questions;
    }

    private async processAIResponse(response: string): Promise<void> {
        try {
            // 尝试解析JSON格式的答案
            let answers: Record<string, string>;
            try {
                // 首先尝试移除markdown代码块标记
                const cleanedResponse = response.replace(/^```json\n|\n```$/g, '');
                answers = JSON.parse(cleanedResponse);

                // 过滤掉不在当前题目列表中的答案
                const validAnswers: Record<string, string> = {};
                const currentQuestionIndexes = this.questions.map(q => q.index.toString());

                for (const [index, answer] of Object.entries(answers)) {
                    if (currentQuestionIndexes.includes(index)) {
                        validAnswers[index] = answer;
                    } else {
                        debug(`跳过非当前题目的答案：题号 ${index}`);
                    }
                }
                answers = validAnswers;
            } catch (e) {
                // 如果不是JSON格式，尝试解析普通文本格式
                answers = {};
                response.split(/[,;]/).forEach(item => {
                    const match = item.trim().match(/(\d+):(.+)/);
                    if (match) {
                        answers[match[1]] = match[2].trim();
                    }
                });
            }
            debug('解析后的答案对象：\n' + JSON.stringify(answers, null, 2));

            // 遍历所有答案
            for (const [questionNumber, answer] of Object.entries(answers)) {
                const index = parseInt(questionNumber);
                if (isNaN(index)) {
                    debug(`跳过无效题号：${questionNumber}`);
                    continue;
                }

                const question = this.questions.find(q => q.index === index);
                if (!question) {
                    debug(`未找到题号 ${index} 对应的题目`);
                    continue;
                }

                debug(`处理第 ${index} 题答案：\n类型：${question.type}\n答案：${answer}`);

                // 根据题目类型处理答案
                if (question.type === 'judgement') {
                    // 判断题处理
                    const cleanAnswer = answer.toLowerCase().trim();
                    const isCorrect = cleanAnswer === '正确' ||
                        cleanAnswer === 'true' ||
                        cleanAnswer === '对' ||
                        cleanAnswer === '√' ||
                        cleanAnswer === 'a';

                    // 获取当前题目的选项
                    const options = question.element.querySelectorAll('.option');
                    if (options.length !== 2) {
                        debug(`判断题选项数量异常：${options.length}`);
                        continue;
                    }

                    // 解析每个选项的文本
                    const optionTexts = Array.from(options).map(opt =>
                        opt.textContent?.trim().toLowerCase() || ''
                    );

                    // 判断第一个选项是否为"正确"
                    const firstOptionCorrect = optionTexts[0].includes('正确') ||
                        optionTexts[0].includes('true') ||
                        optionTexts[0].includes('对') ||
                        optionTexts[0].includes('√');

                    debug(`判断题 ${index} 选项顺序：${firstOptionCorrect ? '"正确"在前' : '"错误"在前'}`);
                    debug(`判断题 ${index} 答案解析：${isCorrect ? '正确' : '错误'}`);

                    // 根据答案和当前题目的选项顺序决定点击哪个选项
                    const targetIndex = firstOptionCorrect ?
                        (isCorrect ? 1 : 2) : // 正确在前：正确选1，错误选2
                        (isCorrect ? 2 : 1);  // 错误在前：正确选2，错误选1

                    const targetOption = question.element.querySelector(`.option:nth-child(${targetIndex})`) as HTMLElement;
                    if (targetOption) {
                        debug(`点击判断题 ${index} 选项：${isCorrect ? '正确' : '错误'} (第${targetIndex}个选项)`);
                        targetOption.click();
                    } else {
                        debug(`未找到判断题 ${index} 的选项元素`);
                    }
                } else if (question.type === 'text') {
                    // 填空题或简答题
                    if (question.blanks && question.blanks.length > 0) {
                        // 处理填空题
                        debug(`第 ${index} 题是填空题，填空数量：${question.blanks.length}`);
                        const answers = answer.split(':::').map(a => a.trim());
                        for (let i = 0; i < question.blanks.length && i < answers.length; i++) {
                            const blank = question.blanks[i];
                            blank.element.value = answers[i];
                            blank.element.dispatchEvent(new Event('input', {bubbles: true}));
                            blank.element.dispatchEvent(new Event('change', {bubbles: true}));
                        }
                    } else {
                        // 处理简答题
                        debug(`第 ${index} 题是简答题`);
                        const queTitle = question.element.querySelector('.que-title');
                        if (queTitle) {
                            const textarea = queTitle.nextElementSibling?.querySelector('.el-textarea__inner') as HTMLTextAreaElement;
                            if (textarea) {
                                debug('找到简答题的textarea元素');
                                textarea.value = answer;
                                textarea.dispatchEvent(new Event('input', {bubbles: true}));
                                textarea.dispatchEvent(new Event('change', {bubbles: true}));
                            } else {
                                debug('未找到简答题的textarea元素');
                            }
                        } else {
                            debug('未找到简答题的que-title元素');
                        }
                    }
                } else {
                    // 选择题（单选、多选）
                    debug(`第 ${index} 题是选择题，开始处理选项答案`);
                    await this.processOptionAnswer(index, answer);
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            debug('处理AI响应失败：' + errorMessage);
            throw error;
        }
    }

    private async processOptionAnswer(questionIndex: number, answer: string): Promise<void> {
        const question = this.questions.find(q => q.index === questionIndex);
        if (!question || !question.options) {
            debug(`处理选项答案失败：未找到题目 ${questionIndex} 或题目没有选项`);
            return;
        }

        debug(`处理第 ${questionIndex} 题选项答案：\n题型：${question.type}\n答案：${answer}\n可用选项：${question.options.join(', ')}`);

        // 处理单选题和多选题
        let answerLetters: string[] = [];
        if (answer.includes('&')) {
            // 处理多选题格式 "A&B&C"
            answerLetters = answer.toUpperCase().split('&');
        } else if (answer.includes(',')) {
            // 处理多选题格式 "A,B,C"
            answerLetters = answer.toUpperCase().split(',');
        } else {
            // 处理单选题格式 "A" 或其他格式
            answerLetters = [answer.toUpperCase().charAt(0)];
        }

        debug(`答案字母：${answerLetters.join(', ')}`);

        for (const letter of answerLetters) {
            // 找到对应选项的索引（A=0, B=1, C=2, D=3）
            const optionIndex = letter.trim().charAt(0).charCodeAt(0) - 'A'.charCodeAt(0);
            if (optionIndex >= 0 && optionIndex < question.options.length) {
                const targetOption = question.element.querySelector(`.option:nth-child(${optionIndex + 1})`) as HTMLElement;
                if (targetOption) {
                    debug(`点击选项 ${letter}：${question.options[optionIndex]}`);
                    targetOption.click();
                } else {
                    debug(`未找到选项 ${letter} 的元素`);
                }
            } else {
                debug(`选项索引超出范围：${letter} -> ${optionIndex}`);
            }
        }
    }
}