declare module '*.svg' {
  const content: any
  export default content
}

// 油猴脚本API声明
declare function GM_getValue(key: string, defaultValue?: any): any;
declare function GM_setValue(key: string, value: any): void;
declare function GM_xmlhttpRequest(details: any): void;
declare function GM_addStyle(css: string): void;
declare const unsafeWindow: Window & typeof globalThis;
