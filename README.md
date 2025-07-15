# OmniEdu自动答题助手

这是一个面向www.omniedu.com的，基于Tampermonkey的用户脚本，通过DOM解析的方式识别题目，然后通过ai接口来作答，支持多个AI模型（包括DeepSeek和Kimi）。



## 系统要求

- Node.js >= 20.0.0
- npm >= 9.0.0
- Tampermonkey浏览器插件



## 安装步骤

### 安装依赖：

```bash
npm install
```

### 编译

运行以下命令编译：

```bash
npm run dev
```

该命令会启动监听模式，当源文件发生变化时自动重新编译。编译后的文件将生成在`dist`目录下。



## 支持的AI模型

目前支持以下AI模型：

- DeepSeek
- Kimi
- chatgpt（TODO）



## 配置说明

1. 安装编译好的用户脚本到Tampermonkey
2. 在脚本设置面板中选择想要使用的模型并配置API密钥（点击保存配置后生效）
