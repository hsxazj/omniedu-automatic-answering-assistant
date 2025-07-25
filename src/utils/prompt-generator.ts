import {Question} from './answer';

export class PromptGenerator {
    public static generatePrompt(questions: Question[]): string {
        const questionsByType = questions.reduce((acc, q) => {
            if (!acc[q.type]) {
                acc[q.type] = [];
            }
            acc[q.type].push(q);
            return acc;
        }, {} as Record<string, Question[]>);

        let prompt = '请根据题型回答以下题目。请注意：准确性比速度更重要，如果不确定某题的答案，可以跳过该题。\n\n';

        // 添加题型说明
        prompt += this.getQuestionTypeInstructions() + '\n\n';

        // 按题型分组添加题目
        for (const [type, questionsOfType] of Object.entries(questionsByType)) {
            if (questionsOfType.length > 0) {
                prompt += `${this.getTypeTitle(type)}：\n`;
                prompt += this.formatQuestions(questionsOfType) + '\n\n';
            }
        }

        return prompt;
    }

    private static formatQuestions(questions: Question[]): string {
        return questions.map(q => {
            let questionText = `${q.index}. ${q.content}`;
            if (q.options) {
                questionText += '\n' + q.options.map((opt: string) => `   ${opt}`).join('\n');
            }
            // 添加填空题/简答题的标识
            if (q.type === 'text') {
                if (q.blanks && q.blanks.length > 0) {
                    questionText += `\n   [填空题，共${q.blanks.length}个空]`;
                } else {
                    questionText += '\n   [简答题]';
                }
            }
            return questionText;
        }).join('\n\n');
    }

    private static getQuestionTypeInstructions(): string {
        return `
请仔细阅读每道题目，确保答案的准确性。宁可多花时间思考，也不要为了速度而牺牲正确率。

回答要求：
1. 对于选择题，请仔细分析每个选项，确保选择最准确的答案。
2. 对于判断题，请详细思考后再判断正误，不要轻易下结论。
3. 对于填空题，请注意空的数量，按顺序填写每个空的答案。
4. 对于简答题，请给出完整、准确的答案。
5. 如果对某道题目没有完全把握，可以跳过该题（不提供答案）。
6. 请不要为了全部回答而随意猜测答案。

答案格式说明：
- 单选题：回复格式为 "题号:选项"，如 "1:A"
- 多选题：回复格式为 "题号:选项&选项"，如 "2:A&B"
- 判断题：回复格式为 "题号:选项"，其中A为正确，B为错误
- 填空题：回复格式为 "题号:答案1:::答案2:::答案3"，如 "3:test1:::test2"
- 简答题：回复格式为 "题号:答案"

多个答案之间使用逗号分隔，不同题型之间使用分号分隔。
仅返回JSON格式的答案，不要有任何其他解释或说明。

示例答案格式：
{
    "1": "A",
    "2": "A&B",
    "3": "B",
    "4": "答案1:::答案2",
    "5": "这是简答题的答案"
}
`.trim();
    }

    private static getTypeTitle(type: string): string {
        switch (type) {
            case 'single':
                return '单选题（请仔细分析每个选项）';
            case 'multiple':
                return '多选题（注意可能有多个正确答案）';
            case 'judgement':
                return '判断题（请认真思考后再判断）';
            case 'text':
                return '填空/简答题（请确保答案准确完整）';
            default:
                return type;
        }
    }
}

// 使用示例：
/*
const questions = [
    {
        index: 1,
        content: "以下哪个是JavaScript的基本数据类型？",
        type: "single",
        options: ["A. Object", "B. String", "C. Array", "D. Function"]
    },
    {
        index: 2,
        content: "JavaScript中的真值包括：",
        type: "multiple",
        options: ["A. true", "B. 非空字符串", "C. 0", "D. 非空数组"]
    }
];

const prompt = PromptGenerator.generatePrompt(questions);
*/