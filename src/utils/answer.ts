import { debug } from './config';
import { PromptGenerator } from './prompt-generator';
import { APIFactory } from './api/factory';

interface Question {
    index: number;
    content: string;
    options?: string[];
    type: 'single' | 'multiple' | 'text' | 'judgement';
    answer?: string;
    element: HTMLElement;
    blanks?: BlankInput[]; // 新增填空题答题框信息
}

interface AnswerResult {
    question: string;
    answer: string;
    confidence: number;
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

// 计算两个字符串的相似度
function stringSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
}

export class AnswerHandler {
    private static instance: AnswerHandler;
    private questions: Question[] = [];
    private isProcessing: boolean = false;

    private constructor() {}

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
            debug('扫描题目失败: ' + error.message);
            return [];
        }
    }

    private detectQuestionType(container: HTMLElement, question: Question): void {
        // 检查是否为判断题
        const content = question.content.toLowerCase();
        if (content.includes('判断') || content.includes('正确') || content.includes('错误')) {
            question.type = 'judgement';
            return;
        }

        // 检查是否为填空题
        if (container.querySelector('input[type="text"], textarea')) {
            question.type = 'text';
            return;
        }

        // 检查是否为多选题
        if (container.querySelector('input[type="checkbox"]')) {
            question.type = 'multiple';
            return;
        }

        // 检查选项数量
        const optionCount = container.querySelectorAll('input[type="radio"]').length;
        if (optionCount > 0) {
            question.type = 'single';
            return;
        }

        // 通过选项文本判断
        const options = container.querySelectorAll('.option, .answer-option');
        if (options.length > 0) {
            let isMultiple = false;
            options.forEach(option => {
                const text = option.textContent || '';
                if (text.includes('多选') || text.match(/[A-Z]{2,}/)) {
                    isMultiple = true;
                }
            });
            question.type = isMultiple ? 'multiple' : 'single';
        }
    }

    private extractOptions(container: HTMLElement): string[] {
        const options: string[] = [];
        
        // 扩展选项的选择器
        const optionElements = container.querySelectorAll(
            '.option, .answer-option, label, ' +
            '.choice, .option-item, .answer-item, ' +
            '.option-wrapper, .answer-wrapper, .optionUl li'
        );
        
        optionElements.forEach(element => {
            // 调试：高亮选项
            element.classList.add('debug-highlight-option');
            
            const text = cleanText(element.textContent || '');
            if (text && !options.includes(text)) {
                // 移除选项标记（A. B. C.等）
                const cleanOption = text.replace(/^[A-Z][.、\s]?/i, '').trim();
                if (cleanOption) {
                    options.push(cleanOption);
                }
            }
        });

        return options;
    }

    public async getAnswer(question: Question): Promise<AnswerResult | null> {
        try {
            const config = {
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: "你是一个专业的答题助手。请根据题目内容和选项，给出最可能的答案。"
                }, {
                    role: "user",
                    content: `题目类型: ${question.type}\n题目内容: ${question.content}\n${
                        question.options ? '选项: ' + question.options.join(' | ') : ''
                    }`
                }]
            };

            const response = await fetch('https://api.example.com/answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error('API请求失败');
            }

            const result = await response.json();
            
            // 如果有选项，计算答案与选项的相似度
            let confidence = 1;
            if (question.options) {
                const similarities = question.options.map(option => 
                    stringSimilarity(result.answer.toLowerCase(), option.toLowerCase())
                );
                confidence = Math.max(...similarities);
            }

            return {
                question: question.content,
                answer: result.answer,
                confidence
            };
        } catch (error) {
            debug(`获取答案失败: ${error.message}`);
            return null;
        }
    }

    public async submitAnswer(question: Question, answer: string): Promise<boolean> {
        try {
            switch (question.type) {
                case 'single':
                case 'multiple': {
                    if (!question.options) return false;
                    
                    const answers = answer.split(',').map(a => a.trim());
                    const options = question.element.querySelectorAll('input[type="radio"], input[type="checkbox"]');
                    
                    options.forEach((input, index) => {
                        if (index < question.options!.length) {
                            const optionText = question.options![index];
                            const shouldCheck = answers.some(ans => 
                                stringSimilarity(ans.toLowerCase(), optionText.toLowerCase()) > 0.8
                            );
                            
                            if (shouldCheck) {
                                (input as HTMLInputElement).checked = true;
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        }
                    });
                    break;
                }
                case 'judgement': {
                    const trueWords = ['正确', '是', '对', 'true', 't', '√'];
                    const isTrue = trueWords.some(word => 
                        answer.toLowerCase().includes(word.toLowerCase())
                    );
                    
                    const options = question.element.querySelectorAll('input[type="radio"]');
                    if (options.length >= 2) {
                        (options[isTrue ? 0 : 1] as HTMLInputElement).checked = true;
                        options[isTrue ? 0 : 1].dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    break;
                }
                case 'text': {
                    const input = question.element.querySelector('input[type="text"], textarea');
                    if (input) {
                        (input as HTMLInputElement).value = answer;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    break;
                }
            }

            return true;
        } catch (error) {
            debug(`提交答案失败: ${error.message}`);
            return false;
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

            // 使用批量处理方式
            debug('使用批量处理方式进行答题');
            
            // 生成提示词
            const prompt = PromptGenerator.generatePrompt(questions);
            debug('生成的提示词：\n' + prompt);

            // 获取API提供者
            const apiFactory = APIFactory.getInstance();
            const provider = apiFactory.getProvider();

            // 发送请求
            const response = await provider.chat([
                { role: 'system', content: '你是一个专业的答题助手，请严格按照指定格式回答题目。' },
                { role: 'user', content: prompt }
            ]);

            if (response.data?.choices?.[0]?.message?.content) {
                const answer = response.data.choices[0].message.content;
                debug('收到AI回答：\n' + answer);

                // 解析答案并填写
                await this.processAIResponse(answer);
            } else {
                throw new Error('API响应格式错误');
            }

            debug('自动答题完成');
        } catch (error) {
            debug('自动答题失败: ' + error.message);
        } finally {
            this.isProcessing = false;
        }
    }

    private async processAIResponse(response: string): Promise<void> {
        try {
            // 添加原始响应的日志
            debug('原始AI响应：\n' + response);
            
            // 尝试解析JSON格式的答案
            let answers: Record<string, string>;
            try {
                // 首先尝试移除markdown代码块标记
                const cleanedResponse = response.replace(/^```json\n|\n```$/g, '');
                answers = JSON.parse(cleanedResponse);
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
                    // 判断题需要先检查选项顺序
                    const options = question.element.querySelectorAll('.option');
                    let correctFirst = true; // 默认认为"正确"在前

                    // 检查选项顺序
                    for (const option of options) {
                        const text = option.textContent?.trim().toLowerCase() || '';
                        if (text.includes('错误') || text.includes('false') || text.includes('×') || text.includes('x')) {
                            if (option === options[0]) {
                                correctFirst = false;
                                break;
                            }
                        }
                    }

                    debug(`判断题选项顺序：${correctFirst ? '"正确"在前' : '"错误"在前'}`);

                    // 根据答案和选项顺序决定点击哪个选项
                    const isCorrect = answer.toUpperCase() === 'A';
                    // 如果正确在前，A对应第一个选项；如果错误在前，A对应第二个选项
                    const targetIndex = correctFirst ? 
                        (isCorrect ? 1 : 2) : // 正确在前：A选1，B选2
                        (isCorrect ? 2 : 1);

                    const targetOption = question.element.querySelector(`.option:nth-child(${targetIndex})`) as HTMLElement;
                    if (targetOption) {
                        debug(`点击判断题选项：${isCorrect ? '正确' : '错误'} (第${targetIndex}个选项)`);
                        targetOption.click();
                    } else {
                        debug('未找到判断题的选项元素');
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
                            blank.element.dispatchEvent(new Event('input', { bubbles: true }));
                            blank.element.dispatchEvent(new Event('change', { bubbles: true }));
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
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                textarea.dispatchEvent(new Event('change', { bubbles: true }));
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
            debug('处理AI响应失败：' + error.message);
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

    private async processBlankAnswer(questionIndex: number, blankNumber: number, answer: string): Promise<void> {
        const question = this.questions.find(q => q.index === questionIndex);
        if (!question || !question.blanks) return;

        // 找到对应的填空框
        const blank = question.blanks.find(b => b.number === blankNumber);
        if (!blank) return;

        // 设置答案
        blank.element.value = answer;
        blank.element.dispatchEvent(new Event('input', { bubbles: true }));
        blank.element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    public stopAutoAnswer(): void {
        this.isProcessing = false;
        debug('停止自动答题');
    }

    public getQuestions(): Question[] {
        return this.questions;
    }
} 