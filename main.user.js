
// ==UserScript==
// @name           OmniEdu自动答题助手
// @namespace      http://tampermonkey.net/
// @version        0.1
// @author         AI Assistant
// @description    OmniEdu在线教育平台自动答题助手，支持自动答题、自动提交等功能
// @include        https://www.omniedu.com/*
// @include        http://www.omniedu.com/*
// @match          https://www.omniedu.com/*
// @match          http://www.omniedu.com/*
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @run-at         document-end
// @connect        api.moonshot.cn
// @connect        api.deepseek.com
// @connect        api.openai.com
// @connect        *
// ==/UserScript==
(function () {
  'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".auto-answer-module_configBtn__ekKsq {\r\n    position: fixed;\r\n    bottom: 20px;\r\n    right: 20px;\r\n    z-index: 9999;\r\n    width: 40px;\r\n    height: 40px;\r\n    background: #409EFF;\r\n    color: white;\r\n    border: none;\r\n    border-radius: 50%;\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    font-size: 20px;\r\n    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);\r\n}\r\n\r\n.auto-answer-module_configBtn__ekKsq:hover {\r\n    background: #66b1ff;\r\n}\r\n\r\n.auto-answer-module_configPanel__xYuLC {\r\n    position: fixed;\r\n    top: 50%;\r\n    left: 50%;\r\n    transform: translate(-50%, -50%);\r\n    width: 800px;\r\n    background: white;\r\n    padding: 20px;\r\n    border-radius: 8px;\r\n    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);\r\n    z-index: 10000;\r\n    display: none;\r\n}\r\n\r\n.auto-answer-module_panelHeader__jv2gY {\r\n    position: relative;\r\n    margin: -20px -20px 0;\r\n    padding: 20px;\r\n}\r\n\r\n.auto-answer-module_closeBtn__umDtC {\r\n    position: absolute;\r\n    top: 20px;\r\n    right: 20px;\r\n    width: 24px;\r\n    height: 24px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    cursor: pointer;\r\n    color: #909399;\r\n    font-size: 24px;\r\n    transition: color 0.3s;\r\n    line-height: 1;\r\n}\r\n\r\n.auto-answer-module_closeBtn__umDtC:hover {\r\n    color: #F56C6C;\r\n}\r\n\r\n.auto-answer-module_tabContainer__XV7ti {\r\n    display: flex;\r\n    border-bottom: 1px solid #dcdfe6;\r\n    margin: 0 -20px 20px;\r\n    padding: 0 20px;\r\n}\r\n\r\n.auto-answer-module_tab__uWxgk {\r\n    padding: 10px 20px;\r\n    cursor: pointer;\r\n    color: #606266;\r\n    border-bottom: 2px solid transparent;\r\n}\r\n\r\n.auto-answer-module_tab__uWxgk.auto-answer-module_active__Sxlg2 {\r\n    color: #409EFF;\r\n    border-bottom-color: #409EFF;\r\n}\r\n\r\n.auto-answer-module_tabContent__rWL2T {\r\n    display: none;\r\n}\r\n\r\n.auto-answer-module_tabContent__rWL2T.auto-answer-module_active__Sxlg2 {\r\n    display: block;\r\n}\r\n\r\n.auto-answer-module_questionGrid__40f4P {\r\n    display: grid;\r\n    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));\r\n    gap: 8px;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.auto-answer-module_questionBox__w00xP {\r\n    aspect-ratio: 1;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    background: white;\r\n    border: 1px solid #dcdfe6;\r\n    border-radius: 4px;\r\n    cursor: pointer;\r\n    font-size: 12px;\r\n    color: #606266;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.auto-answer-module_questionBox__w00xP:hover {\r\n    transform: scale(1.1);\r\n    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);\r\n}\r\n\r\n.auto-answer-module_questionBox__w00xP.auto-answer-module_completed__AGqJ0 {\r\n    background: #409EFF;\r\n    color: white;\r\n    border-color: #409EFF;\r\n}\r\n\r\n.auto-answer-module_questionDetail__eozNS {\r\n    margin: 20px 0;\r\n    padding: 15px;\r\n    background: #f5f7fa;\r\n    border-radius: 4px;\r\n    min-height: 200px;\r\n}\r\n\r\n.auto-answer-module_apiConfig__KJaiR {\r\n    padding: 20px;\r\n}\r\n\r\n.auto-answer-module_formItem__rWVmg {\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.auto-answer-module_formItem__rWVmg label {\r\n    display: block;\r\n    margin-bottom: 8px;\r\n    color: #333;\r\n    font-weight: bold;\r\n}\r\n\r\n.auto-answer-module_formItem__rWVmg select,\r\n.auto-answer-module_formItem__rWVmg input {\r\n    width: 100%;\r\n    padding: 8px 12px;\r\n    border: 1px solid #dcdfe6;\r\n    border-radius: 4px;\r\n    font-size: 14px;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.auto-answer-module_formItem__rWVmg select:focus,\r\n.auto-answer-module_formItem__rWVmg input:focus {\r\n    outline: none;\r\n    border-color: #409eff;\r\n    box-shadow: 0 0 0 2px rgba(64,158,255,.2);\r\n}\r\n\r\n.auto-answer-module_inputGroup__Yu-vg {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n}\r\n\r\n.auto-answer-module_inputGroup__Yu-vg input {\r\n    flex: 1;\r\n}\r\n\r\n.auto-answer-module_inputGroup__Yu-vg button {\r\n    padding: 8px 12px;\r\n    border: 1px solid #dcdfe6;\r\n    border-radius: 4px;\r\n    background: #fff;\r\n    cursor: pointer;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.auto-answer-module_inputGroup__Yu-vg button:hover {\r\n    background: #f5f7fa;\r\n}\r\n\r\n.auto-answer-module_apiKeyHelp__rTXiJ {\r\n    margin-top: 8px;\r\n    padding: 12px;\r\n    background: #f8f9fa;\r\n    border-radius: 4px;\r\n    font-size: 12px;\r\n    color: #606266;\r\n}\r\n\r\n.auto-answer-module_apiKeyHelp__rTXiJ p {\r\n    margin: 0 0 8px 0;\r\n    font-weight: bold;\r\n}\r\n\r\n.auto-answer-module_apiKeyHelp__rTXiJ ul {\r\n    margin: 0;\r\n    padding-left: 20px;\r\n}\r\n\r\n.auto-answer-module_apiKeyHelp__rTXiJ li {\r\n    margin: 4px 0;\r\n}\r\n\r\n.auto-answer-module_btnContainer__4wLy8 {\r\n    display: flex;\r\n    gap: 12px;\r\n    margin-top: 20px;\r\n}\r\n\r\n.auto-answer-module_btn__yQl08 {\r\n    padding: 8px 16px;\r\n    border: none;\r\n    border-radius: 4px;\r\n    font-size: 14px;\r\n    cursor: pointer;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.auto-answer-module_btn__yQl08:disabled {\r\n    opacity: 0.6;\r\n    cursor: not-allowed;\r\n}\r\n\r\n.auto-answer-module_btnPrimary__ioplW {\r\n    background: #409eff;\r\n    color: white;\r\n}\r\n\r\n.auto-answer-module_btnPrimary__ioplW:hover:not(:disabled) {\r\n    background: #66b1ff;\r\n}\r\n\r\n.auto-answer-module_btnDefault__b5fLW {\r\n    background: #f4f4f5;\r\n    color: #606266;\r\n}\r\n\r\n.auto-answer-module_btnDefault__b5fLW:hover:not(:disabled) {\r\n    background: #e9e9eb;\r\n}\r\n\r\n.auto-answer-module_btnDanger__umKjg {\r\n    background: #f56c6c;\r\n    color: white;\r\n}\r\n\r\n.auto-answer-module_btnDanger__umKjg:hover:not(:disabled) {\r\n    background: #f78989;\r\n}\r\n\r\n.auto-answer-module_btnWarning__xRokW {\r\n    background-color: #e6a23c;\r\n    border-color: #e6a23c;\r\n    color: #fff;\r\n}\r\n\r\n.auto-answer-module_btnWarning__xRokW:hover {\r\n    background-color: #ebb563;\r\n    border-color: #ebb563;\r\n    color: #fff;\r\n}\r\n\r\n.auto-answer-module_btnInfo__7JFNj {\r\n    background-color: #409eff;\r\n    border-color: #409eff;\r\n    color: #fff;\r\n}\r\n\r\n.auto-answer-module_btnInfo__7JFNj:hover {\r\n    background-color: #66b1ff;\r\n    border-color: #66b1ff;\r\n    color: #fff;\r\n}\r\n\r\n.auto-answer-module_error__mVpGZ {\r\n    border-color: #f44336 !important;\r\n    background-color: #ffebee !important;\r\n}\r\n\r\n.auto-answer-module_error__mVpGZ:focus {\r\n    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;\r\n} ";
  var styles = {"configBtn":"auto-answer-module_configBtn__ekKsq","configPanel":"auto-answer-module_configPanel__xYuLC","panelHeader":"auto-answer-module_panelHeader__jv2gY","closeBtn":"auto-answer-module_closeBtn__umDtC","tabContainer":"auto-answer-module_tabContainer__XV7ti","tab":"auto-answer-module_tab__uWxgk","active":"auto-answer-module_active__Sxlg2","tabContent":"auto-answer-module_tabContent__rWL2T","questionGrid":"auto-answer-module_questionGrid__40f4P","questionBox":"auto-answer-module_questionBox__w00xP","completed":"auto-answer-module_completed__AGqJ0","questionDetail":"auto-answer-module_questionDetail__eozNS","apiConfig":"auto-answer-module_apiConfig__KJaiR","formItem":"auto-answer-module_formItem__rWVmg","inputGroup":"auto-answer-module_inputGroup__Yu-vg","apiKeyHelp":"auto-answer-module_apiKeyHelp__rTXiJ","btnContainer":"auto-answer-module_btnContainer__4wLy8","btn":"auto-answer-module_btn__yQl08","btnPrimary":"auto-answer-module_btnPrimary__ioplW","btnDefault":"auto-answer-module_btnDefault__b5fLW","btnDanger":"auto-answer-module_btnDanger__umKjg","btnWarning":"auto-answer-module_btnWarning__xRokW","btnInfo":"auto-answer-module_btnInfo__7JFNj","error":"auto-answer-module_error__mVpGZ"};
  styleInject(css_248z);

  const defaultConfig = {
    apiType: 'moonshot',
    apiKeys: {},
    customOpenAIUrl: 'https://new.ljcljc.cn/v1',
    customOpenAIModel: 'gpt-4.1',
    debugMode: true
  };
  function getConfig() {
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
  function saveConfig(config) {
    localStorage.setItem('auto-answer-config', JSON.stringify(config));
  }
  function debug(message) {
    const config = getConfig();
    if (config.debugMode) {
      console.log('[自动答题助手]', message);
    }
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global$c =
    // eslint-disable-next-line es/no-global-this -- safe
    check(typeof globalThis == 'object' && globalThis) ||
    check(typeof window == 'object' && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    check(typeof self == 'object' && self) ||
    check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () { return this; })() || Function('return this')();

  var objectGetOwnPropertyDescriptor = {};

  var fails$8 = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var fails$7 = fails$8;

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails$7(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var objectPropertyIsEnumerable = {};

  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$1(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;

  var createPropertyDescriptor$2 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString = {}.toString;

  var classofRaw$1 = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var fails$6 = fails$8;
  var classof$2 = classofRaw$1;

  var split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails$6(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classof$2(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible$2 = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings
  var IndexedObject = indexedObject;
  var requireObjectCoercible$1 = requireObjectCoercible$2;

  var toIndexedObject$3 = function (it) {
    return IndexedObject(requireObjectCoercible$1(it));
  };

  // `IsCallable` abstract operation
  // https://tc39.es/ecma262/#sec-iscallable
  var isCallable$d = function (argument) {
    return typeof argument === 'function';
  };

  var isCallable$c = isCallable$d;

  var isObject$5 = function (it) {
    return typeof it === 'object' ? it !== null : isCallable$c(it);
  };

  var global$b = global$c;
  var isCallable$b = isCallable$d;

  var aFunction = function (argument) {
    return isCallable$b(argument) ? argument : undefined;
  };

  var getBuiltIn$4 = function (namespace, method) {
    return arguments.length < 2 ? aFunction(global$b[namespace]) : global$b[namespace] && global$b[namespace][method];
  };

  var getBuiltIn$3 = getBuiltIn$4;

  var engineUserAgent = getBuiltIn$3('navigator', 'userAgent') || '';

  var global$a = global$c;
  var userAgent = engineUserAgent;

  var process = global$a.process;
  var Deno = global$a.Deno;
  var versions = process && process.versions || Deno && Deno.version;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    version = match[0] < 4 ? 1 : match[0] + match[1];
  } else if (userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) version = match[1];
    }
  }

  var engineV8Version = version && +version;

  /* eslint-disable es/no-symbol -- required for testing */

  var V8_VERSION = engineV8Version;
  var fails$5 = fails$8;

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$5(function () {
    var symbol = Symbol();
    // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
    return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
      // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
      !Symbol.sham && V8_VERSION && V8_VERSION < 41;
  });

  /* eslint-disable es/no-symbol -- required for testing */

  var NATIVE_SYMBOL$1 = nativeSymbol;

  var useSymbolAsUid = NATIVE_SYMBOL$1
    && !Symbol.sham
    && typeof Symbol.iterator == 'symbol';

  var isCallable$a = isCallable$d;
  var getBuiltIn$2 = getBuiltIn$4;
  var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

  var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    var $Symbol = getBuiltIn$2('Symbol');
    return isCallable$a($Symbol) && Object(it) instanceof $Symbol;
  };

  var tryToString$1 = function (argument) {
    try {
      return String(argument);
    } catch (error) {
      return 'Object';
    }
  };

  var isCallable$9 = isCallable$d;
  var tryToString = tryToString$1;

  // `Assert: IsCallable(argument) is true`
  var aCallable$9 = function (argument) {
    if (isCallable$9(argument)) return argument;
    throw TypeError(tryToString(argument) + ' is not a function');
  };

  var aCallable$8 = aCallable$9;

  // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod
  var getMethod$4 = function (V, P) {
    var func = V[P];
    return func == null ? undefined : aCallable$8(func);
  };

  var isCallable$8 = isCallable$d;
  var isObject$4 = isObject$5;

  // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive
  var ordinaryToPrimitive$1 = function (input, pref) {
    var fn, val;
    if (pref === 'string' && isCallable$8(fn = input.toString) && !isObject$4(val = fn.call(input))) return val;
    if (isCallable$8(fn = input.valueOf) && !isObject$4(val = fn.call(input))) return val;
    if (pref !== 'string' && isCallable$8(fn = input.toString) && !isObject$4(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var shared$3 = {exports: {}};

  var global$9 = global$c;

  var setGlobal$3 = function (key, value) {
    try {
      // eslint-disable-next-line es/no-object-defineproperty -- safe
      Object.defineProperty(global$9, key, { value: value, configurable: true, writable: true });
    } catch (error) {
      global$9[key] = value;
    } return value;
  };

  var global$8 = global$c;
  var setGlobal$2 = setGlobal$3;

  var SHARED = '__core-js_shared__';
  var store$3 = global$8[SHARED] || setGlobal$2(SHARED, {});

  var sharedStore = store$3;

  var store$2 = sharedStore;

  (shared$3.exports = function (key, value) {
    return store$2[key] || (store$2[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.18.3',
    mode: 'global',
    copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
  });

  var requireObjectCoercible = requireObjectCoercible$2;

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject$2 = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var toObject$1 = toObject$2;

  var hasOwnProperty = {}.hasOwnProperty;

  // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty
  var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty.call(toObject$1(it), key);
  };

  var id = 0;
  var postfix = Math.random();

  var uid$2 = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var global$7 = global$c;
  var shared$2 = shared$3.exports;
  var hasOwn$8 = hasOwnProperty_1;
  var uid$1 = uid$2;
  var NATIVE_SYMBOL = nativeSymbol;
  var USE_SYMBOL_AS_UID = useSymbolAsUid;

  var WellKnownSymbolsStore = shared$2('wks');
  var Symbol$1 = global$7.Symbol;
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

  var wellKnownSymbol$8 = function (name) {
    if (!hasOwn$8(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
      if (NATIVE_SYMBOL && hasOwn$8(Symbol$1, name)) {
        WellKnownSymbolsStore[name] = Symbol$1[name];
      } else {
        WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
      }
    } return WellKnownSymbolsStore[name];
  };

  var isObject$3 = isObject$5;
  var isSymbol$1 = isSymbol$2;
  var getMethod$3 = getMethod$4;
  var ordinaryToPrimitive = ordinaryToPrimitive$1;
  var wellKnownSymbol$7 = wellKnownSymbol$8;

  var TO_PRIMITIVE = wellKnownSymbol$7('toPrimitive');

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  var toPrimitive$1 = function (input, pref) {
    if (!isObject$3(input) || isSymbol$1(input)) return input;
    var exoticToPrim = getMethod$3(input, TO_PRIMITIVE);
    var result;
    if (exoticToPrim) {
      if (pref === undefined) pref = 'default';
      result = exoticToPrim.call(input, pref);
      if (!isObject$3(result) || isSymbol$1(result)) return result;
      throw TypeError("Can't convert object to primitive value");
    }
    if (pref === undefined) pref = 'number';
    return ordinaryToPrimitive(input, pref);
  };

  var toPrimitive = toPrimitive$1;
  var isSymbol = isSymbol$2;

  // `ToPropertyKey` abstract operation
  // https://tc39.es/ecma262/#sec-topropertykey
  var toPropertyKey$2 = function (argument) {
    var key = toPrimitive(argument, 'string');
    return isSymbol(key) ? key : String(key);
  };

  var global$6 = global$c;
  var isObject$2 = isObject$5;

  var document$1 = global$6.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS$1 = isObject$2(document$1) && isObject$2(document$1.createElement);

  var documentCreateElement$1 = function (it) {
    return EXISTS$1 ? document$1.createElement(it) : {};
  };

  var DESCRIPTORS$5 = descriptors;
  var fails$4 = fails$8;
  var createElement = documentCreateElement$1;

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !DESCRIPTORS$5 && !fails$4(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
    return Object.defineProperty(createElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var DESCRIPTORS$4 = descriptors;
  var propertyIsEnumerableModule = objectPropertyIsEnumerable;
  var createPropertyDescriptor$1 = createPropertyDescriptor$2;
  var toIndexedObject$2 = toIndexedObject$3;
  var toPropertyKey$1 = toPropertyKey$2;
  var hasOwn$7 = hasOwnProperty_1;
  var IE8_DOM_DEFINE$1 = ie8DomDefine;

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  objectGetOwnPropertyDescriptor.f = DESCRIPTORS$4 ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$2(O);
    P = toPropertyKey$1(P);
    if (IE8_DOM_DEFINE$1) try {
      return $getOwnPropertyDescriptor(O, P);
    } catch (error) { /* empty */ }
    if (hasOwn$7(O, P)) return createPropertyDescriptor$1(!propertyIsEnumerableModule.f.call(O, P), O[P]);
  };

  var objectDefineProperty = {};

  var isObject$1 = isObject$5;

  // `Assert: Type(argument) is Object`
  var anObject$f = function (argument) {
    if (isObject$1(argument)) return argument;
    throw TypeError(String(argument) + ' is not an object');
  };

  var DESCRIPTORS$3 = descriptors;
  var IE8_DOM_DEFINE = ie8DomDefine;
  var anObject$e = anObject$f;
  var toPropertyKey = toPropertyKey$2;

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  objectDefineProperty.f = DESCRIPTORS$3 ? $defineProperty : function defineProperty(O, P, Attributes) {
    anObject$e(O);
    P = toPropertyKey(P);
    anObject$e(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var DESCRIPTORS$2 = descriptors;
  var definePropertyModule$2 = objectDefineProperty;
  var createPropertyDescriptor = createPropertyDescriptor$2;

  var createNonEnumerableProperty$5 = DESCRIPTORS$2 ? function (object, key, value) {
    return definePropertyModule$2.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var redefine$3 = {exports: {}};

  var isCallable$7 = isCallable$d;
  var store$1 = sharedStore;

  var functionToString = Function.toString;

  // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
  if (!isCallable$7(store$1.inspectSource)) {
    store$1.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  var inspectSource$2 = store$1.inspectSource;

  var global$5 = global$c;
  var isCallable$6 = isCallable$d;
  var inspectSource$1 = inspectSource$2;

  var WeakMap$1 = global$5.WeakMap;

  var nativeWeakMap = isCallable$6(WeakMap$1) && /native code/.test(inspectSource$1(WeakMap$1));

  var shared$1 = shared$3.exports;
  var uid = uid$2;

  var keys = shared$1('keys');

  var sharedKey$3 = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys$4 = {};

  var NATIVE_WEAK_MAP = nativeWeakMap;
  var global$4 = global$c;
  var isObject = isObject$5;
  var createNonEnumerableProperty$4 = createNonEnumerableProperty$5;
  var hasOwn$6 = hasOwnProperty_1;
  var shared = sharedStore;
  var sharedKey$2 = sharedKey$3;
  var hiddenKeys$3 = hiddenKeys$4;

  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var WeakMap = global$4.WeakMap;
  var set, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (NATIVE_WEAK_MAP || shared.state) {
    var store = shared.state || (shared.state = new WeakMap());
    var wmget = store.get;
    var wmhas = store.has;
    var wmset = store.set;
    set = function (it, metadata) {
      if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      wmset.call(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store, it) || {};
    };
    has = function (it) {
      return wmhas.call(store, it);
    };
  } else {
    var STATE = sharedKey$2('state');
    hiddenKeys$3[STATE] = true;
    set = function (it, metadata) {
      if (hasOwn$6(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty$4(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return hasOwn$6(it, STATE) ? it[STATE] : {};
    };
    has = function (it) {
      return hasOwn$6(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var DESCRIPTORS$1 = descriptors;
  var hasOwn$5 = hasOwnProperty_1;

  var FunctionPrototype = Function.prototype;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getDescriptor = DESCRIPTORS$1 && Object.getOwnPropertyDescriptor;

  var EXISTS = hasOwn$5(FunctionPrototype, 'name');
  // additional protection from minified / mangled / dropped function names
  var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
  var CONFIGURABLE = EXISTS && (!DESCRIPTORS$1 || (DESCRIPTORS$1 && getDescriptor(FunctionPrototype, 'name').configurable));

  var functionName = {
    EXISTS: EXISTS,
    PROPER: PROPER,
    CONFIGURABLE: CONFIGURABLE
  };

  var global$3 = global$c;
  var isCallable$5 = isCallable$d;
  var hasOwn$4 = hasOwnProperty_1;
  var createNonEnumerableProperty$3 = createNonEnumerableProperty$5;
  var setGlobal$1 = setGlobal$3;
  var inspectSource = inspectSource$2;
  var InternalStateModule$1 = internalState;
  var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

  var getInternalState$1 = InternalStateModule$1.get;
  var enforceInternalState = InternalStateModule$1.enforce;
  var TEMPLATE = String(String).split('String');

  (redefine$3.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    var name = options && options.name !== undefined ? options.name : key;
    var state;
    if (isCallable$5(value)) {
      if (String(name).slice(0, 7) === 'Symbol(') {
        name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
      }
      if (!hasOwn$4(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
        createNonEnumerableProperty$3(value, 'name', name);
      }
      state = enforceInternalState(value);
      if (!state.source) {
        state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
      }
    }
    if (O === global$3) {
      if (simple) O[key] = value;
      else setGlobal$1(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else createNonEnumerableProperty$3(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return isCallable$5(this) && getInternalState$1(this).source || inspectSource(this);
  });

  var objectGetOwnPropertyNames = {};

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity
  var toIntegerOrInfinity$2 = function (argument) {
    var number = +argument;
    // eslint-disable-next-line no-self-compare -- safe
    return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
  };

  var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex$1 = function (index, length) {
    var integer = toIntegerOrInfinity$1(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  var toIntegerOrInfinity = toIntegerOrInfinity$2;

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength$1 = function (argument) {
    return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var toLength = toLength$1;

  // `LengthOfArrayLike` abstract operation
  // https://tc39.es/ecma262/#sec-lengthofarraylike
  var lengthOfArrayLike$2 = function (obj) {
    return toLength(obj.length);
  };

  var toIndexedObject$1 = toIndexedObject$3;
  var toAbsoluteIndex = toAbsoluteIndex$1;
  var lengthOfArrayLike$1 = lengthOfArrayLike$2;

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$1($this);
      var length = lengthOfArrayLike$1(O);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare -- NaN check
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };

  var hasOwn$3 = hasOwnProperty_1;
  var toIndexedObject = toIndexedObject$3;
  var indexOf = arrayIncludes.indexOf;
  var hiddenKeys$2 = hiddenKeys$4;

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !hasOwn$3(hiddenKeys$2, key) && hasOwn$3(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (hasOwn$3(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys$3 = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var internalObjectKeys$1 = objectKeysInternal;
  var enumBugKeys$2 = enumBugKeys$3;

  var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  // eslint-disable-next-line es/no-object-getownpropertynames -- safe
  objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return internalObjectKeys$1(O, hiddenKeys$1);
  };

  var objectGetOwnPropertySymbols = {};

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

  var getBuiltIn$1 = getBuiltIn$4;
  var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
  var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
  var anObject$d = anObject$f;

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = getOwnPropertyNamesModule.f(anObject$d(it));
    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var hasOwn$2 = hasOwnProperty_1;
  var ownKeys = ownKeys$1;
  var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
  var definePropertyModule$1 = objectDefineProperty;

  var copyConstructorProperties$1 = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = definePropertyModule$1.f;
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!hasOwn$2(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var fails$3 = fails$8;
  var isCallable$4 = isCallable$d;

  var replacement = /#|\.prototype\./;

  var isForced$1 = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : isCallable$4(detection) ? fails$3(detection)
      : !!detection;
  };

  var normalize = isForced$1.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced$1.data = {};
  var NATIVE = isForced$1.NATIVE = 'N';
  var POLYFILL = isForced$1.POLYFILL = 'P';

  var isForced_1 = isForced$1;

  var global$2 = global$c;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var createNonEnumerableProperty$2 = createNonEnumerableProperty$5;
  var redefine$2 = redefine$3.exports;
  var setGlobal = setGlobal$3;
  var copyConstructorProperties = copyConstructorProperties$1;
  var isForced = isForced_1;

  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
    options.name        - the .name of the function if it does not match the key
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global$2;
    } else if (STATIC) {
      target = global$2[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global$2[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty$2(sourceProperty, 'sham', true);
      }
      // extend global
      redefine$2(target, key, sourceProperty, options);
    }
  };

  var anInstance$1 = function (it, Constructor, name) {
    if (it instanceof Constructor) return it;
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  };

  var internalObjectKeys = objectKeysInternal;
  var enumBugKeys$1 = enumBugKeys$3;

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe
  var objectKeys$1 = Object.keys || function keys(O) {
    return internalObjectKeys(O, enumBugKeys$1);
  };

  var DESCRIPTORS = descriptors;
  var definePropertyModule = objectDefineProperty;
  var anObject$c = anObject$f;
  var objectKeys = objectKeys$1;

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe
  var objectDefineProperties = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$c(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
    return O;
  };

  var getBuiltIn = getBuiltIn$4;

  var html$1 = getBuiltIn('document', 'documentElement');

  /* global ActiveXObject -- old IE, WSH */

  var anObject$b = anObject$f;
  var defineProperties = objectDefineProperties;
  var enumBugKeys = enumBugKeys$3;
  var hiddenKeys = hiddenKeys$4;
  var html = html$1;
  var documentCreateElement = documentCreateElement$1;
  var sharedKey$1 = sharedKey$3;

  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO$1 = sharedKey$1('IE_PROTO');

  var EmptyConstructor = function () { /* empty */ };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var NullProtoObject = function () {
    try {
      activeXDocument = new ActiveXObject('htmlfile');
    } catch (error) { /* ignore */ }
    NullProtoObject = typeof document != 'undefined'
      ? document.domain && activeXDocument
        ? NullProtoObjectViaActiveX(activeXDocument) // old IE
        : NullProtoObjectViaIFrame()
      : NullProtoObjectViaActiveX(activeXDocument); // WSH
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys[IE_PROTO$1] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject$b(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : defineProperties(result, Properties);
  };

  var fails$2 = fails$8;

  var correctPrototypeGetter = !fails$2(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var hasOwn$1 = hasOwnProperty_1;
  var isCallable$3 = isCallable$d;
  var toObject = toObject$2;
  var sharedKey = sharedKey$3;
  var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

  var IE_PROTO = sharedKey('IE_PROTO');
  var ObjectPrototype = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  // eslint-disable-next-line es/no-object-getprototypeof -- safe
  var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
    var object = toObject(O);
    if (hasOwn$1(object, IE_PROTO)) return object[IE_PROTO];
    var constructor = object.constructor;
    if (isCallable$3(constructor) && object instanceof constructor) {
      return constructor.prototype;
    } return object instanceof Object ? ObjectPrototype : null;
  };

  var fails$1 = fails$8;
  var isCallable$2 = isCallable$d;
  var getPrototypeOf = objectGetPrototypeOf;
  var redefine$1 = redefine$3.exports;
  var wellKnownSymbol$6 = wellKnownSymbol$8;

  var ITERATOR$2 = wellKnownSymbol$6('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  // `%IteratorPrototype%` object
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

  /* eslint-disable es/no-array-prototype-keys -- safe */
  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
    }
  }

  var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$1(function () {
    var test = {};
    // FF44- legacy iterators case
    return IteratorPrototype$2[ITERATOR$2].call(test) !== test;
  });

  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

  // `%IteratorPrototype%[@@iterator]()` method
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
  if (!isCallable$2(IteratorPrototype$2[ITERATOR$2])) {
    redefine$1(IteratorPrototype$2, ITERATOR$2, function () {
      return this;
    });
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype$2,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  // https://github.com/tc39/proposal-iterator-helpers
  var $$6 = _export;
  var global$1 = global$c;
  var anInstance = anInstance$1;
  var isCallable$1 = isCallable$d;
  var createNonEnumerableProperty$1 = createNonEnumerableProperty$5;
  var fails = fails$8;
  var hasOwn = hasOwnProperty_1;
  var wellKnownSymbol$5 = wellKnownSymbol$8;
  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

  var TO_STRING_TAG$3 = wellKnownSymbol$5('toStringTag');

  var NativeIterator = global$1.Iterator;

  // FF56- have non-standard global helper `Iterator`
  var FORCED = !isCallable$1(NativeIterator)
    || NativeIterator.prototype !== IteratorPrototype$1
    // FF44- non-standard `Iterator` passes previous tests
    || !fails(function () { NativeIterator({}); });

  var IteratorConstructor = function Iterator() {
    anInstance(this, IteratorConstructor);
  };

  if (!hasOwn(IteratorPrototype$1, TO_STRING_TAG$3)) {
    createNonEnumerableProperty$1(IteratorPrototype$1, TO_STRING_TAG$3, 'Iterator');
  }

  if (FORCED || !hasOwn(IteratorPrototype$1, 'constructor') || IteratorPrototype$1.constructor === Object) {
    createNonEnumerableProperty$1(IteratorPrototype$1, 'constructor', IteratorConstructor);
  }

  IteratorConstructor.prototype = IteratorPrototype$1;

  $$6({ global: true, forced: FORCED }, {
    Iterator: IteratorConstructor
  });

  var iterators = {};

  var wellKnownSymbol$4 = wellKnownSymbol$8;
  var Iterators$1 = iterators;

  var ITERATOR$1 = wellKnownSymbol$4('iterator');
  var ArrayPrototype = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod$1 = function (it) {
    return it !== undefined && (Iterators$1.Array === it || ArrayPrototype[ITERATOR$1] === it);
  };

  var aCallable$7 = aCallable$9;

  // optional / simple context binding
  var functionBindContext = function (fn, that, length) {
    aCallable$7(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var wellKnownSymbol$3 = wellKnownSymbol$8;

  var TO_STRING_TAG$2 = wellKnownSymbol$3('toStringTag');
  var test = {};

  test[TO_STRING_TAG$2] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG_SUPPORT = toStringTagSupport;
  var isCallable = isCallable$d;
  var classofRaw = classofRaw$1;
  var wellKnownSymbol$2 = wellKnownSymbol$8;

  var TO_STRING_TAG$1 = wellKnownSymbol$2('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof$1 = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
  };

  var classof = classof$1;
  var getMethod$2 = getMethod$4;
  var Iterators = iterators;
  var wellKnownSymbol$1 = wellKnownSymbol$8;

  var ITERATOR = wellKnownSymbol$1('iterator');

  var getIteratorMethod$2 = function (it) {
    if (it != undefined) return getMethod$2(it, ITERATOR)
      || getMethod$2(it, '@@iterator')
      || Iterators[classof(it)];
  };

  var aCallable$6 = aCallable$9;
  var anObject$a = anObject$f;
  var getIteratorMethod$1 = getIteratorMethod$2;

  var getIterator$1 = function (argument, usingIterator) {
    var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
    if (aCallable$6(iteratorMethod)) return anObject$a(iteratorMethod.call(argument));
    throw TypeError(String(argument) + ' is not iterable');
  };

  var anObject$9 = anObject$f;
  var getMethod$1 = getMethod$4;

  var iteratorClose$2 = function (iterator, kind, value) {
    var innerResult, innerError;
    anObject$9(iterator);
    try {
      innerResult = getMethod$1(iterator, 'return');
      if (!innerResult) {
        if (kind === 'throw') throw value;
        return value;
      }
      innerResult = innerResult.call(iterator);
    } catch (error) {
      innerError = true;
      innerResult = error;
    }
    if (kind === 'throw') throw value;
    if (innerError) throw innerResult;
    anObject$9(innerResult);
    return value;
  };

  var anObject$8 = anObject$f;
  var isArrayIteratorMethod = isArrayIteratorMethod$1;
  var lengthOfArrayLike = lengthOfArrayLike$2;
  var bind = functionBindContext;
  var getIterator = getIterator$1;
  var getIteratorMethod = getIteratorMethod$2;
  var iteratorClose$1 = iteratorClose$2;

  var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  var iterate$4 = function (iterable, unboundFunction, options) {
    var that = options && options.that;
    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
    var INTERRUPTED = !!(options && options.INTERRUPTED);
    var fn = bind(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
    var iterator, iterFn, index, length, result, next, step;

    var stop = function (condition) {
      if (iterator) iteratorClose$1(iterator, 'normal', condition);
      return new Result(true, condition);
    };

    var callFn = function (value) {
      if (AS_ENTRIES) {
        anObject$8(value);
        return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
      } return INTERRUPTED ? fn(value, stop) : fn(value);
    };

    if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (!iterFn) throw TypeError(String(iterable) + ' is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
          result = callFn(iterable[index]);
          if (result && result instanceof Result) return result;
        } return new Result(false);
      }
      iterator = getIterator(iterable, iterFn);
    }

    next = iterator.next;
    while (!(step = next.call(iterator)).done) {
      try {
        result = callFn(step.value);
      } catch (error) {
        iteratorClose$1(iterator, 'throw', error);
      }
      if (typeof result == 'object' && result && result instanceof Result) return result;
    } return new Result(false);
  };

  // https://github.com/tc39/proposal-iterator-helpers
  var $$5 = _export;
  var iterate$3 = iterate$4;
  var aCallable$5 = aCallable$9;
  var anObject$7 = anObject$f;

  $$5({ target: 'Iterator', proto: true, real: true }, {
    find: function find(fn) {
      anObject$7(this);
      aCallable$5(fn);
      return iterate$3(this, function (value, stop) {
        if (fn(value)) return stop(value);
      }, { IS_ITERATOR: true, INTERRUPTED: true }).result;
    }
  });

  // https://github.com/tc39/proposal-iterator-helpers
  var $$4 = _export;
  var iterate$2 = iterate$4;
  var anObject$6 = anObject$f;

  $$4({ target: 'Iterator', proto: true, real: true }, {
    forEach: function forEach(fn) {
      iterate$2(anObject$6(this), fn, { IS_ITERATOR: true });
    }
  });

  var redefine = redefine$3.exports;

  var redefineAll$1 = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var aCallable$4 = aCallable$9;
  var anObject$5 = anObject$f;
  var create = objectCreate;
  var createNonEnumerableProperty = createNonEnumerableProperty$5;
  var redefineAll = redefineAll$1;
  var wellKnownSymbol = wellKnownSymbol$8;
  var InternalStateModule = internalState;
  var getMethod = getMethod$4;
  var IteratorPrototype = iteratorsCore.IteratorPrototype;

  var setInternalState = InternalStateModule.set;
  var getInternalState = InternalStateModule.get;

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');

  var iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
    var IteratorProxy = function Iterator(state) {
      state.next = aCallable$4(state.iterator.next);
      state.done = false;
      state.ignoreArg = !IS_ITERATOR;
      setInternalState(this, state);
    };

    IteratorProxy.prototype = redefineAll(create(IteratorPrototype), {
      next: function next(arg) {
        var state = getInternalState(this);
        var args = arguments.length ? [state.ignoreArg ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
        state.ignoreArg = false;
        var result = state.done ? undefined : nextHandler.call(state, args);
        return { done: state.done, value: result };
      },
      'return': function (value) {
        var state = getInternalState(this);
        var iterator = state.iterator;
        state.done = true;
        var $$return = getMethod(iterator, 'return');
        return { done: true, value: $$return ? anObject$5($$return.call(iterator, value)).value : value };
      },
      'throw': function (value) {
        var state = getInternalState(this);
        var iterator = state.iterator;
        state.done = true;
        var $$throw = getMethod(iterator, 'throw');
        if ($$throw) return $$throw.call(iterator, value);
        throw value;
      }
    });

    if (!IS_ITERATOR) {
      createNonEnumerableProperty(IteratorProxy.prototype, TO_STRING_TAG, 'Generator');
    }

    return IteratorProxy;
  };

  var anObject$4 = anObject$f;
  var iteratorClose = iteratorClose$2;

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing$2 = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject$4(value)[0], value[1]) : fn(value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
  };

  // https://github.com/tc39/proposal-iterator-helpers
  var $$3 = _export;
  var aCallable$3 = aCallable$9;
  var anObject$3 = anObject$f;
  var createIteratorProxy$1 = iteratorCreateProxy;
  var callWithSafeIterationClosing$1 = callWithSafeIterationClosing$2;

  var IteratorProxy$1 = createIteratorProxy$1(function (args) {
    var iterator = this.iterator;
    var result = anObject$3(this.next.apply(iterator, args));
    var done = this.done = !!result.done;
    if (!done) return callWithSafeIterationClosing$1(iterator, this.mapper, result.value);
  });

  $$3({ target: 'Iterator', proto: true, real: true }, {
    map: function map(mapper) {
      return new IteratorProxy$1({
        iterator: anObject$3(this),
        mapper: aCallable$3(mapper)
      });
    }
  });

  // https://github.com/tc39/proposal-iterator-helpers
  var $$2 = _export;
  var aCallable$2 = aCallable$9;
  var anObject$2 = anObject$f;
  var createIteratorProxy = iteratorCreateProxy;
  var callWithSafeIterationClosing = callWithSafeIterationClosing$2;

  var IteratorProxy = createIteratorProxy(function (args) {
    var iterator = this.iterator;
    var filterer = this.filterer;
    var next = this.next;
    var result, done, value;
    while (true) {
      result = anObject$2(next.apply(iterator, args));
      done = this.done = !!result.done;
      if (done) return;
      value = result.value;
      if (callWithSafeIterationClosing(iterator, filterer, value)) return value;
    }
  });

  $$2({ target: 'Iterator', proto: true, real: true }, {
    filter: function filter(filterer) {
      return new IteratorProxy({
        iterator: anObject$2(this),
        filterer: aCallable$2(filterer)
      });
    }
  });

  // https://github.com/tc39/proposal-iterator-helpers
  var $$1 = _export;
  var iterate$1 = iterate$4;
  var aCallable$1 = aCallable$9;
  var anObject$1 = anObject$f;

  $$1({ target: 'Iterator', proto: true, real: true }, {
    some: function some(fn) {
      anObject$1(this);
      aCallable$1(fn);
      return iterate$1(this, function (value, stop) {
        if (fn(value)) return stop();
      }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
    }
  });

  // https://github.com/tc39/proposal-iterator-helpers
  var $ = _export;
  var iterate = iterate$4;
  var aCallable = aCallable$9;
  var anObject = anObject$f;

  $({ target: 'Iterator', proto: true, real: true }, {
    reduce: function reduce(reducer /* , initialValue */) {
      anObject(this);
      aCallable(reducer);
      var noInitial = arguments.length < 2;
      var accumulator = noInitial ? undefined : arguments[1];
      iterate(this, function (value) {
        if (noInitial) {
          noInitial = false;
          accumulator = value;
        } else {
          accumulator = reducer(accumulator, value);
        }
      }, { IS_ITERATOR: true });
      if (noInitial) throw TypeError('Reduce of empty iterator with no initial value');
      return accumulator;
    }
  });

  class PromptGenerator {
    static formatQuestions(questions) {
      return questions.map(q => {
        let questionText = `${q.index}. ${q.content}`;
        if (q.options) {
          questionText += '\n' + q.options.map(opt => `   ${opt}`).join('\n');
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
    static getQuestionTypeInstructions() {
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
    static getTypeTitle(type) {
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
    static generatePrompt(questions) {
      const questionsByType = questions.reduce((acc, q) => {
        if (!acc[q.type]) {
          acc[q.type] = [];
        }
        acc[q.type].push(q);
        return acc;
      }, {});
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

  class EventEmitter {
    constructor() {
      this.events = new Map();
    }
    on(event, callback) {
      if (!this.events.has(event)) {
        this.events.set(event, []);
      }
      this.events.get(event).push(callback);
    }
    off(event, callback) {
      if (!this.events.has(event)) return;
      const callbacks = this.events.get(event);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.events.delete(event);
      }
    }
    emit(event, ...args) {
      if (!this.events.has(event)) return;
      this.events.get(event).forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event ${event} callback:`, error);
        }
      });
    }
  }

  class BaseAPIProvider extends EventEmitter {
    constructor(config) {
      super();
      this.apiKey = config.apiKey;
      this.baseURL = config.baseURL || this.getDefaultBaseURL();
    }
    async customFetch(endpoint, options) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: options.method,
          url: `${this.baseURL}${endpoint}`,
          headers: options.headers,
          data: options.body ? JSON.stringify(options.body) : undefined,
          responseType: 'json',
          onload: function (response) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response.response);
            } else {
              reject(new Error(`HTTP Error: ${response.status} ${response.statusText}`));
            }
          },
          onerror: function (error) {
            reject(new Error('Network Error: ' + error.error));
          }
        });
      });
    }
    async chat(messages) {
      try {
        const config = this.getConfig();
        const response = await this.customFetch('/chat/completions', {
          method: 'POST',
          headers: this.getDefaultHeaders(),
          body: {
            model: config.model.chat,
            messages: [{
              role: 'system',
              content: config.systemPrompt || '你是一位严谨的软件工程师，碰到问题会认真思考，请严格按照指定格式回答题目。'
            }, ...messages],
            temperature: 0.3
          }
        });
        return {
          code: 200,
          message: 'success',
          data: response
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`API Error: ${errorMessage}`);
      }
    }
    async embeddings(input) {
      try {
        const config = this.getConfig();
        if (!config.model.embedding) {
          throw new Error('Embeddings not supported by this provider');
        }
        const response = await this.customFetch('/embeddings', {
          method: 'POST',
          headers: this.getDefaultHeaders(),
          body: {
            model: config.model.embedding,
            input: Array.isArray(input) ? input : [input]
          }
        });
        return {
          code: 200,
          message: 'success',
          data: response
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`API Error: ${errorMessage}`);
      }
    }
  }

  class MoonshotAPIProvider extends BaseAPIProvider {
    getDefaultBaseURL() {
      return 'https://api.moonshot.cn/v1';
    }
    getDefaultHeaders() {
      return {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };
    }
    getConfig() {
      return {
        model: {
          chat: 'moonshot-v1-8k',
          embedding: 'text-embedding-v1'
        }
      };
    }
  }

  class DeepSeekAPIProvider extends BaseAPIProvider {
    getDefaultBaseURL() {
      return 'https://api.deepseek.com/v1';
    }
    getDefaultHeaders() {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };
    }
    getConfig() {
      return {
        model: {
          chat: 'deepseek-chat'
        }
      };
    }
  }

  class ChatGPTAPIProvider extends BaseAPIProvider {
    getDefaultBaseURL() {
      return 'https://api.openai.com/v1';
    }
    getDefaultHeaders() {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };
    }
    getConfig() {
      return {
        model: {
          chat: 'gpt-3.5-turbo',
          embedding: 'text-embedding-ada-002'
        }
      };
    }
  }

  class CustomOpenAIAPIProvider extends BaseAPIProvider {
    getDefaultBaseURL() {
      const config = getConfig();
      return config.customOpenAIUrl || 'https://new.ljcljc.cn/v1';
    }
    getDefaultHeaders() {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };
    }
    getConfig() {
      const config = getConfig();
      return {
        model: {
          chat: config.customOpenAIModel || 'gpt-4.1',
          embedding: 'text-embedding-3-large'
        }
      };
    }
  }

  class APIFactory {
    provider = null;
    constructor() {}
    static getInstance() {
      if (!APIFactory.instance) {
        APIFactory.instance = new APIFactory();
      }
      return APIFactory.instance;
    }
    getProvider() {
      if (!this.provider) {
        const config = getConfig();
        const apiKey = config.apiKeys[config.apiType];
        if (!apiKey) {
          throw new Error(`未设置 ${config.apiType} 的API密钥`);
        }
        switch (config.apiType) {
          case 'deepseek':
            this.provider = new DeepSeekAPIProvider({
              apiKey,
              baseURL: 'https://api.deepseek.com/v1'
            });
            break;
          case 'chatgpt':
            this.provider = new ChatGPTAPIProvider({
              apiKey,
              baseURL: 'https://api.openai.com/v1'
            });
            break;
          case 'custom-openai':
            this.provider = new CustomOpenAIAPIProvider({
              apiKey,
              baseURL: config.customOpenAIUrl || 'https://api.openai.com/v1'
            });
            break;
          case 'moonshot':
          default:
            this.provider = new MoonshotAPIProvider({
              apiKey,
              baseURL: 'https://api.moonshot.cn/v1'
            });
            break;
        }
      }
      return this.provider;
    }
    resetProvider() {
      this.provider = null;
    }
  }

  // 用于清理文本的工具函数
  function cleanText(text) {
    // 1. 基本清理
    let cleaned = text.replace(/\s+/g, ' ').trim().replace(/[""]/g, '"').replace(/['']/g, "'").replace(/[（）]/g, "()").replace(/[【】]/g, "[]");

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
      let insideBracket = cleaned.substring(firstLeftBracket + 1, lastRightBracket).replace(/[()（）]/g, '');

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
  function stringSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
      }
    }
    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
  }
  class AnswerHandler {
    questions = [];
    isProcessing = false;
    constructor() {}
    static getInstance() {
      if (!AnswerHandler.instance) {
        AnswerHandler.instance = new AnswerHandler();
      }
      return AnswerHandler.instance;
    }
    async scanQuestions() {
      try {
        const questions = [];

        // 用于收集每种题型的题目
        const questionsByType = {
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
          let questionType = 'single'; // 默认为单选题
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
                    return Array.from(codeSpans).map(span => span.innerHTML.replace(/&nbsp;/g, ' ').trim()).join(' ');
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
            const options = [];
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
            const question = {
              index: questionIndex++,
              content,
              type: questionType,
              element: questionEl,
              options: options.length > 0 ? options : undefined
            };

            // 如果是填空题，识别答题框
            if (questionType === 'text') {
              const textQue = questionEl.querySelector('.que-title')?.nextElementSibling;
              if (textQue?.classList.contains('text-que')) {
                const blanks = [];
                const opts = textQue.querySelectorAll('.opt');
                opts.forEach(opt => {
                  const numberSpan = opt.querySelector('span');
                  const inputWrapper = opt.querySelector('.el-input.el-input--small.el-input--suffix');
                  const input = inputWrapper?.querySelector('.el-input__inner');
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
    detectQuestionType(container, question) {
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
    extractOptions(container) {
      const options = [];

      // 扩展选项的选择器
      const optionElements = container.querySelectorAll('.option, .answer-option, label, ' + '.choice, .option-item, .answer-item, ' + '.option-wrapper, .answer-wrapper, .optionUl li');
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
    async getAnswer(question) {
      try {
        const config = {
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "你是一个专业的答题助手。请根据题目内容和选项，给出最可能的答案。"
          }, {
            role: "user",
            content: `题目类型: ${question.type}\n题目内容: ${question.content}\n${question.options ? '选项: ' + question.options.join(' | ') : ''}`
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
          const similarities = question.options.map(option => stringSimilarity(result.answer.toLowerCase(), option.toLowerCase()));
          confidence = Math.max(...similarities);
        }
        return {
          question: question.content,
          answer: result.answer,
          confidence
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        debug(`获取答案失败: ${errorMessage}`);
        return null;
      }
    }
    async submitAnswer(question, answer) {
      try {
        switch (question.type) {
          case 'single':
          case 'multiple':
            {
              if (!question.options) return false;
              const answers = answer.split(',').map(a => a.trim());
              const options = question.element.querySelectorAll('input[type="radio"], input[type="checkbox"]');
              options.forEach((input, index) => {
                if (index < question.options.length) {
                  const optionText = question.options[index];
                  const shouldCheck = answers.some(ans => stringSimilarity(ans.toLowerCase(), optionText.toLowerCase()) > 0.8);
                  if (shouldCheck) {
                    input.checked = true;
                    input.dispatchEvent(new Event('change', {
                      bubbles: true
                    }));
                  }
                }
              });
              break;
            }
          case 'judgement':
            {
              const trueWords = ['正确', '是', '对', 'true', 't', '√'];
              const isTrue = trueWords.some(word => answer.toLowerCase().includes(word.toLowerCase()));
              const options = question.element.querySelectorAll('input[type="radio"]');
              if (options.length >= 2) {
                options[isTrue ? 0 : 1].checked = true;
                options[isTrue ? 0 : 1].dispatchEvent(new Event('change', {
                  bubbles: true
                }));
              }
              break;
            }
          case 'text':
            {
              const input = question.element.querySelector('input[type="text"], textarea');
              if (input) {
                input.value = answer;
                input.dispatchEvent(new Event('input', {
                  bubbles: true
                }));
                input.dispatchEvent(new Event('change', {
                  bubbles: true
                }));
              }
              break;
            }
        }
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        debug(`提交答案失败: ${errorMessage}`);
        return false;
      }
    }
    async startAutoAnswer() {
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
        const response = await provider.chat([{
          role: 'system',
          content: '你是一个专业的答题助手，请严格按照指定格式回答题目。'
        }, {
          role: 'user',
          content: prompt
        }]);
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
        const errorMessage = error instanceof Error ? error.message : String(error);
        debug('自动答题失败: ' + errorMessage);
      } finally {
        this.isProcessing = false;
      }
    }
    async processAIResponse(response) {
      try {
        // 添加原始响应的日志
        debug('原始AI响应：\n' + response);

        // 尝试解析JSON格式的答案
        let answers;
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
            const targetIndex = correctFirst ? isCorrect ? 1 : 2 :
            // 正确在前：A选1，B选2
            isCorrect ? 2 : 1;
            const targetOption = question.element.querySelector(`.option:nth-child(${targetIndex})`);
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
                blank.element.dispatchEvent(new Event('input', {
                  bubbles: true
                }));
                blank.element.dispatchEvent(new Event('change', {
                  bubbles: true
                }));
              }
            } else {
              // 处理简答题
              debug(`第 ${index} 题是简答题`);
              const queTitle = question.element.querySelector('.que-title');
              if (queTitle) {
                const textarea = queTitle.nextElementSibling?.querySelector('.el-textarea__inner');
                if (textarea) {
                  debug('找到简答题的textarea元素');
                  textarea.value = answer;
                  textarea.dispatchEvent(new Event('input', {
                    bubbles: true
                  }));
                  textarea.dispatchEvent(new Event('change', {
                    bubbles: true
                  }));
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
    async processOptionAnswer(questionIndex, answer) {
      const question = this.questions.find(q => q.index === questionIndex);
      if (!question || !question.options) {
        debug(`处理选项答案失败：未找到题目 ${questionIndex} 或题目没有选项`);
        return;
      }
      debug(`处理第 ${questionIndex} 题选项答案：\n题型：${question.type}\n答案：${answer}\n可用选项：${question.options.join(', ')}`);

      // 处理单选题和多选题
      let answerLetters = [];
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
          const targetOption = question.element.querySelector(`.option:nth-child(${optionIndex + 1})`);
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
    async processBlankAnswer(questionIndex, blankNumber, answer) {
      const question = this.questions.find(q => q.index === questionIndex);
      if (!question || !question.blanks) return;

      // 找到对应的填空框
      const blank = question.blanks.find(b => b.number === blankNumber);
      if (!blank) return;

      // 设置答案
      blank.element.value = answer;
      blank.element.dispatchEvent(new Event('input', {
        bubbles: true
      }));
      blank.element.dispatchEvent(new Event('change', {
        bubbles: true
      }));
    }
    stopAutoAnswer() {
      this.isProcessing = false;
      debug('停止自动答题');
    }
    getQuestions() {
      return this.questions;
    }
  }

  class ConfigPanel {
    constructor() {
      this.panel = this.createPanel();
      this.answerHandler = AnswerHandler.getInstance();
      this.currentConfig = getConfig();
      this.initEvents();
    }
    createPanel() {
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
    initEvents() {
      // 初始化当前选中的API类型和对应的密钥
      const apiTypeSelect = document.getElementById('api-type');
      const apiKeyInput = document.getElementById('api-key');
      const customUrlInput = document.getElementById('custom-openai-url');
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
      document.getElementById('toggle-password')?.addEventListener('click', event => {
        const button = event.target;
        const input = document.getElementById('api-key');
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
          this.panel.querySelectorAll(`.${styles.tab}`).forEach(t => t.classList.remove(styles.active));

          // 移除所有内容区的active类
          this.panel.querySelectorAll(`.${styles.tabContent}`).forEach(c => c.classList.remove(styles.active));

          // 添加当前标签页的active类
          tab.classList.add(styles.active);

          // 添加对应内容区的active类
          const tabId = tab.dataset.tab;
          document.getElementById(`${tabId}-tab`)?.classList.add(styles.active);
        });
      });

      // API类型切换时加载对应的API密钥
      document.getElementById('api-type')?.addEventListener('change', event => {
        const apiType = event.target.value;
        const apiKeyInput = document.getElementById('api-key');
        apiKeyInput.value = this.currentConfig.apiKeys[apiType] || '';
        this.validateApiKey(apiKeyInput.value, apiType);
        this.toggleCustomUrlInput(apiType);
      });

      // API密钥输入时实时验证
      document.getElementById('api-key')?.addEventListener('input', event => {
        const apiKey = event.target.value;
        const apiType = document.getElementById('api-type').value;
        this.validateApiKey(apiKey, apiType);
      });

      // 测试API连接
      document.getElementById('test-api')?.addEventListener('click', async () => {
        const button = document.getElementById('test-api');
        if (!button) return;
        const apiKey = document.getElementById('api-key').value;
        const apiType = document.getElementById('api-type').value;
        const customUrl = document.getElementById('custom-openai-url').value;
        if (!this.validateApiKey(apiKey, apiType)) {
          return;
        }
        if (apiType === 'custom-openai' && !customUrl.trim()) {
          alert('请输入自定义API地址');
          return;
        }
        try {
          button.textContent = '测试中...';
          button.disabled = true;
          const customModel = document.getElementById('custom-openai-model').value;

          // 创建临时配置进行测试
          const testConfig = {
            ...this.currentConfig,
            apiType,
            apiKeys: {
              ...this.currentConfig.apiKeys,
              [apiType]: apiKey
            },
            customOpenAIUrl: apiType === 'custom-openai' ? customUrl : this.currentConfig.customOpenAIUrl,
            customOpenAIModel: apiType === 'custom-openai' ? customModel || 'gpt-4.1' : this.currentConfig.customOpenAIModel
          };

          // 临时保存配置用于测试
          saveConfig(testConfig);

          // 重置API提供者以使用新配置
          APIFactory.getInstance().resetProvider();
          const provider = APIFactory.getInstance().getProvider();
          const response = await provider.chat([{
            role: 'user',
            content: '你好，这是一个测试消息。请回复"连接成功"。'
          }]);
          if (response.data?.choices?.[0]?.message?.content.includes('连接成功')) {
            alert('API连接测试成功！');
          } else {
            alert('API连接测试失败：响应格式不正确');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          alert('API连接测试失败：' + errorMessage);
        } finally {
          button.textContent = '测试连接';
          button.disabled = false;

          // 恢复原始配置
          saveConfig(this.currentConfig);
          APIFactory.getInstance().resetProvider();
        }
      });

      // 保存API配置
      document.getElementById('save-api')?.addEventListener('click', () => {
        const apiKey = document.getElementById('api-key').value;
        const apiType = document.getElementById('api-type').value;
        const customUrl = document.getElementById('custom-openai-url').value;
        if (!this.validateApiKey(apiKey, apiType)) {
          return;
        }
        if (apiType === 'custom-openai' && !customUrl.trim()) {
          alert('请输入自定义API地址');
          return;
        }
        const customModel = document.getElementById('custom-openai-model').value;

        // 更新配置
        this.currentConfig = {
          ...this.currentConfig,
          apiType,
          apiKeys: {
            ...this.currentConfig.apiKeys,
            [apiType]: apiKey
          },
          customOpenAIUrl: apiType === 'custom-openai' ? customUrl : this.currentConfig.customOpenAIUrl,
          customOpenAIModel: apiType === 'custom-openai' ? customModel || 'gpt-4.1' : this.currentConfig.customOpenAIModel
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
        if (this.answerHandler.isProcessing) {
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
    toggleCustomUrlInput(apiType) {
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
    validateApiKey(apiKey, apiType) {
      const input = document.getElementById('api-key');
      const saveButton = document.getElementById('save-api');
      const testButton = document.getElementById('test-api');

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
    async show() {
      this.panel.style.display = 'block';

      // 加载已保存的配置
      const config = getConfig();
      document.getElementById('api-type').value = config.apiType;
      document.getElementById('api-key').value = config.apiKeys[config.apiType] || '';
      document.getElementById('custom-openai-url').value = config.customOpenAIUrl || '';
      document.getElementById('custom-openai-model').value = config.customOpenAIModel || '';

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
      window.selectOption = (questionIndex, optionLetter) => {
        this.answerHandler.selectOption(questionIndex, optionLetter);
      };

      // 添加填空题输入框值更新的全局处理函数
      window.updateBlankValue = (questionIndex, blankNumber, value) => {
        const question = this.answerHandler.getQuestions().find(q => q.index === questionIndex);
        if (question?.blanks) {
          const blank = question.blanks.find(b => b.number === blankNumber);
          if (blank) {
            blank.element.value = value;
            blank.element.dispatchEvent(new Event('input', {
              bubbles: true
            }));
            blank.element.dispatchEvent(new Event('change', {
              bubbles: true
            }));
          }
        }
      };
    }
    updateQuestionGrid(questions) {
      const grid = this.panel.querySelector(`.${styles.questionGrid}`);
      if (!grid) return;
      grid.innerHTML = '';
      questions.forEach(question => {
        const box = document.createElement('div');
        box.className = `${styles.questionBox} ${question.answer ? styles.completed : ''}`;
        box.textContent = question.index.toString();
        box.onclick = () => this.showQuestionDetail(question);
        grid.appendChild(box);
      });
    }
    hide() {
      this.panel.style.display = 'none';
    }
    showQuestionDetail(question) {
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

})();
