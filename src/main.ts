import styles from './styles/auto-answer.module.css';
import {debug} from './utils/config';
import {ConfigPanel} from './components/ConfigPanel';

function init() {
    try {
        debug('开始初始化');

        // 创建配置按钮
        const configBtn = document.createElement('button');
        configBtn.className = styles.configBtn;
        configBtn.textContent = '⚙️';

        // 创建配置面板实例
        const configPanel = new ConfigPanel();

        // 点击配置按钮显示面板
        configBtn.onclick = () => {
            configPanel.show();
        };

        document.body.appendChild(configBtn);
        debug('初始化完成');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        debug('初始化失败: ' + errorMessage);
    }
}

// 等待页面加载完成后再初始化
if (document.readyState === 'loading') {
    debug('等待页面加载');
    document.addEventListener('DOMContentLoaded', init);
} else {
    debug('页面已加载，直接初始化');
    init();
}
