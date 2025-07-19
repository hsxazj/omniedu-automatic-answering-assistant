import styles from '../styles/auto-answer.module.css';
import { getConfig, saveConfig, debug, Config } from '../utils/config';
import { AnswerHandler, Question } from '../utils/answer';
import { APIFactory } from '../utils/api/factory';

export class ConfigPanel {
    private panel: HTMLElement;
    private answerHandler: AnswerHandler;
    private currentConfig: Config;

    constructor() {
        this.panel = this.createPanel();
        this.answerHandler = AnswerHandler.getInstance();
        this.currentConfig = getConfig();
        this.initEvents();
    }

    private createPanel(): HTMLElement {
        const panel = document.createElement('div');
        panel.className = styles.configPanel;
        panel.innerHTML = `
            <div class="${styles.panelHeader}">
                <div class="${styles.closeBtn}" title="关闭">×</div>
            </div>
            <div class="${styles.tabContainer}">
                <div class="${styles.tab} ${styles.active}" data-tab="questions">识别题目</div>
                <div class="${styles.tab}" data-tab="api">API配置</div>
            </div>
            <div class="${styles.tabContent} ${styles.active}" id="questions-tab">
                <div class="${styles.questionGrid}"></div>
                <div class="${styles.questionDetail}">
                    <p>请点击题号查看详细信息</p>
                </div>
                <div class="${styles.btnContainer}">
                    <button class="${styles.btn} ${styles.btnPrimary}" id="toggle-answer">开始答题</button>
                    <button class="${styles.btn} ${styles.btnDefault}" id="scan-questions">重新扫描</button>
                </div>
            </div>
            <div class="${styles.tabContent}" id="api-tab">
                <div class="${styles.apiConfig}">
                    <div class="${styles.formItem}">
                        <label>API类型</label>
                        <select id="api-type">
                            <option value="moonshot">Moonshot</option>
                            <option value="deepseek">Deepseek</option>
                            <option value="chatgpt">ChatGPT</option>
                            <option value="custom-openai">自定义OpenAI接口</option>
                        </select>
                    </div>
                    <div class="${styles.formItem}" id="custom-url-item" style="display: none;">
                        <label>自定义API地址</label>
                        <input type="text" id="custom-openai-url" placeholder="请输入自定义OpenAI API地址，如：https://new.ljcljc.cn/v1" value="">
                        <div class="${styles.apiKeyHelp}">
                            <p>请输入完整的API地址，包括协议和版本号</p>
                            <p>推荐使用 <a href="https://e.ljcsys.top/ai/" target="_blank" style="color: #409EFF; text-decoration: none;">AI API</a> 代理服务，支持 ChatGPT、Gemini、Claude 等主流模型，一键接入。</p>
                            <p><a href="https://new.ljcljc.cn/pricing" target="_blank" style="color: #409EFF; text-decoration: none;">查看模型列表</a></p>
                        </div>
                    </div>
                    <div class="${styles.formItem}" id="custom-model-item" style="display: none;">
                        <label>自定义模型</label>
                        <input type="text" id="custom-openai-model" placeholder="gpt-4.1" value="">
                    </div>
                    <div class="${styles.formItem}">
                        <label>API密钥</label>
                        <div class="${styles.inputGroup}">
                            <input type="password" id="api-key" placeholder="请输入API密钥" value="">
                            <button id="toggle-password" title="显示/隐藏密码">👁️</button>
                        </div>
                        <div class="${styles.apiKeyHelp}">
                            <p>API密钥格式说明：</p>
                            <ul>
                                <li>Moonshot: 以 sk- 开头</li>
                                <li>Deepseek: 以 sk- 开头</li>
                                <li>ChatGPT: 以 sk- 开头</li>
                                <li>自定义OpenAI: 以 sk- 开头</li>
                            </ul>
                        </div>
                    </div>
                    <div class="${styles.btnContainer}">
                        <button class="${styles.btn} ${styles.btnPrimary}" id="test-api">测试连接</button>
                        <button class="${styles.btn} ${styles.btnPrimary}" id="save-api">保存配置</button>
                        <button class="${styles.btn} ${styles.btnDefault}" id="close-panel">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        return panel;
    }

    private initEvents(): void {
        // 初始化当前选中的API类型和对应的密钥
        const apiTypeSelect = document.getElementById('api-type') as HTMLSelectElement;
        const apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
        const customUrlInput = document.getElementById('custom-openai-url') as HTMLInputElement;
        
        apiTypeSelect.value = this.currentConfig.apiType;
        apiKeyInput.value = this.currentConfig.apiKeys[this.currentConfig.apiType] || '';
        customUrlInput.value = this.currentConfig.customOpenAIUrl || '';
        
        // 初始化自定义URL输入框的显示状态
        this.toggleCustomUrlInput(this.currentConfig.apiType);

        // 关闭按钮事件
        this.panel.querySelector(`.${styles.closeBtn}`)?.addEventListener('click', () => {
            this.hide();
        });

        // 关闭面板按钮事件
        document.getElementById('close-panel')?.addEventListener('click', () => {
            this.hide();
        });

        // 切换密码显示状态
        document.getElementById('toggle-password')?.addEventListener('click', (event) => {
            const button = event.target as HTMLButtonElement;
            const input = document.getElementById('api-key') as HTMLInputElement;
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = '🔒';
            } else {
                input.type = 'password';
                button.textContent = '👁️';
            }
        });

        // 切换标签页
        this.panel.querySelectorAll(`.${styles.tab}`).forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有标签页的active类
                this.panel.querySelectorAll(`.${styles.tab}`).forEach(t => 
                    t.classList.remove(styles.active)
                );
                
                // 移除所有内容区的active类
                this.panel.querySelectorAll(`.${styles.tabContent}`).forEach(c => 
                    c.classList.remove(styles.active)
                );
                
                // 添加当前标签页的active类
                tab.classList.add(styles.active);
                
                // 添加对应内容区的active类
                const tabId = (tab as HTMLElement).dataset.tab;
                document.getElementById(`${tabId}-tab`)?.classList.add(styles.active);
            });
        });

        // API类型切换时加载对应的API密钥
        document.getElementById('api-type')?.addEventListener('change', (event) => {
            const apiType = (event.target as HTMLSelectElement).value as 'moonshot' | 'deepseek' | 'chatgpt' | 'custom-openai';
            const apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
            apiKeyInput.value = this.currentConfig.apiKeys[apiType] || '';
            this.validateApiKey(apiKeyInput.value, apiType);
            this.toggleCustomUrlInput(apiType);
        });

        // API密钥输入时实时验证
        document.getElementById('api-key')?.addEventListener('input', (event) => {
            const apiKey = (event.target as HTMLInputElement).value;
            const apiType = (document.getElementById('api-type') as HTMLSelectElement).value as 'moonshot' | 'deepseek' | 'chatgpt' | 'custom-openai';
            this.validateApiKey(apiKey, apiType);
        });

        // 测试API连接
        document.getElementById('test-api')?.addEventListener('click', async () => {
            const button = document.getElementById('test-api');
            if (!button) return;

            const apiKey = (document.getElementById('api-key') as HTMLInputElement).value;
            const apiType = (document.getElementById('api-type') as HTMLSelectElement).value as 'moonshot' | 'deepseek' | 'chatgpt' | 'custom-openai';
            const customUrl = (document.getElementById('custom-openai-url') as HTMLInputElement).value;

            if (!this.validateApiKey(apiKey, apiType)) {
                return;
            }

            if (apiType === 'custom-openai' && !customUrl.trim()) {
                alert('请输入自定义API地址');
                return;
            }

            try {
                (button as HTMLButtonElement).textContent = '测试中...';
                (button as HTMLButtonElement).disabled = true;

                const customModel = (document.getElementById('custom-openai-model') as HTMLInputElement).value;

                // 创建临时配置进行测试
                const testConfig: Config = {
                    ...this.currentConfig,
                    apiType,
                    apiKeys: {
                        ...this.currentConfig.apiKeys,
                        [apiType]: apiKey
                    },
                    customOpenAIUrl: apiType === 'custom-openai' ? customUrl : this.currentConfig.customOpenAIUrl,
                    customOpenAIModel: apiType === 'custom-openai' ? (customModel || 'gpt-4.1') : this.currentConfig.customOpenAIModel
                };
                
                // 临时保存配置用于测试
                saveConfig(testConfig);
                
                // 重置API提供者以使用新配置
                APIFactory.getInstance().resetProvider();
                
                const provider = APIFactory.getInstance().getProvider();
                const response = await provider.chat([
                    { role: 'user', content: '你好，这是一个测试消息。请回复"连接成功"。' }
                ]);

                if (response.data?.choices?.[0]?.message?.content.includes('连接成功')) {
                    alert('API连接测试成功！');
                } else {
                    alert('API连接测试失败：响应格式不正确');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                alert('API连接测试失败：' + errorMessage);
            } finally {
                (button as HTMLButtonElement).textContent = '测试连接';
                (button as HTMLButtonElement).disabled = false;
                
                // 恢复原始配置
                saveConfig(this.currentConfig);
                APIFactory.getInstance().resetProvider();
            }
        });

        // 保存API配置
        document.getElementById('save-api')?.addEventListener('click', () => {
            const apiKey = (document.getElementById('api-key') as HTMLInputElement).value;
            const apiType = (document.getElementById('api-type') as HTMLSelectElement).value as 'moonshot' | 'deepseek' | 'chatgpt' | 'custom-openai';
            const customUrl = (document.getElementById('custom-openai-url') as HTMLInputElement).value;

            if (!this.validateApiKey(apiKey, apiType)) {
                return;
            }

            if (apiType === 'custom-openai' && !customUrl.trim()) {
                alert('请输入自定义API地址');
                return;
            }

            const customModel = (document.getElementById('custom-openai-model') as HTMLInputElement).value;

            // 更新配置
            this.currentConfig = {
                ...this.currentConfig,
                apiType,
                apiKeys: {
                    ...this.currentConfig.apiKeys,
                    [apiType]: apiKey
                },
                customOpenAIUrl: apiType === 'custom-openai' ? customUrl : this.currentConfig.customOpenAIUrl,
                customOpenAIModel: apiType === 'custom-openai' ? (customModel || 'gpt-4.1') : this.currentConfig.customOpenAIModel
            };
            
            // 保存配置
            saveConfig(this.currentConfig);

            // 重置API提供者，这样下次使用时会使用新的配置
            APIFactory.getInstance().resetProvider();

            alert('配置已保存');
        });

        // 开始答题按钮事件
        document.getElementById('toggle-answer')?.addEventListener('click', async () => {
            const button = document.getElementById('toggle-answer');
            if (!button) return;

            if ((this.answerHandler as any).isProcessing) {
                this.answerHandler.stopAutoAnswer();
                button.textContent = '开始答题';
                button.classList.remove(styles.btnDanger);
                button.classList.add(styles.btnPrimary);
            } else {
                button.textContent = '停止答题';
                button.classList.remove(styles.btnPrimary);
                button.classList.add(styles.btnDanger);
                await this.answerHandler.startAutoAnswer();
                button.textContent = '开始答题';
                button.classList.remove(styles.btnDanger);
                button.classList.add(styles.btnPrimary);
            }
        });

        // 重新扫描按钮事件
        document.getElementById('scan-questions')?.addEventListener('click', async () => {
            await this.answerHandler.scanQuestions();
            const questions = await this.answerHandler.scanQuestions();
            this.updateQuestionGrid(questions);
        });
    }

    private toggleCustomUrlInput(apiType: string): void {
        const customUrlItem = document.getElementById('custom-url-item');
        const customModelItem = document.getElementById('custom-model-item');
        
        if (customUrlItem && customModelItem) {
            if (apiType === 'custom-openai') {
                customUrlItem.style.display = 'block';
                customModelItem.style.display = 'block';
            } else {
                customUrlItem.style.display = 'none';
                customModelItem.style.display = 'none';
            }
        }
    }

    private validateApiKey(apiKey: string, apiType: 'moonshot' | 'deepseek' | 'chatgpt' | 'custom-openai'): boolean {
        const input = document.getElementById('api-key') as HTMLInputElement;
        const saveButton = document.getElementById('save-api') as HTMLButtonElement;
        const testButton = document.getElementById('test-api') as HTMLButtonElement;

        // 如果为空，允许通过（因为可能是初始状态）
        if (!apiKey) {
            input.classList.remove(styles.error);
            saveButton.disabled = false;
            testButton.disabled = false;
            return true;
        }

        // 不能有空格
        if (apiKey.trim() !== apiKey) {
            input.classList.add(styles.error);
            alert('API密钥不能包含空格');
            return false;
        }

        input.classList.remove(styles.error);
        saveButton.disabled = false;
        testButton.disabled = false;
        return true;
    }

    public async show(): Promise<void> {
        this.panel.style.display = 'block';
        
        // 加载已保存的配置
        const config = getConfig();
        (document.getElementById('api-type') as HTMLSelectElement).value = config.apiType;
        (document.getElementById('api-key') as HTMLInputElement).value = config.apiKeys[config.apiType] || '';
        (document.getElementById('custom-openai-url') as HTMLInputElement).value = config.customOpenAIUrl || '';
        (document.getElementById('custom-openai-model') as HTMLInputElement).value = config.customOpenAIModel || '';
        
        // 显示/隐藏自定义URL和模型输入框
        this.toggleCustomUrlInput(config.apiType);
        
        // 只有当API key不为空时才验证
        if (config.apiKeys[config.apiType]) {
            this.validateApiKey(config.apiKeys[config.apiType] || '', config.apiType);
        }

        // 扫描并显示题目
        const questions = await this.answerHandler.scanQuestions();
        this.updateQuestionGrid(questions);

        // 添加选项点击的全局处理函数
        (window as any).selectOption = (questionIndex: number, optionLetter: string) => {
            (this.answerHandler as any).selectOption(questionIndex, optionLetter);
        };

        // 添加填空题输入框值更新的全局处理函数
        (window as any).updateBlankValue = (questionIndex: number, blankNumber: number, value: string) => {
            const question = this.answerHandler.getQuestions().find(q => q.index === questionIndex);
            if (question?.blanks) {
                const blank = question.blanks.find(b => b.number === blankNumber);
                if (blank) {
                    blank.element.value = value;
                    blank.element.dispatchEvent(new Event('input', { bubbles: true }));
                    blank.element.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        };
    }

    private updateQuestionGrid(questions: Question[]) {
        const grid = this.panel.querySelector(`.${styles.questionGrid}`);
        if (!grid) return;

        grid.innerHTML = '';
        questions.forEach((question) => {
            const box = document.createElement('div');
            box.className = `${styles.questionBox} ${question.answer ? styles.completed : ''}`;
            box.textContent = question.index.toString();
            box.onclick = () => this.showQuestionDetail(question);
            grid.appendChild(box);
        });
    }

    public hide(): void {
        this.panel.style.display = 'none';
    }

    private showQuestionDetail(question: Question): void {
        const detail = this.panel.querySelector(`.${styles.questionDetail}`);
        if (!detail) return;

        detail.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 12px; color: #303133;">题目内容：</h4>
                <p style="line-height: 1.6; color: #606266;">${question.content.split('\n').join('<br>')}</p>
            </div>
            ${question.options ? `
                <div class="options-section" style="margin: 20px 0;">
                    <h4 style="margin-bottom: 12px; color: #303133;">选项：</h4>
                    <ul style="list-style: none; padding-left: 0;">
                        ${question.options.map(option => {
                            // 判断题特殊处理
                            if (question.type === 'judgement') {
                                const isCorrectOption = option.startsWith('A');
                                return `
                                    <li style="margin: 12px 0; padding: 8px 12px; background: #f5f7fa; border-radius: 4px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center;" 
                                        onmouseover="this.style.background='#ecf5ff'" 
                                        onmouseout="this.style.background='#f5f7fa'"
                                        onclick="window.selectOption(${question.index}, '${option.charAt(0)}')"
                                    >
                                        <span style="font-weight: bold; margin-right: 10px;">${option.charAt(0)}.</span>
                                        <span>${isCorrectOption ? '正确' : '错误'}</span>
                                    </li>
                                `;
                            }
                            // 其他题型正常显示
                            return `
                                <li style="margin: 12px 0; padding: 8px 12px; background: #f5f7fa; border-radius: 4px; cursor: pointer; transition: all 0.3s;" 
                                    onmouseover="this.style.background='#ecf5ff'" 
                                    onmouseout="this.style.background='#f5f7fa'"
                                    onclick="window.selectOption(${question.index}, '${option.charAt(0)}')"
                                >${option}</li>
                            `;
                        }).join('')}
                    </ul>
                </div>
            ` : ''}
            ${question.answer ? `
                <div class="answer-section" style="margin-top: 20px;">
                    <h4 style="margin-bottom: 12px; color: #303133;">答案：</h4>
                    <p style="line-height: 1.6; color: #409EFF;">${question.answer}</p>
                </div>
            ` : ''}
        `;
    }
}