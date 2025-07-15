
// ==UserScript==
// @name          my-userscript Dev
// @namespace     my-userscript
// @version       0.0.0
// @include       *
// name           OmniEdu自动答题助手
// namespace      http://tampermonkey.net/
// version        0.1
// description    OmniEdu在线教育平台自动答题助手，支持自动答题、自动提交等功能
// author         AI Assistant
// @match         https://www.omniedu.com/*
// @match         http://www.omniedu.com/*
// @match         https://omniedu.com/*
// @match         http://omniedu.com/*
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         unsafeWindow
// @run-at        document-end
// @connect       api.moonshot.cn
// @connect       api.deepseek.com
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

  var css_248z = ".auto-answer-module_configBtn__ekKsq {\n    position: fixed;\n    bottom: 20px;\n    right: 20px;\n    z-index: 9999;\n    width: 40px;\n    height: 40px;\n    background: #409EFF;\n    color: white;\n    border: none;\n    border-radius: 50%;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 20px;\n    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);\n}\n\n.auto-answer-module_configBtn__ekKsq:hover {\n    background: #66b1ff;\n}\n\n.auto-answer-module_configPanel__xYuLC {\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    width: 800px;\n    background: white;\n    padding: 20px;\n    border-radius: 8px;\n    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);\n    z-index: 10000;\n    display: none;\n}\n\n.auto-answer-module_panelHeader__jv2gY {\n    position: relative;\n    margin: -20px -20px 0;\n    padding: 20px;\n}\n\n.auto-answer-module_closeBtn__umDtC {\n    position: absolute;\n    top: 20px;\n    right: 20px;\n    width: 24px;\n    height: 24px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n    color: #909399;\n    font-size: 24px;\n    transition: color 0.3s;\n    line-height: 1;\n}\n\n.auto-answer-module_closeBtn__umDtC:hover {\n    color: #F56C6C;\n}\n\n.auto-answer-module_tabContainer__XV7ti {\n    display: flex;\n    border-bottom: 1px solid #dcdfe6;\n    margin: 0 -20px 20px;\n    padding: 0 20px;\n}\n\n.auto-answer-module_tab__uWxgk {\n    padding: 10px 20px;\n    cursor: pointer;\n    color: #606266;\n    border-bottom: 2px solid transparent;\n}\n\n.auto-answer-module_tab__uWxgk.auto-answer-module_active__Sxlg2 {\n    color: #409EFF;\n    border-bottom-color: #409EFF;\n}\n\n.auto-answer-module_tabContent__rWL2T {\n    display: none;\n}\n\n.auto-answer-module_tabContent__rWL2T.auto-answer-module_active__Sxlg2 {\n    display: block;\n}\n\n.auto-answer-module_questionGrid__40f4P {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));\n    gap: 8px;\n    margin-bottom: 20px;\n}\n\n.auto-answer-module_questionBox__w00xP {\n    aspect-ratio: 1;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background: white;\n    border: 1px solid #dcdfe6;\n    border-radius: 4px;\n    cursor: pointer;\n    font-size: 12px;\n    color: #606266;\n    transition: all 0.3s;\n}\n\n.auto-answer-module_questionBox__w00xP:hover {\n    transform: scale(1.1);\n    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);\n}\n\n.auto-answer-module_questionBox__w00xP.auto-answer-module_completed__AGqJ0 {\n    background: #409EFF;\n    color: white;\n    border-color: #409EFF;\n}\n\n.auto-answer-module_questionDetail__eozNS {\n    margin: 20px 0;\n    padding: 15px;\n    background: #f5f7fa;\n    border-radius: 4px;\n    min-height: 200px;\n}\n\n.auto-answer-module_apiConfig__KJaiR {\n    padding: 20px;\n}\n\n.auto-answer-module_formItem__rWVmg {\n    margin-bottom: 20px;\n}\n\n.auto-answer-module_formItem__rWVmg label {\n    display: block;\n    margin-bottom: 8px;\n    color: #333;\n    font-weight: bold;\n}\n\n.auto-answer-module_formItem__rWVmg select,\n.auto-answer-module_formItem__rWVmg input {\n    width: 100%;\n    padding: 8px 12px;\n    border: 1px solid #dcdfe6;\n    border-radius: 4px;\n    font-size: 14px;\n    transition: all 0.3s;\n}\n\n.auto-answer-module_formItem__rWVmg select:focus,\n.auto-answer-module_formItem__rWVmg input:focus {\n    outline: none;\n    border-color: #409eff;\n    box-shadow: 0 0 0 2px rgba(64,158,255,.2);\n}\n\n.auto-answer-module_inputGroup__Yu-vg {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n}\n\n.auto-answer-module_inputGroup__Yu-vg input {\n    flex: 1;\n}\n\n.auto-answer-module_inputGroup__Yu-vg button {\n    padding: 8px 12px;\n    border: 1px solid #dcdfe6;\n    border-radius: 4px;\n    background: #fff;\n    cursor: pointer;\n    transition: all 0.3s;\n}\n\n.auto-answer-module_inputGroup__Yu-vg button:hover {\n    background: #f5f7fa;\n}\n\n.auto-answer-module_apiKeyHelp__rTXiJ {\n    margin-top: 8px;\n    padding: 12px;\n    background: #f8f9fa;\n    border-radius: 4px;\n    font-size: 12px;\n    color: #606266;\n}\n\n.auto-answer-module_apiKeyHelp__rTXiJ p {\n    margin: 0 0 8px 0;\n    font-weight: bold;\n}\n\n.auto-answer-module_apiKeyHelp__rTXiJ ul {\n    margin: 0;\n    padding-left: 20px;\n}\n\n.auto-answer-module_apiKeyHelp__rTXiJ li {\n    margin: 4px 0;\n}\n\n.auto-answer-module_btnContainer__4wLy8 {\n    display: flex;\n    gap: 12px;\n    margin-top: 20px;\n}\n\n.auto-answer-module_btn__yQl08 {\n    padding: 8px 16px;\n    border: none;\n    border-radius: 4px;\n    font-size: 14px;\n    cursor: pointer;\n    transition: all 0.3s;\n}\n\n.auto-answer-module_btn__yQl08:disabled {\n    opacity: 0.6;\n    cursor: not-allowed;\n}\n\n.auto-answer-module_btnPrimary__ioplW {\n    background: #409eff;\n    color: white;\n}\n\n.auto-answer-module_btnPrimary__ioplW:hover:not(:disabled) {\n    background: #66b1ff;\n}\n\n.auto-answer-module_btnDefault__b5fLW {\n    background: #f4f4f5;\n    color: #606266;\n}\n\n.auto-answer-module_btnDefault__b5fLW:hover:not(:disabled) {\n    background: #e9e9eb;\n}\n\n.auto-answer-module_btnDanger__umKjg {\n    background: #f56c6c;\n    color: white;\n}\n\n.auto-answer-module_btnDanger__umKjg:hover:not(:disabled) {\n    background: #f78989;\n}\n\n.auto-answer-module_btnWarning__xRokW {\n    background-color: #e6a23c;\n    border-color: #e6a23c;\n    color: #fff;\n}\n\n.auto-answer-module_btnWarning__xRokW:hover {\n    background-color: #ebb563;\n    border-color: #ebb563;\n    color: #fff;\n}\n\n.auto-answer-module_btnInfo__7JFNj {\n    background-color: #409eff;\n    border-color: #409eff;\n    color: #fff;\n}\n\n.auto-answer-module_btnInfo__7JFNj:hover {\n    background-color: #66b1ff;\n    border-color: #66b1ff;\n    color: #fff;\n}\n\n.auto-answer-module_error__mVpGZ {\n    border-color: #f44336 !important;\n    background-color: #ffebee !important;\n}\n\n.auto-answer-module_error__mVpGZ:focus {\n    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;\n} ";
  var styles = {"configBtn":"auto-answer-module_configBtn__ekKsq","configPanel":"auto-answer-module_configPanel__xYuLC","panelHeader":"auto-answer-module_panelHeader__jv2gY","closeBtn":"auto-answer-module_closeBtn__umDtC","tabContainer":"auto-answer-module_tabContainer__XV7ti","tab":"auto-answer-module_tab__uWxgk","active":"auto-answer-module_active__Sxlg2","tabContent":"auto-answer-module_tabContent__rWL2T","questionGrid":"auto-answer-module_questionGrid__40f4P","questionBox":"auto-answer-module_questionBox__w00xP","completed":"auto-answer-module_completed__AGqJ0","questionDetail":"auto-answer-module_questionDetail__eozNS","apiConfig":"auto-answer-module_apiConfig__KJaiR","formItem":"auto-answer-module_formItem__rWVmg","inputGroup":"auto-answer-module_inputGroup__Yu-vg","apiKeyHelp":"auto-answer-module_apiKeyHelp__rTXiJ","btnContainer":"auto-answer-module_btnContainer__4wLy8","btn":"auto-answer-module_btn__yQl08","btnPrimary":"auto-answer-module_btnPrimary__ioplW","btnDefault":"auto-answer-module_btnDefault__b5fLW","btnDanger":"auto-answer-module_btnDanger__umKjg","btnWarning":"auto-answer-module_btnWarning__xRokW","btnInfo":"auto-answer-module_btnInfo__7JFNj","error":"auto-answer-module_error__mVpGZ"};
  styleInject(css_248z);

  const defaultConfig = {
    apiType: 'moonshot',
    apiKey: '',
    debugMode: true
  };
  function getConfig() {
    const savedConfig = localStorage.getItem('auto-answer-config');
    if (savedConfig) {
      return JSON.parse(savedConfig);
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
      for (const [type, questions] of Object.entries(questionsByType)) {
        if (questions.length > 0) {
          prompt += `${this.getTypeTitle(type)}：\n`;
          prompt += this.formatQuestions(questions) + '\n\n';
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
        const response = await this.customFetch('/chat/completions', {
          method: 'POST',
          headers: this.getDefaultHeaders(),
          body: {
            model: 'moonshot-v1-8k',
            messages: [{
              role: 'system',
              content: '你是一个专业的答题助手，请严格按照指定格式回答题目。'
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
        throw new Error(`Moonshot API Error: ${error.message}`);
      }
    }
    async embeddings(input) {
      try {
        const response = await this.customFetch('/embeddings', {
          method: 'POST',
          headers: this.getDefaultHeaders(),
          body: {
            model: 'text-embedding-v1',
            input: Array.isArray(input) ? input : [input]
          }
        });
        return {
          code: 200,
          message: 'success',
          data: response
        };
      } catch (error) {
        throw new Error(`Moonshot API Error: ${error.message}`);
      }
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
        const response = await this.customFetch('/chat/completions', {
          method: 'POST',
          headers: this.getDefaultHeaders(),
          body: {
            model: 'deepseek-chat',
            messages: [{
              role: 'system',
              content: '你是一个专业的答题助手，请严格按照指定格式回答题目。'
            }, ...messages],
            temperature: 0.3 // 使用较低的温度以提高答案的准确性
          }
        });
        return {
          code: 200,
          message: 'success',
          data: response
        };
      } catch (error) {
        throw new Error(`DeepSeek API Error: ${error.message}`);
      }
    }
    async embeddings(input) {
      throw new Error('DeepSeek API does not support embeddings yet');
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
        switch (config.apiType) {
          case 'deepseek':
            this.provider = new DeepSeekAPIProvider({
              apiKey: config.apiKey,
              baseURL: 'https://api.deepseek.com/v1'
            });
            break;
          case 'moonshot':
          default:
            this.provider = new MoonshotAPIProvider({
              apiKey: config.apiKey,
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
        debug('扫描题目失败: ' + error.message);
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
        debug(`获取答案失败: ${error.message}`);
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
        debug(`提交答案失败: ${error.message}`);
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
        debug('自动答题失败: ' + error.message);
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
        debug('处理AI响应失败：' + error.message);
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
                            <option value="kimi">Kimi</option>
                            <option value="deepseek">Deepseek</option>
                            <option value="chatgpt">ChatGPT</option>
                        </select>
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
                                <li>Kimi: 以 sk- 开头</li>
                                <li>Deepseek: 以 sk- 开头</li>
                                <li>ChatGPT: 以 sk- 开头</li>
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

      // API类型切换时验证API密钥
      document.getElementById('api-type')?.addEventListener('change', event => {
        const apiKey = document.getElementById('api-key').value;
        const apiType = event.target.value;
        this.validateApiKey(apiKey, apiType);
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
        if (!this.validateApiKey(apiKey, apiType)) {
          return;
        }
        try {
          button.textContent = '测试中...';
          button.disabled = true;
          const apiFactory = APIFactory.getInstance();
          const provider = apiFactory.getProvider();
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
          alert('API连接测试失败：' + error.message);
        } finally {
          button.textContent = '测试连接';
          button.disabled = false;
        }
      });

      // 保存API配置
      document.getElementById('save-api')?.addEventListener('click', () => {
        const apiKey = document.getElementById('api-key').value;
        const apiType = document.getElementById('api-type').value;
        if (!this.validateApiKey(apiKey, apiType)) {
          return;
        }

        // 创建新的配置对象
        const config = {
          apiType,
          apiKey,
          debugMode: true // 保持默认值
        };

        // 保存配置
        saveConfig(config);

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
        this.updateQuestionGrid();
      });
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
      document.getElementById('api-key').value = config.apiKey;

      // 只有当API key不为空时才验证
      if (config.apiKey) {
        this.validateApiKey(config.apiKey, config.apiType);
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
      debug('初始化失败: ' + error.message);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LnVzZXIuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9zdHlsZS1pbmplY3QvZGlzdC9zdHlsZS1pbmplY3QuZXMuanMiLCIuLi9zcmMvdXRpbHMvY29uZmlnLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mYWlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kZXNjcmlwdG9ycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jbGFzc29mLXJhdy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbmRleGVkLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtY2FsbGFibGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1idWlsdC1pbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9uYXRpdmUtc3ltYm9sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXN5bWJvbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90cnktdG8tc3RyaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2EtY2FsbGFibGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LW1ldGhvZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vcmRpbmFyeS10by1wcmltaXRpdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2V0LWdsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQtc3RvcmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VpZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tcHJvcGVydHkta2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4tb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL25hdGl2ZS13ZWFrLW1hcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQta2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hpZGRlbi1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLW5hbWUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVkZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1hYnNvbHV0ZS1pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1sZW5ndGguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbGVuZ3RoLW9mLWFycmF5LWxpa2UuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW51bS1idWcta2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL293bi1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1mb3JjZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZXhwb3J0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FuLWluc3RhbmNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydGllcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9odG1sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1jcmVhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY29ycmVjdC1wcm90b3R5cGUtZ2V0dGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2l0ZXJhdG9ycy1jb3JlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lc25leHQuaXRlcmF0b3IuY29uc3RydWN0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWFycmF5LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLWNvbnRleHQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NsYXNzb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nZXQtaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3ItY2xvc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXNuZXh0Lml0ZXJhdG9yLmZpbmQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzbmV4dC5pdGVyYXRvci5mb3ItZWFjaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZWRlZmluZS1hbGwuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3ItY3JlYXRlLXByb3h5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NhbGwtd2l0aC1zYWZlLWl0ZXJhdGlvbi1jbG9zaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lc25leHQuaXRlcmF0b3IubWFwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lc25leHQuaXRlcmF0b3IuZmlsdGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lc25leHQuaXRlcmF0b3Iuc29tZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXNuZXh0Lml0ZXJhdG9yLnJlZHVjZS5qcyIsIi4uL3NyYy91dGlscy9wcm9tcHQtZ2VuZXJhdG9yLnRzIiwiLi4vc3JjL3V0aWxzL2FwaS9ldmVudC1lbWl0dGVyLnRzIiwiLi4vc3JjL3V0aWxzL2FwaS9iYXNlLnRzIiwiLi4vc3JjL3V0aWxzL2FwaS9tb29uc2hvdC50cyIsIi4uL3NyYy91dGlscy9hcGkvZGVlcHNlZWsudHMiLCIuLi9zcmMvdXRpbHMvYXBpL2ZhY3RvcnkudHMiLCIuLi9zcmMvdXRpbHMvYW5zd2VyLnRzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29uZmlnUGFuZWwudHMiLCIuLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xuICAgIGFwaVR5cGU6ICdtb29uc2hvdCcgfCAnZGVlcHNlZWsnO1xuICAgIGFwaUtleTogc3RyaW5nO1xuICAgIGRlYnVnTW9kZTogYm9vbGVhbjtcbn1cblxuY29uc3QgZGVmYXVsdENvbmZpZzogQ29uZmlnID0ge1xuICAgIGFwaVR5cGU6ICdtb29uc2hvdCcsXG4gICAgYXBpS2V5OiAnJyxcbiAgICBkZWJ1Z01vZGU6IHRydWVcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcbiAgICBjb25zdCBzYXZlZENvbmZpZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhdXRvLWFuc3dlci1jb25maWcnKTtcbiAgICBpZiAoc2F2ZWRDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uoc2F2ZWRDb25maWcpO1xuICAgIH1cbiAgICByZXR1cm4gZGVmYXVsdENvbmZpZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVDb25maWcoY29uZmlnOiBDb25maWcpOiB2b2lkIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYXV0by1hbnN3ZXItY29uZmlnJywgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyhtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoKTtcbiAgICBpZiAoY29uZmlnLmRlYnVnTW9kZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnW+iHquWKqOetlOmimOWKqeaJi10nLCBtZXNzYWdlKTtcbiAgICB9XG59ICIsInZhciBjaGVjayA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgJiYgaXQuTWF0aCA9PSBNYXRoICYmIGl0O1xufTtcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbm1vZHVsZS5leHBvcnRzID1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLWdsb2JhbC10aGlzIC0tIHNhZmVcbiAgY2hlY2sodHlwZW9mIGdsb2JhbFRoaXMgPT0gJ29iamVjdCcgJiYgZ2xvYmFsVGhpcykgfHxcbiAgY2hlY2sodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cpIHx8XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgLS0gc2FmZVxuICBjaGVjayh0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmKSB8fFxuICBjaGVjayh0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCkgfHxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jIC0tIGZhbGxiYWNrXG4gIChmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KSgpIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbi8vIERldGVjdCBJRTgncyBpbmNvbXBsZXRlIGRlZmluZVByb3BlcnR5IGltcGxlbWVudGF0aW9uXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgMSwgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSlbMV0gIT0gNztcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIE5hc2hvcm4gfiBKREs4IGJ1Z1xudmFyIE5BU0hPUk5fQlVHID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmICEkcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh7IDE6IDIgfSwgMSk7XG5cbi8vIGBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eWlzZW51bWVyYWJsZVxuZXhwb3J0cy5mID0gTkFTSE9STl9CVUcgPyBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShWKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIFYpO1xuICByZXR1cm4gISFkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuZW51bWVyYWJsZTtcbn0gOiAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xuXG52YXIgc3BsaXQgPSAnJy5zcGxpdDtcblxuLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3Ncbm1vZHVsZS5leHBvcnRzID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyB0aHJvd3MgYW4gZXJyb3IgaW4gcmhpbm8sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9yaGluby9pc3N1ZXMvMzQ2XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnMgLS0gc2FmZVxuICByZXR1cm4gIU9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApO1xufSkgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNsYXNzb2YoaXQpID09ICdTdHJpbmcnID8gc3BsaXQuY2FsbChpdCwgJycpIDogT2JqZWN0KGl0KTtcbn0gOiBPYmplY3Q7XG4iLCIvLyBgUmVxdWlyZU9iamVjdENvZXJjaWJsZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXJlcXVpcmVvYmplY3Rjb2VyY2libGVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEluZGV4ZWRPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShpdCkpO1xufTtcbiIsIi8vIGBJc0NhbGxhYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXNjYWxsYWJsZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmd1bWVudCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCJ2YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogaXNDYWxsYWJsZShpdCk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG5cbnZhciBhRnVuY3Rpb24gPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGlzQ2FsbGFibGUoYXJndW1lbnQpID8gYXJndW1lbnQgOiB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG1ldGhvZCkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBhRnVuY3Rpb24oZ2xvYmFsW25hbWVzcGFjZV0pIDogZ2xvYmFsW25hbWVzcGFjZV0gJiYgZ2xvYmFsW25hbWVzcGFjZV1bbWV0aG9kXTtcbn07XG4iLCJ2YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCduYXZpZ2F0b3InLCAndXNlckFnZW50JykgfHwgJyc7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudCcpO1xuXG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIERlbm8gPSBnbG9iYWwuRGVubztcbnZhciB2ZXJzaW9ucyA9IHByb2Nlc3MgJiYgcHJvY2Vzcy52ZXJzaW9ucyB8fCBEZW5vICYmIERlbm8udmVyc2lvbjtcbnZhciB2OCA9IHZlcnNpb25zICYmIHZlcnNpb25zLnY4O1xudmFyIG1hdGNoLCB2ZXJzaW9uO1xuXG5pZiAodjgpIHtcbiAgbWF0Y2ggPSB2OC5zcGxpdCgnLicpO1xuICB2ZXJzaW9uID0gbWF0Y2hbMF0gPCA0ID8gMSA6IG1hdGNoWzBdICsgbWF0Y2hbMV07XG59IGVsc2UgaWYgKHVzZXJBZ2VudCkge1xuICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvRWRnZVxcLyhcXGQrKS8pO1xuICBpZiAoIW1hdGNoIHx8IG1hdGNoWzFdID49IDc0KSB7XG4gICAgbWF0Y2ggPSB1c2VyQWdlbnQubWF0Y2goL0Nocm9tZVxcLyhcXGQrKS8pO1xuICAgIGlmIChtYXRjaCkgdmVyc2lvbiA9IG1hdGNoWzFdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmVyc2lvbiAmJiArdmVyc2lvbjtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGVzL25vLXN5bWJvbCAtLSByZXF1aXJlZCBmb3IgdGVzdGluZyAqL1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5c3ltYm9scyAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xubW9kdWxlLmV4cG9ydHMgPSAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN5bWJvbCA9IFN5bWJvbCgpO1xuICAvLyBDaHJvbWUgMzggU3ltYm9sIGhhcyBpbmNvcnJlY3QgdG9TdHJpbmcgY29udmVyc2lvblxuICAvLyBgZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzYCBwb2x5ZmlsbCBzeW1ib2xzIGNvbnZlcnRlZCB0byBvYmplY3QgYXJlIG5vdCBTeW1ib2wgaW5zdGFuY2VzXG4gIHJldHVybiAhU3RyaW5nKHN5bWJvbCkgfHwgIShPYmplY3Qoc3ltYm9sKSBpbnN0YW5jZW9mIFN5bWJvbCkgfHxcbiAgICAvLyBDaHJvbWUgMzgtNDAgc3ltYm9scyBhcmUgbm90IGluaGVyaXRlZCBmcm9tIERPTSBjb2xsZWN0aW9ucyBwcm90b3R5cGVzIHRvIGluc3RhbmNlc1xuICAgICFTeW1ib2wuc2hhbSAmJiBWOF9WRVJTSU9OICYmIFY4X1ZFUlNJT04gPCA0MTtcbn0pO1xuIiwiLyogZXNsaW50LWRpc2FibGUgZXMvbm8tc3ltYm9sIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nICovXG52YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uYXRpdmUtc3ltYm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTkFUSVZFX1NZTUJPTFxuICAmJiAhU3ltYm9sLnNoYW1cbiAgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJztcbiIsInZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVTRV9TWU1CT0xfQVNfVUlEID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCc7XG59IDogZnVuY3Rpb24gKGl0KSB7XG4gIHZhciAkU3ltYm9sID0gZ2V0QnVpbHRJbignU3ltYm9sJyk7XG4gIHJldHVybiBpc0NhbGxhYmxlKCRTeW1ib2wpICYmIE9iamVjdChpdCkgaW5zdGFuY2VvZiAkU3ltYm9sO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIFN0cmluZyhhcmd1bWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuICdPYmplY3QnO1xuICB9XG59O1xuIiwidmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciB0cnlUb1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90cnktdG8tc3RyaW5nJyk7XG5cbi8vIGBBc3NlcnQ6IElzQ2FsbGFibGUoYXJndW1lbnQpIGlzIHRydWVgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICBpZiAoaXNDYWxsYWJsZShhcmd1bWVudCkpIHJldHVybiBhcmd1bWVudDtcbiAgdGhyb3cgVHlwZUVycm9yKHRyeVRvU3RyaW5nKGFyZ3VtZW50KSArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbn07XG4iLCJ2YXIgYUNhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtY2FsbGFibGUnKTtcblxuLy8gYEdldE1ldGhvZGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWdldG1ldGhvZFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoViwgUCkge1xuICB2YXIgZnVuYyA9IFZbUF07XG4gIHJldHVybiBmdW5jID09IG51bGwgPyB1bmRlZmluZWQgOiBhQ2FsbGFibGUoZnVuYyk7XG59O1xuIiwidmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxuLy8gYE9yZGluYXJ5VG9QcmltaXRpdmVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vcmRpbmFyeXRvcHJpbWl0aXZlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnB1dCwgcHJlZikge1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKHByZWYgPT09ICdzdHJpbmcnICYmIGlzQ2FsbGFibGUoZm4gPSBpbnB1dC50b1N0cmluZykgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKGlzQ2FsbGFibGUoZm4gPSBpbnB1dC52YWx1ZU9mKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpbnB1dCkpKSByZXR1cm4gdmFsO1xuICBpZiAocHJlZiAhPT0gJ3N0cmluZycgJiYgaXNDYWxsYWJsZShmbiA9IGlucHV0LnRvU3RyaW5nKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpbnB1dCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB0cnkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gc2FmZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwsIGtleSwgeyB2YWx1ZTogdmFsdWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZ2xvYmFsW2tleV0gPSB2YWx1ZTtcbiAgfSByZXR1cm4gdmFsdWU7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xuXG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCBzZXRHbG9iYWwoU0hBUkVELCB7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG4iLCJ2YXIgSVNfUFVSRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1wdXJlJyk7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiAnMy4xOC4zJyxcbiAgbW9kZTogSVNfUFVSRSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDIxIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxuLy8gYFRvT2JqZWN0YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9vYmplY3Rcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudCkpO1xufTtcbiIsInZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcblxudmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5cbi8vIGBIYXNPd25Qcm9wZXJ0eWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWhhc293bnByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5oYXNPd24gfHwgZnVuY3Rpb24gaGFzT3duKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwodG9PYmplY3QoaXQpLCBrZXkpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcG9zdGZpeCA9IE1hdGgucmFuZG9tKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnICsgU3RyaW5nKGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXkpICsgJylfJyArICgrK2lkICsgcG9zdGZpeCkudG9TdHJpbmcoMzYpO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgc2hhcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZCcpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3VpZCcpO1xudmFyIE5BVElWRV9TWU1CT0wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbCcpO1xudmFyIFVTRV9TWU1CT0xfQVNfVUlEID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkJyk7XG5cbnZhciBXZWxsS25vd25TeW1ib2xzU3RvcmUgPSBzaGFyZWQoJ3drcycpO1xudmFyIFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgY3JlYXRlV2VsbEtub3duU3ltYm9sID0gVVNFX1NZTUJPTF9BU19VSUQgPyBTeW1ib2wgOiBTeW1ib2wgJiYgU3ltYm9sLndpdGhvdXRTZXR0ZXIgfHwgdWlkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGlmICghaGFzT3duKFdlbGxLbm93blN5bWJvbHNTdG9yZSwgbmFtZSkgfHwgIShOQVRJVkVfU1lNQk9MIHx8IHR5cGVvZiBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPT0gJ3N0cmluZycpKSB7XG4gICAgaWYgKE5BVElWRV9TWU1CT0wgJiYgaGFzT3duKFN5bWJvbCwgbmFtZSkpIHtcbiAgICAgIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXSA9IFN5bWJvbFtuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdID0gY3JlYXRlV2VsbEtub3duU3ltYm9sKCdTeW1ib2wuJyArIG5hbWUpO1xuICAgIH1cbiAgfSByZXR1cm4gV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1zeW1ib2wnKTtcbnZhciBnZXRNZXRob2QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LW1ldGhvZCcpO1xudmFyIG9yZGluYXJ5VG9QcmltaXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb3JkaW5hcnktdG8tcHJpbWl0aXZlJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBUT19QUklNSVRJVkUgPSB3ZWxsS25vd25TeW1ib2woJ3RvUHJpbWl0aXZlJyk7XG5cbi8vIGBUb1ByaW1pdGl2ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvcHJpbWl0aXZlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnB1dCwgcHJlZikge1xuICBpZiAoIWlzT2JqZWN0KGlucHV0KSB8fCBpc1N5bWJvbChpbnB1dCkpIHJldHVybiBpbnB1dDtcbiAgdmFyIGV4b3RpY1RvUHJpbSA9IGdldE1ldGhvZChpbnB1dCwgVE9fUFJJTUlUSVZFKTtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKGV4b3RpY1RvUHJpbSkge1xuICAgIGlmIChwcmVmID09PSB1bmRlZmluZWQpIHByZWYgPSAnZGVmYXVsdCc7XG4gICAgcmVzdWx0ID0gZXhvdGljVG9QcmltLmNhbGwoaW5wdXQsIHByZWYpO1xuICAgIGlmICghaXNPYmplY3QocmVzdWx0KSB8fCBpc1N5bWJvbChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbiAgfVxuICBpZiAocHJlZiA9PT0gdW5kZWZpbmVkKSBwcmVmID0gJ251bWJlcic7XG4gIHJldHVybiBvcmRpbmFyeVRvUHJpbWl0aXZlKGlucHV0LCBwcmVmKTtcbn07XG4iLCJ2YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJpbWl0aXZlJyk7XG52YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtc3ltYm9sJyk7XG5cbi8vIGBUb1Byb3BlcnR5S2V5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9wcm9wZXJ0eWtleVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdmFyIGtleSA9IHRvUHJpbWl0aXZlKGFyZ3VtZW50LCAnc3RyaW5nJyk7XG4gIHJldHVybiBpc1N5bWJvbChrZXkpID8ga2V5IDogU3RyaW5nKGtleSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxudmFyIGRvY3VtZW50ID0gZ2xvYmFsLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgRVhJU1RTID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gRVhJU1RTID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQnKTtcblxuLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhREVTQ1JJUFRPUlMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSByZXF1aWVkIGZvciB0ZXN0aW5nXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3JlYXRlRWxlbWVudCgnZGl2JyksICdhJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfVxuICB9KS5hICE9IDc7XG59KTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1wcm9wZXJ0eS1pcy1lbnVtZXJhYmxlJyk7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9Qcm9wZXJ0eUtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcm9wZXJ0eS1rZXknKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lJyk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yIC0tIHNhZmVcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yXG5leHBvcnRzLmYgPSBERVNDUklQVE9SUyA/ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCkge1xuICBPID0gdG9JbmRleGVkT2JqZWN0KE8pO1xuICBQID0gdG9Qcm9wZXJ0eUtleShQKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIGlmIChoYXNPd24oTywgUCkpIHJldHVybiBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoIXByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlLmYuY2FsbChPLCBQKSwgT1tQXSk7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG4vLyBgQXNzZXJ0OiBUeXBlKGFyZ3VtZW50KSBpcyBPYmplY3RgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICBpZiAoaXNPYmplY3QoYXJndW1lbnQpKSByZXR1cm4gYXJndW1lbnQ7XG4gIHRocm93IFR5cGVFcnJvcihTdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgYW4gb2JqZWN0Jyk7XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b1Byb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleScpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHNhZmVcbnZhciAkZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZGVmaW5lcHJvcGVydHlcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gJGRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJvcGVydHlLZXkoUCk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuICRkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gREVTQ1JJUFRPUlMgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKG9iamVjdCwga2V5LCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcblxudmFyIGZ1bmN0aW9uVG9TdHJpbmcgPSBGdW5jdGlvbi50b1N0cmluZztcblxuLy8gdGhpcyBoZWxwZXIgYnJva2VuIGluIGBjb3JlLWpzQDMuNC4xLTMuNC40YCwgc28gd2UgY2FuJ3QgdXNlIGBzaGFyZWRgIGhlbHBlclxuaWYgKCFpc0NhbGxhYmxlKHN0b3JlLmluc3BlY3RTb3VyY2UpKSB7XG4gIHN0b3JlLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25Ub1N0cmluZy5jYWxsKGl0KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZS5pbnNwZWN0U291cmNlO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQ2FsbGFibGUoV2Vha01hcCkgJiYgL25hdGl2ZSBjb2RlLy50ZXN0KGluc3BlY3RTb3VyY2UoV2Vha01hcCkpO1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG5cbnZhciBrZXlzID0gc2hhcmVkKCdrZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4ga2V5c1trZXldIHx8IChrZXlzW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciBOQVRJVkVfV0VBS19NQVAgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXdlYWstbWFwJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcbnZhciBzaGFyZWRLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLWtleScpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcblxudmFyIE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEID0gJ09iamVjdCBhbHJlYWR5IGluaXRpYWxpemVkJztcbnZhciBXZWFrTWFwID0gZ2xvYmFsLldlYWtNYXA7XG52YXIgc2V0LCBnZXQsIGhhcztcblxudmFyIGVuZm9yY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGhhcyhpdCkgPyBnZXQoaXQpIDogc2V0KGl0LCB7fSk7XG59O1xuXG52YXIgZ2V0dGVyRm9yID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdCkge1xuICAgIHZhciBzdGF0ZTtcbiAgICBpZiAoIWlzT2JqZWN0KGl0KSB8fCAoc3RhdGUgPSBnZXQoaXQpKS50eXBlICE9PSBUWVBFKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0luY29tcGF0aWJsZSByZWNlaXZlciwgJyArIFRZUEUgKyAnIHJlcXVpcmVkJyk7XG4gICAgfSByZXR1cm4gc3RhdGU7XG4gIH07XG59O1xuXG5pZiAoTkFUSVZFX1dFQUtfTUFQIHx8IHNoYXJlZC5zdGF0ZSkge1xuICB2YXIgc3RvcmUgPSBzaGFyZWQuc3RhdGUgfHwgKHNoYXJlZC5zdGF0ZSA9IG5ldyBXZWFrTWFwKCkpO1xuICB2YXIgd21nZXQgPSBzdG9yZS5nZXQ7XG4gIHZhciB3bWhhcyA9IHN0b3JlLmhhcztcbiAgdmFyIHdtc2V0ID0gc3RvcmUuc2V0O1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgaWYgKHdtaGFzLmNhbGwoc3RvcmUsIGl0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcihPQkpFQ1RfQUxSRUFEWV9JTklUSUFMSVpFRCk7XG4gICAgbWV0YWRhdGEuZmFjYWRlID0gaXQ7XG4gICAgd21zZXQuY2FsbChzdG9yZSwgaXQsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWdldC5jYWxsKHN0b3JlLCBpdCkgfHwge307XG4gIH07XG4gIGhhcyA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWhhcy5jYWxsKHN0b3JlLCBpdCk7XG4gIH07XG59IGVsc2Uge1xuICB2YXIgU1RBVEUgPSBzaGFyZWRLZXkoJ3N0YXRlJyk7XG4gIGhpZGRlbktleXNbU1RBVEVdID0gdHJ1ZTtcbiAgc2V0ID0gZnVuY3Rpb24gKGl0LCBtZXRhZGF0YSkge1xuICAgIGlmIChoYXNPd24oaXQsIFNUQVRFKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihPQkpFQ1RfQUxSRUFEWV9JTklUSUFMSVpFRCk7XG4gICAgbWV0YWRhdGEuZmFjYWRlID0gaXQ7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KGl0LCBTVEFURSwgbWV0YWRhdGEpO1xuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfTtcbiAgZ2V0ID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGhhc093bihpdCwgU1RBVEUpID8gaXRbU1RBVEVdIDoge307XG4gIH07XG4gIGhhcyA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBoYXNPd24oaXQsIFNUQVRFKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogc2V0LFxuICBnZXQ6IGdldCxcbiAgaGFzOiBoYXMsXG4gIGVuZm9yY2U6IGVuZm9yY2UsXG4gIGdldHRlckZvcjogZ2V0dGVyRm9yXG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcblxudmFyIEZ1bmN0aW9uUHJvdG90eXBlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyIGdldERlc2NyaXB0b3IgPSBERVNDUklQVE9SUyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG52YXIgRVhJU1RTID0gaGFzT3duKEZ1bmN0aW9uUHJvdG90eXBlLCAnbmFtZScpO1xuLy8gYWRkaXRpb25hbCBwcm90ZWN0aW9uIGZyb20gbWluaWZpZWQgLyBtYW5nbGVkIC8gZHJvcHBlZCBmdW5jdGlvbiBuYW1lc1xudmFyIFBST1BFUiA9IEVYSVNUUyAmJiAoZnVuY3Rpb24gc29tZXRoaW5nKCkgeyAvKiBlbXB0eSAqLyB9KS5uYW1lID09PSAnc29tZXRoaW5nJztcbnZhciBDT05GSUdVUkFCTEUgPSBFWElTVFMgJiYgKCFERVNDUklQVE9SUyB8fCAoREVTQ1JJUFRPUlMgJiYgZ2V0RGVzY3JpcHRvcihGdW5jdGlvblByb3RvdHlwZSwgJ25hbWUnKS5jb25maWd1cmFibGUpKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEVYSVNUUzogRVhJU1RTLFxuICBQUk9QRVI6IFBST1BFUixcbiAgQ09ORklHVVJBQkxFOiBDT05GSUdVUkFCTEVcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xudmFyIGluc3BlY3RTb3VyY2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5zcGVjdC1zb3VyY2UnKTtcbnZhciBJbnRlcm5hbFN0YXRlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlJyk7XG52YXIgQ09ORklHVVJBQkxFX0ZVTkNUSU9OX05BTUUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tbmFtZScpLkNPTkZJR1VSQUJMRTtcblxudmFyIGdldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmdldDtcbnZhciBlbmZvcmNlSW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZW5mb3JjZTtcbnZhciBURU1QTEFURSA9IFN0cmluZyhTdHJpbmcpLnNwbGl0KCdTdHJpbmcnKTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHVuc2FmZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMudW5zYWZlIDogZmFsc2U7XG4gIHZhciBzaW1wbGUgPSBvcHRpb25zID8gISFvcHRpb25zLmVudW1lcmFibGUgOiBmYWxzZTtcbiAgdmFyIG5vVGFyZ2V0R2V0ID0gb3B0aW9ucyA/ICEhb3B0aW9ucy5ub1RhcmdldEdldCA6IGZhbHNlO1xuICB2YXIgbmFtZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5uYW1lICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5hbWUgOiBrZXk7XG4gIHZhciBzdGF0ZTtcbiAgaWYgKGlzQ2FsbGFibGUodmFsdWUpKSB7XG4gICAgaWYgKFN0cmluZyhuYW1lKS5zbGljZSgwLCA3KSA9PT0gJ1N5bWJvbCgnKSB7XG4gICAgICBuYW1lID0gJ1snICsgU3RyaW5nKG5hbWUpLnJlcGxhY2UoL15TeW1ib2xcXCgoW14pXSopXFwpLywgJyQxJykgKyAnXSc7XG4gICAgfVxuICAgIGlmICghaGFzT3duKHZhbHVlLCAnbmFtZScpIHx8IChDT05GSUdVUkFCTEVfRlVOQ1RJT05fTkFNRSAmJiB2YWx1ZS5uYW1lICE9PSBuYW1lKSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHZhbHVlLCAnbmFtZScsIG5hbWUpO1xuICAgIH1cbiAgICBzdGF0ZSA9IGVuZm9yY2VJbnRlcm5hbFN0YXRlKHZhbHVlKTtcbiAgICBpZiAoIXN0YXRlLnNvdXJjZSkge1xuICAgICAgc3RhdGUuc291cmNlID0gVEVNUExBVEUuam9pbih0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJyA/IG5hbWUgOiAnJyk7XG4gICAgfVxuICB9XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgICBlbHNlIHNldEdsb2JhbChrZXksIHZhbHVlKTtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAoIXVuc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gIH0gZWxzZSBpZiAoIW5vVGFyZ2V0R2V0ICYmIE9ba2V5XSkge1xuICAgIHNpbXBsZSA9IHRydWU7XG4gIH1cbiAgaWYgKHNpbXBsZSkgT1trZXldID0gdmFsdWU7XG4gIGVsc2UgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KE8sIGtleSwgdmFsdWUpO1xuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gaXNDYWxsYWJsZSh0aGlzKSAmJiBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpLnNvdXJjZSB8fCBpbnNwZWN0U291cmNlKHRoaXMpO1xufSk7XG4iLCJ2YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbi8vIGBUb0ludGVnZXJPckluZmluaXR5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9pbnRlZ2Vyb3JpbmZpbml0eVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdmFyIG51bWJlciA9ICthcmd1bWVudDtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBzYWZlXG4gIHJldHVybiBudW1iZXIgIT09IG51bWJlciB8fCBudW1iZXIgPT09IDAgPyAwIDogKG51bWJlciA+IDAgPyBmbG9vciA6IGNlaWwpKG51bWJlcik7XG59O1xuIiwidmFyIHRvSW50ZWdlck9ySW5maW5pdHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eScpO1xuXG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5cbi8vIEhlbHBlciBmb3IgYSBwb3B1bGFyIHJlcGVhdGluZyBjYXNlIG9mIHRoZSBzcGVjOlxuLy8gTGV0IGludGVnZXIgYmUgPyBUb0ludGVnZXIoaW5kZXgpLlxuLy8gSWYgaW50ZWdlciA8IDAsIGxldCByZXN1bHQgYmUgbWF4KChsZW5ndGggKyBpbnRlZ2VyKSwgMCk7IGVsc2UgbGV0IHJlc3VsdCBiZSBtaW4oaW50ZWdlciwgbGVuZ3RoKS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgdmFyIGludGVnZXIgPSB0b0ludGVnZXJPckluZmluaXR5KGluZGV4KTtcbiAgcmV0dXJuIGludGVnZXIgPCAwID8gbWF4KGludGVnZXIgKyBsZW5ndGgsIDApIDogbWluKGludGVnZXIsIGxlbmd0aCk7XG59O1xuIiwidmFyIHRvSW50ZWdlck9ySW5maW5pdHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eScpO1xuXG52YXIgbWluID0gTWF0aC5taW47XG5cbi8vIGBUb0xlbmd0aGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvbGVuZ3RoXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gYXJndW1lbnQgPiAwID8gbWluKHRvSW50ZWdlck9ySW5maW5pdHkoYXJndW1lbnQpLCAweDFGRkZGRkZGRkZGRkZGKSA6IDA7IC8vIDIgKiogNTMgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCJ2YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG5cbi8vIGBMZW5ndGhPZkFycmF5TGlrZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWxlbmd0aG9mYXJyYXlsaWtlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRvTGVuZ3RoKG9iai5sZW5ndGgpO1xufTtcbiIsInZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXgnKTtcbnZhciBsZW5ndGhPZkFycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9sZW5ndGgtb2YtYXJyYXktbGlrZScpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnsgaW5kZXhPZiwgaW5jbHVkZXMgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0luZGV4ZWRPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSBsZW5ndGhPZkFycmF5TGlrZShPKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgaWYgKChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSAmJiBPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcbiAgaW5jbHVkZXM6IGNyZWF0ZU1ldGhvZCh0cnVlKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5pbmRleE9mYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxuICBpbmRleE9mOiBjcmVhdGVNZXRob2QoZmFsc2UpXG59O1xuIiwidmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgaW5kZXhPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pbmNsdWRlcycpLmluZGV4T2Y7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSAhaGFzT3duKGhpZGRlbktleXMsIGtleSkgJiYgaGFzT3duKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhc093bihPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5pbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gSUU4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ2NvbnN0cnVjdG9yJyxcbiAgJ2hhc093blByb3BlcnR5JyxcbiAgJ2lzUHJvdG90eXBlT2YnLFxuICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAndG9Mb2NhbGVTdHJpbmcnLFxuICAndG9TdHJpbmcnLFxuICAndmFsdWVPZidcbl07XG4iLCJ2YXIgaW50ZXJuYWxPYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cycpO1xuXG52YXIgaGlkZGVuS2V5cyA9IGVudW1CdWdLZXlzLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHluYW1lc1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eW5hbWVzIC0tIHNhZmVcbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTykge1xuICByZXR1cm4gaW50ZXJuYWxPYmplY3RLZXlzKE8sIGhpZGRlbktleXMpO1xufTtcbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlzeW1ib2xzIC0tIHNhZmVcbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCJ2YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcbnZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcblxuLy8gYWxsIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBub24tZW51bWVyYWJsZSBhbmQgc3ltYm9sc1xubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCdSZWZsZWN0JywgJ293bktleXMnKSB8fCBmdW5jdGlvbiBvd25LZXlzKGl0KSB7XG4gIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZS5mKGFuT2JqZWN0KGl0KSk7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUuZjtcbiAgcmV0dXJuIGdldE93blByb3BlcnR5U3ltYm9scyA/IGtleXMuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhpdCkpIDoga2V5cztcbn07XG4iLCJ2YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBvd25LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL293bi1rZXlzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gIHZhciBrZXlzID0gb3duS2V5cyhzb3VyY2UpO1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mO1xuICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlLmY7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGlmICghaGFzT3duKHRhcmdldCwga2V5KSkgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICB9XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xuXG52YXIgcmVwbGFjZW1lbnQgPSAvI3xcXC5wcm90b3R5cGVcXC4vO1xuXG52YXIgaXNGb3JjZWQgPSBmdW5jdGlvbiAoZmVhdHVyZSwgZGV0ZWN0aW9uKSB7XG4gIHZhciB2YWx1ZSA9IGRhdGFbbm9ybWFsaXplKGZlYXR1cmUpXTtcbiAgcmV0dXJuIHZhbHVlID09IFBPTFlGSUxMID8gdHJ1ZVxuICAgIDogdmFsdWUgPT0gTkFUSVZFID8gZmFsc2VcbiAgICA6IGlzQ2FsbGFibGUoZGV0ZWN0aW9uKSA/IGZhaWxzKGRldGVjdGlvbilcbiAgICA6ICEhZGV0ZWN0aW9uO1xufTtcblxudmFyIG5vcm1hbGl6ZSA9IGlzRm9yY2VkLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVwbGFjZW1lbnQsICcuJykudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZhciBkYXRhID0gaXNGb3JjZWQuZGF0YSA9IHt9O1xudmFyIE5BVElWRSA9IGlzRm9yY2VkLk5BVElWRSA9ICdOJztcbnZhciBQT0xZRklMTCA9IGlzRm9yY2VkLlBPTFlGSUxMID0gJ1AnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRm9yY2VkO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpLmY7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgc2V0R2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC1nbG9iYWwnKTtcbnZhciBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcycpO1xudmFyIGlzRm9yY2VkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWZvcmNlZCcpO1xuXG4vKlxuICBvcHRpb25zLnRhcmdldCAgICAgIC0gbmFtZSBvZiB0aGUgdGFyZ2V0IG9iamVjdFxuICBvcHRpb25zLmdsb2JhbCAgICAgIC0gdGFyZ2V0IGlzIHRoZSBnbG9iYWwgb2JqZWN0XG4gIG9wdGlvbnMuc3RhdCAgICAgICAgLSBleHBvcnQgYXMgc3RhdGljIG1ldGhvZHMgb2YgdGFyZ2V0XG4gIG9wdGlvbnMucHJvdG8gICAgICAgLSBleHBvcnQgYXMgcHJvdG90eXBlIG1ldGhvZHMgb2YgdGFyZ2V0XG4gIG9wdGlvbnMucmVhbCAgICAgICAgLSByZWFsIHByb3RvdHlwZSBtZXRob2QgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLmZvcmNlZCAgICAgIC0gZXhwb3J0IGV2ZW4gaWYgdGhlIG5hdGl2ZSBmZWF0dXJlIGlzIGF2YWlsYWJsZVxuICBvcHRpb25zLmJpbmQgICAgICAgIC0gYmluZCBtZXRob2RzIHRvIHRoZSB0YXJnZXQsIHJlcXVpcmVkIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy53cmFwICAgICAgICAtIHdyYXAgY29uc3RydWN0b3JzIHRvIHByZXZlbnRpbmcgZ2xvYmFsIHBvbGx1dGlvbiwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLnVuc2FmZSAgICAgIC0gdXNlIHRoZSBzaW1wbGUgYXNzaWdubWVudCBvZiBwcm9wZXJ0eSBpbnN0ZWFkIG9mIGRlbGV0ZSArIGRlZmluZVByb3BlcnR5XG4gIG9wdGlvbnMuc2hhbSAgICAgICAgLSBhZGQgYSBmbGFnIHRvIG5vdCBjb21wbGV0ZWx5IGZ1bGwgcG9seWZpbGxzXG4gIG9wdGlvbnMuZW51bWVyYWJsZSAgLSBleHBvcnQgYXMgZW51bWVyYWJsZSBwcm9wZXJ0eVxuICBvcHRpb25zLm5vVGFyZ2V0R2V0IC0gcHJldmVudCBjYWxsaW5nIGEgZ2V0dGVyIG9uIHRhcmdldFxuICBvcHRpb25zLm5hbWUgICAgICAgIC0gdGhlIC5uYW1lIG9mIHRoZSBmdW5jdGlvbiBpZiBpdCBkb2VzIG5vdCBtYXRjaCB0aGUga2V5XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucywgc291cmNlKSB7XG4gIHZhciBUQVJHRVQgPSBvcHRpb25zLnRhcmdldDtcbiAgdmFyIEdMT0JBTCA9IG9wdGlvbnMuZ2xvYmFsO1xuICB2YXIgU1RBVElDID0gb3B0aW9ucy5zdGF0O1xuICB2YXIgRk9SQ0VELCB0YXJnZXQsIGtleSwgdGFyZ2V0UHJvcGVydHksIHNvdXJjZVByb3BlcnR5LCBkZXNjcmlwdG9yO1xuICBpZiAoR0xPQkFMKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFNUQVRJQykge1xuICAgIHRhcmdldCA9IGdsb2JhbFtUQVJHRVRdIHx8IHNldEdsb2JhbChUQVJHRVQsIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSAoZ2xvYmFsW1RBUkdFVF0gfHwge30pLnByb3RvdHlwZTtcbiAgfVxuICBpZiAodGFyZ2V0KSBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtrZXldO1xuICAgIGlmIChvcHRpb25zLm5vVGFyZ2V0R2V0KSB7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIHRhcmdldFByb3BlcnR5ID0gZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH0gZWxzZSB0YXJnZXRQcm9wZXJ0eSA9IHRhcmdldFtrZXldO1xuICAgIEZPUkNFRCA9IGlzRm9yY2VkKEdMT0JBTCA/IGtleSA6IFRBUkdFVCArIChTVEFUSUMgPyAnLicgOiAnIycpICsga2V5LCBvcHRpb25zLmZvcmNlZCk7XG4gICAgLy8gY29udGFpbmVkIGluIHRhcmdldFxuICAgIGlmICghRk9SQ0VEICYmIHRhcmdldFByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc291cmNlUHJvcGVydHkgPT09IHR5cGVvZiB0YXJnZXRQcm9wZXJ0eSkgY29udGludWU7XG4gICAgICBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzKHNvdXJjZVByb3BlcnR5LCB0YXJnZXRQcm9wZXJ0eSk7XG4gICAgfVxuICAgIC8vIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgICBpZiAob3B0aW9ucy5zaGFtIHx8ICh0YXJnZXRQcm9wZXJ0eSAmJiB0YXJnZXRQcm9wZXJ0eS5zaGFtKSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHNvdXJjZVByb3BlcnR5LCAnc2hhbScsIHRydWUpO1xuICAgIH1cbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNvdXJjZVByb3BlcnR5LCBvcHRpb25zKTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSkge1xuICBpZiAoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgcmV0dXJuIGl0O1xuICB0aHJvdyBUeXBlRXJyb3IoJ0luY29ycmVjdCAnICsgKG5hbWUgPyBuYW1lICsgJyAnIDogJycpICsgJ2ludm9jYXRpb24nKTtcbn07XG4iLCJ2YXIgaW50ZXJuYWxPYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cycpO1xuXG4vLyBgT2JqZWN0LmtleXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3Qua2V5c1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1rZXlzIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBvYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzJyk7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydGllc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0aWVzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnRpZXMgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IG9iamVjdEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKE8sIGtleSA9IGtleXNbaW5kZXgrK10sIFByb3BlcnRpZXNba2V5XSk7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ2RvY3VtZW50JywgJ2RvY3VtZW50RWxlbWVudCcpO1xuIiwiLyogZ2xvYmFsIEFjdGl2ZVhPYmplY3QgLS0gb2xkIElFLCBXU0ggKi9cbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBkZWZpbmVQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydGllcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9odG1sJyk7XG52YXIgZG9jdW1lbnRDcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcblxudmFyIEdUID0gJz4nO1xudmFyIExUID0gJzwnO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIFNDUklQVCA9ICdzY3JpcHQnO1xudmFyIElFX1BST1RPID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xuXG52YXIgRW1wdHlDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcblxudmFyIHNjcmlwdFRhZyA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG4gIHJldHVybiBMVCArIFNDUklQVCArIEdUICsgY29udGVudCArIExUICsgJy8nICsgU0NSSVBUICsgR1Q7XG59O1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgQWN0aXZlWCBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIE51bGxQcm90b09iamVjdFZpYUFjdGl2ZVggPSBmdW5jdGlvbiAoYWN0aXZlWERvY3VtZW50KSB7XG4gIGFjdGl2ZVhEb2N1bWVudC53cml0ZShzY3JpcHRUYWcoJycpKTtcbiAgYWN0aXZlWERvY3VtZW50LmNsb3NlKCk7XG4gIHZhciB0ZW1wID0gYWN0aXZlWERvY3VtZW50LnBhcmVudFdpbmRvdy5PYmplY3Q7XG4gIGFjdGl2ZVhEb2N1bWVudCA9IG51bGw7IC8vIGF2b2lkIG1lbW9yeSBsZWFrXG4gIHJldHVybiB0ZW1wO1xufTtcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIE51bGxQcm90b09iamVjdFZpYUlGcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50Q3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gIHZhciBKUyA9ICdqYXZhJyArIFNDUklQVCArICc6JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgaHRtbC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvNDc1XG4gIGlmcmFtZS5zcmMgPSBTdHJpbmcoSlMpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKHNjcmlwdFRhZygnZG9jdW1lbnQuRj1PYmplY3QnKSk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIHJldHVybiBpZnJhbWVEb2N1bWVudC5GO1xufTtcblxuLy8gQ2hlY2sgZm9yIGRvY3VtZW50LmRvbWFpbiBhbmQgYWN0aXZlIHggc3VwcG9ydFxuLy8gTm8gbmVlZCB0byB1c2UgYWN0aXZlIHggYXBwcm9hY2ggd2hlbiBkb2N1bWVudC5kb21haW4gaXMgbm90IHNldFxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMTUwXG4vLyB2YXJpYXRpb24gb2YgaHR0cHM6Ly9naXRodWIuY29tL2tpdGNhbWJyaWRnZS9lczUtc2hpbS9jb21taXQvNGY3MzhhYzA2NjM0NlxuLy8gYXZvaWQgSUUgR0MgYnVnXG52YXIgYWN0aXZlWERvY3VtZW50O1xudmFyIE51bGxQcm90b09iamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICBhY3RpdmVYRG9jdW1lbnQgPSBuZXcgQWN0aXZlWE9iamVjdCgnaHRtbGZpbGUnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogaWdub3JlICovIH1cbiAgTnVsbFByb3RvT2JqZWN0ID0gdHlwZW9mIGRvY3VtZW50ICE9ICd1bmRlZmluZWQnXG4gICAgPyBkb2N1bWVudC5kb21haW4gJiYgYWN0aXZlWERvY3VtZW50XG4gICAgICA/IE51bGxQcm90b09iamVjdFZpYUFjdGl2ZVgoYWN0aXZlWERvY3VtZW50KSAvLyBvbGQgSUVcbiAgICAgIDogTnVsbFByb3RvT2JqZWN0VmlhSUZyYW1lKClcbiAgICA6IE51bGxQcm90b09iamVjdFZpYUFjdGl2ZVgoYWN0aXZlWERvY3VtZW50KTsgLy8gV1NIXG4gIHZhciBsZW5ndGggPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkgZGVsZXRlIE51bGxQcm90b09iamVjdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2xlbmd0aF1dO1xuICByZXR1cm4gTnVsbFByb3RvT2JqZWN0KCk7XG59O1xuXG5oaWRkZW5LZXlzW0lFX1BST1RPXSA9IHRydWU7XG5cbi8vIGBPYmplY3QuY3JlYXRlYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmNyZWF0ZVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlDb25zdHJ1Y3RvcltQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5Q29uc3RydWN0b3IoKTtcbiAgICBFbXB0eUNvbnN0cnVjdG9yW1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IE51bGxQcm90b09iamVjdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZGVmaW5lUHJvcGVydGllcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEYoKSB7IC8qIGVtcHR5ICovIH1cbiAgRi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBudWxsO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldHByb3RvdHlwZW9mIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YobmV3IEYoKSkgIT09IEYucHJvdG90eXBlO1xufSk7XG4iLCJ2YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcbnZhciBDT1JSRUNUX1BST1RPVFlQRV9HRVRURVIgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY29ycmVjdC1wcm90b3R5cGUtZ2V0dGVyJyk7XG5cbnZhciBJRV9QUk9UTyA9IHNoYXJlZEtleSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlO1xuXG4vLyBgT2JqZWN0LmdldFByb3RvdHlwZU9mYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmdldHByb3RvdHlwZW9mXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldHByb3RvdHlwZW9mIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gQ09SUkVDVF9QUk9UT1RZUEVfR0VUVEVSID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gKE8pIHtcbiAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzT3duKG9iamVjdCwgSUVfUFJPVE8pKSByZXR1cm4gb2JqZWN0W0lFX1BST1RPXTtcbiAgdmFyIGNvbnN0cnVjdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBpZiAoaXNDYWxsYWJsZShjb25zdHJ1Y3RvcikgJiYgb2JqZWN0IGluc3RhbmNlb2YgY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90b3R5cGUgOiBudWxsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZScpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtcHJvdG90eXBlLW9mJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcblxudmFyIElURVJBVE9SID0gd2VsbEtub3duU3ltYm9sKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMgPSBmYWxzZTtcblxuLy8gYCVJdGVyYXRvclByb3RvdHlwZSVgIG9iamVjdFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0laXRlcmF0b3Jwcm90b3R5cGUlLW9iamVjdFxudmFyIEl0ZXJhdG9yUHJvdG90eXBlLCBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGUsIGFycmF5SXRlcmF0b3I7XG5cbi8qIGVzbGludC1kaXNhYmxlIGVzL25vLWFycmF5LXByb3RvdHlwZS1rZXlzIC0tIHNhZmUgKi9cbmlmIChbXS5rZXlzKSB7XG4gIGFycmF5SXRlcmF0b3IgPSBbXS5rZXlzKCk7XG4gIC8vIFNhZmFyaSA4IGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICBpZiAoISgnbmV4dCcgaW4gYXJyYXlJdGVyYXRvcikpIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMgPSB0cnVlO1xuICBlbHNlIHtcbiAgICBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZihnZXRQcm90b3R5cGVPZihhcnJheUl0ZXJhdG9yKSk7XG4gICAgaWYgKFByb3RvdHlwZU9mQXJyYXlJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSkgSXRlcmF0b3JQcm90b3R5cGUgPSBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cbn1cblxudmFyIE5FV19JVEVSQVRPUl9QUk9UT1RZUEUgPSBJdGVyYXRvclByb3RvdHlwZSA9PSB1bmRlZmluZWQgfHwgZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgdGVzdCA9IHt9O1xuICAvLyBGRjQ0LSBsZWdhY3kgaXRlcmF0b3JzIGNhc2VcbiAgcmV0dXJuIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXS5jYWxsKHRlc3QpICE9PSB0ZXN0O1xufSk7XG5cbmlmIChORVdfSVRFUkFUT1JfUFJPVE9UWVBFKSBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuZWxzZSBpZiAoSVNfUFVSRSkgSXRlcmF0b3JQcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuXG4vLyBgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJWl0ZXJhdG9ycHJvdG90eXBlJS1AQGl0ZXJhdG9yXG5pZiAoIWlzQ2FsbGFibGUoSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdKSkge1xuICByZWRlZmluZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBJdGVyYXRvclByb3RvdHlwZTogSXRlcmF0b3JQcm90b3R5cGUsXG4gIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlM6IEJVR0dZX1NBRkFSSV9JVEVSQVRPUlNcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1pdGVyYXRvci1oZWxwZXJzXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1pbnN0YW5jZScpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9ycy1jb3JlJykuSXRlcmF0b3JQcm90b3R5cGU7XG52YXIgSVNfUFVSRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1wdXJlJyk7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xuXG52YXIgTmF0aXZlSXRlcmF0b3IgPSBnbG9iYWwuSXRlcmF0b3I7XG5cbi8vIEZGNTYtIGhhdmUgbm9uLXN0YW5kYXJkIGdsb2JhbCBoZWxwZXIgYEl0ZXJhdG9yYFxudmFyIEZPUkNFRCA9IElTX1BVUkVcbiAgfHwgIWlzQ2FsbGFibGUoTmF0aXZlSXRlcmF0b3IpXG4gIHx8IE5hdGl2ZUl0ZXJhdG9yLnByb3RvdHlwZSAhPT0gSXRlcmF0b3JQcm90b3R5cGVcbiAgLy8gRkY0NC0gbm9uLXN0YW5kYXJkIGBJdGVyYXRvcmAgcGFzc2VzIHByZXZpb3VzIHRlc3RzXG4gIHx8ICFmYWlscyhmdW5jdGlvbiAoKSB7IE5hdGl2ZUl0ZXJhdG9yKHt9KTsgfSk7XG5cbnZhciBJdGVyYXRvckNvbnN0cnVjdG9yID0gZnVuY3Rpb24gSXRlcmF0b3IoKSB7XG4gIGFuSW5zdGFuY2UodGhpcywgSXRlcmF0b3JDb25zdHJ1Y3Rvcik7XG59O1xuXG5pZiAoIWhhc093bihJdGVyYXRvclByb3RvdHlwZSwgVE9fU1RSSU5HX1RBRykpIHtcbiAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KEl0ZXJhdG9yUHJvdG90eXBlLCBUT19TVFJJTkdfVEFHLCAnSXRlcmF0b3InKTtcbn1cblxuaWYgKEZPUkNFRCB8fCAhaGFzT3duKEl0ZXJhdG9yUHJvdG90eXBlLCAnY29uc3RydWN0b3InKSB8fCBJdGVyYXRvclByb3RvdHlwZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShJdGVyYXRvclByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgSXRlcmF0b3JDb25zdHJ1Y3Rvcik7XG59XG5cbkl0ZXJhdG9yQ29uc3RydWN0b3IucHJvdG90eXBlID0gSXRlcmF0b3JQcm90b3R5cGU7XG5cbiQoeyBnbG9iYWw6IHRydWUsIGZvcmNlZDogRk9SQ0VEIH0sIHtcbiAgSXRlcmF0b3I6IEl0ZXJhdG9yQ29uc3RydWN0b3Jcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzJyk7XG5cbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvdHlwZSA9IEFycmF5LnByb3RvdHlwZTtcblxuLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b3R5cGVbSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwidmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG5cbi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhQ2FsbGFibGUoZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCk7XG4gICAgfTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJ2YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xudmFyIHRlc3QgPSB7fTtcblxudGVzdFtUT19TVFJJTkdfVEFHXSA9ICd6JztcblxubW9kdWxlLmV4cG9ydHMgPSBTdHJpbmcodGVzdCkgPT09ICdbb2JqZWN0IHpdJztcbiIsInZhciBUT19TVFJJTkdfVEFHX1NVUFBPUlQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0Jyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGNsYXNzb2ZSYXcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFRPX1NUUklOR19UQUcgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIENPUlJFQ1RfQVJHVU1FTlRTID0gY2xhc3NvZlJhdyhmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxufTtcblxuLy8gZ2V0dGluZyB0YWcgZnJvbSBFUzYrIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYFxubW9kdWxlLmV4cG9ydHMgPSBUT19TVFJJTkdfVEFHX1NVUFBPUlQgPyBjbGFzc29mUmF3IDogZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCB0YWcsIHJlc3VsdDtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKHRhZyA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVE9fU1RSSU5HX1RBRykpID09ICdzdHJpbmcnID8gdGFnXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBDT1JSRUNUX0FSR1VNRU5UUyA/IGNsYXNzb2ZSYXcoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAocmVzdWx0ID0gY2xhc3NvZlJhdyhPKSkgPT0gJ09iamVjdCcgJiYgaXNDYWxsYWJsZShPLmNhbGxlZSkgPyAnQXJndW1lbnRzJyA6IHJlc3VsdDtcbn07XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mJyk7XG52YXIgZ2V0TWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1tZXRob2QnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGdldE1ldGhvZChpdCwgSVRFUkFUT1IpXG4gICAgfHwgZ2V0TWV0aG9kKGl0LCAnQEBpdGVyYXRvcicpXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCJ2YXIgYUNhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtY2FsbGFibGUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBnZXRJdGVyYXRvck1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50LCB1c2luZ0l0ZXJhdG9yKSB7XG4gIHZhciBpdGVyYXRvck1ldGhvZCA9IGFyZ3VtZW50cy5sZW5ndGggPCAyID8gZ2V0SXRlcmF0b3JNZXRob2QoYXJndW1lbnQpIDogdXNpbmdJdGVyYXRvcjtcbiAgaWYgKGFDYWxsYWJsZShpdGVyYXRvck1ldGhvZCkpIHJldHVybiBhbk9iamVjdChpdGVyYXRvck1ldGhvZC5jYWxsKGFyZ3VtZW50KSk7XG4gIHRocm93IFR5cGVFcnJvcihTdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgaXRlcmFibGUnKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgZ2V0TWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1tZXRob2QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGtpbmQsIHZhbHVlKSB7XG4gIHZhciBpbm5lclJlc3VsdCwgaW5uZXJFcnJvcjtcbiAgYW5PYmplY3QoaXRlcmF0b3IpO1xuICB0cnkge1xuICAgIGlubmVyUmVzdWx0ID0gZ2V0TWV0aG9kKGl0ZXJhdG9yLCAncmV0dXJuJyk7XG4gICAgaWYgKCFpbm5lclJlc3VsdCkge1xuICAgICAgaWYgKGtpbmQgPT09ICd0aHJvdycpIHRocm93IHZhbHVlO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpbm5lclJlc3VsdCA9IGlubmVyUmVzdWx0LmNhbGwoaXRlcmF0b3IpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlubmVyRXJyb3IgPSB0cnVlO1xuICAgIGlubmVyUmVzdWx0ID0gZXJyb3I7XG4gIH1cbiAgaWYgKGtpbmQgPT09ICd0aHJvdycpIHRocm93IHZhbHVlO1xuICBpZiAoaW5uZXJFcnJvcikgdGhyb3cgaW5uZXJSZXN1bHQ7XG4gIGFuT2JqZWN0KGlubmVyUmVzdWx0KTtcbiAgcmV0dXJuIHZhbHVlO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBpc0FycmF5SXRlcmF0b3JNZXRob2QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtYXJyYXktaXRlcmF0b3ItbWV0aG9kJyk7XG52YXIgbGVuZ3RoT2ZBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbGVuZ3RoLW9mLWFycmF5LWxpa2UnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtY29udGV4dCcpO1xudmFyIGdldEl0ZXJhdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1pdGVyYXRvcicpO1xudmFyIGdldEl0ZXJhdG9yTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBpdGVyYXRvckNsb3NlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9yLWNsb3NlJyk7XG5cbnZhciBSZXN1bHQgPSBmdW5jdGlvbiAoc3RvcHBlZCwgcmVzdWx0KSB7XG4gIHRoaXMuc3RvcHBlZCA9IHN0b3BwZWQ7XG4gIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmFibGUsIHVuYm91bmRGdW5jdGlvbiwgb3B0aW9ucykge1xuICB2YXIgdGhhdCA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aGF0O1xuICB2YXIgQVNfRU5UUklFUyA9ICEhKG9wdGlvbnMgJiYgb3B0aW9ucy5BU19FTlRSSUVTKTtcbiAgdmFyIElTX0lURVJBVE9SID0gISEob3B0aW9ucyAmJiBvcHRpb25zLklTX0lURVJBVE9SKTtcbiAgdmFyIElOVEVSUlVQVEVEID0gISEob3B0aW9ucyAmJiBvcHRpb25zLklOVEVSUlVQVEVEKTtcbiAgdmFyIGZuID0gYmluZCh1bmJvdW5kRnVuY3Rpb24sIHRoYXQsIDEgKyBBU19FTlRSSUVTICsgSU5URVJSVVBURUQpO1xuICB2YXIgaXRlcmF0b3IsIGl0ZXJGbiwgaW5kZXgsIGxlbmd0aCwgcmVzdWx0LCBuZXh0LCBzdGVwO1xuXG4gIHZhciBzdG9wID0gZnVuY3Rpb24gKGNvbmRpdGlvbikge1xuICAgIGlmIChpdGVyYXRvcikgaXRlcmF0b3JDbG9zZShpdGVyYXRvciwgJ25vcm1hbCcsIGNvbmRpdGlvbik7XG4gICAgcmV0dXJuIG5ldyBSZXN1bHQodHJ1ZSwgY29uZGl0aW9uKTtcbiAgfTtcblxuICB2YXIgY2FsbEZuID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKEFTX0VOVFJJRVMpIHtcbiAgICAgIGFuT2JqZWN0KHZhbHVlKTtcbiAgICAgIHJldHVybiBJTlRFUlJVUFRFRCA/IGZuKHZhbHVlWzBdLCB2YWx1ZVsxXSwgc3RvcCkgOiBmbih2YWx1ZVswXSwgdmFsdWVbMV0pO1xuICAgIH0gcmV0dXJuIElOVEVSUlVQVEVEID8gZm4odmFsdWUsIHN0b3ApIDogZm4odmFsdWUpO1xuICB9O1xuXG4gIGlmIChJU19JVEVSQVRPUikge1xuICAgIGl0ZXJhdG9yID0gaXRlcmFibGU7XG4gIH0gZWxzZSB7XG4gICAgaXRlckZuID0gZ2V0SXRlcmF0b3JNZXRob2QoaXRlcmFibGUpO1xuICAgIGlmICghaXRlckZuKSB0aHJvdyBUeXBlRXJyb3IoU3RyaW5nKGl0ZXJhYmxlKSArICcgaXMgbm90IGl0ZXJhYmxlJyk7XG4gICAgLy8gb3B0aW1pc2F0aW9uIGZvciBhcnJheSBpdGVyYXRvcnNcbiAgICBpZiAoaXNBcnJheUl0ZXJhdG9yTWV0aG9kKGl0ZXJGbikpIHtcbiAgICAgIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBsZW5ndGhPZkFycmF5TGlrZShpdGVyYWJsZSk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIHJlc3VsdCA9IGNhbGxGbihpdGVyYWJsZVtpbmRleF0pO1xuICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdCBpbnN0YW5jZW9mIFJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0gcmV0dXJuIG5ldyBSZXN1bHQoZmFsc2UpO1xuICAgIH1cbiAgICBpdGVyYXRvciA9IGdldEl0ZXJhdG9yKGl0ZXJhYmxlLCBpdGVyRm4pO1xuICB9XG5cbiAgbmV4dCA9IGl0ZXJhdG9yLm5leHQ7XG4gIHdoaWxlICghKHN0ZXAgPSBuZXh0LmNhbGwoaXRlcmF0b3IpKS5kb25lKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGNhbGxGbihzdGVwLnZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaXRlcmF0b3JDbG9zZShpdGVyYXRvciwgJ3Rocm93JywgZXJyb3IpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAnb2JqZWN0JyAmJiByZXN1bHQgJiYgcmVzdWx0IGluc3RhbmNlb2YgUmVzdWx0KSByZXR1cm4gcmVzdWx0O1xuICB9IHJldHVybiBuZXcgUmVzdWx0KGZhbHNlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1pdGVyYXRvci1oZWxwZXJzXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBpdGVyYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdGUnKTtcbnZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG4kKHsgdGFyZ2V0OiAnSXRlcmF0b3InLCBwcm90bzogdHJ1ZSwgcmVhbDogdHJ1ZSB9LCB7XG4gIGZpbmQ6IGZ1bmN0aW9uIGZpbmQoZm4pIHtcbiAgICBhbk9iamVjdCh0aGlzKTtcbiAgICBhQ2FsbGFibGUoZm4pO1xuICAgIHJldHVybiBpdGVyYXRlKHRoaXMsIGZ1bmN0aW9uICh2YWx1ZSwgc3RvcCkge1xuICAgICAgaWYgKGZuKHZhbHVlKSkgcmV0dXJuIHN0b3AodmFsdWUpO1xuICAgIH0sIHsgSVNfSVRFUkFUT1I6IHRydWUsIElOVEVSUlVQVEVEOiB0cnVlIH0pLnJlc3VsdDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1pdGVyYXRvci1oZWxwZXJzXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBpdGVyYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdGUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcblxuJCh7IHRhcmdldDogJ0l0ZXJhdG9yJywgcHJvdG86IHRydWUsIHJlYWw6IHRydWUgfSwge1xuICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gICAgaXRlcmF0ZShhbk9iamVjdCh0aGlzKSwgZm4sIHsgSVNfSVRFUkFUT1I6IHRydWUgfSk7XG4gIH1cbn0pO1xuIiwidmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBvcHRpb25zKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBzcmNba2V5XSwgb3B0aW9ucyk7XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1jcmVhdGUnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUtYWxsJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xudmFyIGdldE1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtbWV0aG9kJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzLWNvcmUnKS5JdGVyYXRvclByb3RvdHlwZTtcblxudmFyIHNldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLnNldDtcbnZhciBnZXRJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5nZXQ7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuZXh0SGFuZGxlciwgSVNfSVRFUkFUT1IpIHtcbiAgdmFyIEl0ZXJhdG9yUHJveHkgPSBmdW5jdGlvbiBJdGVyYXRvcihzdGF0ZSkge1xuICAgIHN0YXRlLm5leHQgPSBhQ2FsbGFibGUoc3RhdGUuaXRlcmF0b3IubmV4dCk7XG4gICAgc3RhdGUuZG9uZSA9IGZhbHNlO1xuICAgIHN0YXRlLmlnbm9yZUFyZyA9ICFJU19JVEVSQVRPUjtcbiAgICBzZXRJbnRlcm5hbFN0YXRlKHRoaXMsIHN0YXRlKTtcbiAgfTtcblxuICBJdGVyYXRvclByb3h5LnByb3RvdHlwZSA9IHJlZGVmaW5lQWxsKGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSksIHtcbiAgICBuZXh0OiBmdW5jdGlvbiBuZXh0KGFyZykge1xuICAgICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxTdGF0ZSh0aGlzKTtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA/IFtzdGF0ZS5pZ25vcmVBcmcgPyB1bmRlZmluZWQgOiBhcmddIDogSVNfSVRFUkFUT1IgPyBbXSA6IFt1bmRlZmluZWRdO1xuICAgICAgc3RhdGUuaWdub3JlQXJnID0gZmFsc2U7XG4gICAgICB2YXIgcmVzdWx0ID0gc3RhdGUuZG9uZSA/IHVuZGVmaW5lZCA6IG5leHRIYW5kbGVyLmNhbGwoc3RhdGUsIGFyZ3MpO1xuICAgICAgcmV0dXJuIHsgZG9uZTogc3RhdGUuZG9uZSwgdmFsdWU6IHJlc3VsdCB9O1xuICAgIH0sXG4gICAgJ3JldHVybic6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxTdGF0ZSh0aGlzKTtcbiAgICAgIHZhciBpdGVyYXRvciA9IHN0YXRlLml0ZXJhdG9yO1xuICAgICAgc3RhdGUuZG9uZSA9IHRydWU7XG4gICAgICB2YXIgJCRyZXR1cm4gPSBnZXRNZXRob2QoaXRlcmF0b3IsICdyZXR1cm4nKTtcbiAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiAkJHJldHVybiA/IGFuT2JqZWN0KCQkcmV0dXJuLmNhbGwoaXRlcmF0b3IsIHZhbHVlKSkudmFsdWUgOiB2YWx1ZSB9O1xuICAgIH0sXG4gICAgJ3Rocm93JzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpO1xuICAgICAgdmFyIGl0ZXJhdG9yID0gc3RhdGUuaXRlcmF0b3I7XG4gICAgICBzdGF0ZS5kb25lID0gdHJ1ZTtcbiAgICAgIHZhciAkJHRocm93ID0gZ2V0TWV0aG9kKGl0ZXJhdG9yLCAndGhyb3cnKTtcbiAgICAgIGlmICgkJHRocm93KSByZXR1cm4gJCR0aHJvdy5jYWxsKGl0ZXJhdG9yLCB2YWx1ZSk7XG4gICAgICB0aHJvdyB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmICghSVNfSVRFUkFUT1IpIHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoSXRlcmF0b3JQcm94eS5wcm90b3R5cGUsIFRPX1NUUklOR19UQUcsICdHZW5lcmF0b3InKTtcbiAgfVxuXG4gIHJldHVybiBJdGVyYXRvclByb3h5O1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBpdGVyYXRvckNsb3NlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9yLWNsb3NlJyk7XG5cbi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3Jcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIEVOVFJJRVMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gRU5UUklFUyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsICd0aHJvdycsIGVycm9yKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWl0ZXJhdG9yLWhlbHBlcnNcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgY3JlYXRlSXRlcmF0b3JQcm94eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRvci1jcmVhdGUtcHJveHknKTtcbnZhciBjYWxsV2l0aFNhZmVJdGVyYXRpb25DbG9zaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NhbGwtd2l0aC1zYWZlLWl0ZXJhdGlvbi1jbG9zaW5nJyk7XG5cbnZhciBJdGVyYXRvclByb3h5ID0gY3JlYXRlSXRlcmF0b3JQcm94eShmdW5jdGlvbiAoYXJncykge1xuICB2YXIgaXRlcmF0b3IgPSB0aGlzLml0ZXJhdG9yO1xuICB2YXIgcmVzdWx0ID0gYW5PYmplY3QodGhpcy5uZXh0LmFwcGx5KGl0ZXJhdG9yLCBhcmdzKSk7XG4gIHZhciBkb25lID0gdGhpcy5kb25lID0gISFyZXN1bHQuZG9uZTtcbiAgaWYgKCFkb25lKSByZXR1cm4gY2FsbFdpdGhTYWZlSXRlcmF0aW9uQ2xvc2luZyhpdGVyYXRvciwgdGhpcy5tYXBwZXIsIHJlc3VsdC52YWx1ZSk7XG59KTtcblxuJCh7IHRhcmdldDogJ0l0ZXJhdG9yJywgcHJvdG86IHRydWUsIHJlYWw6IHRydWUgfSwge1xuICBtYXA6IGZ1bmN0aW9uIG1hcChtYXBwZXIpIHtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yUHJveHkoe1xuICAgICAgaXRlcmF0b3I6IGFuT2JqZWN0KHRoaXMpLFxuICAgICAgbWFwcGVyOiBhQ2FsbGFibGUobWFwcGVyKVxuICAgIH0pO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWl0ZXJhdG9yLWhlbHBlcnNcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgY3JlYXRlSXRlcmF0b3JQcm94eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRvci1jcmVhdGUtcHJveHknKTtcbnZhciBjYWxsV2l0aFNhZmVJdGVyYXRpb25DbG9zaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NhbGwtd2l0aC1zYWZlLWl0ZXJhdGlvbi1jbG9zaW5nJyk7XG5cbnZhciBJdGVyYXRvclByb3h5ID0gY3JlYXRlSXRlcmF0b3JQcm94eShmdW5jdGlvbiAoYXJncykge1xuICB2YXIgaXRlcmF0b3IgPSB0aGlzLml0ZXJhdG9yO1xuICB2YXIgZmlsdGVyZXIgPSB0aGlzLmZpbHRlcmVyO1xuICB2YXIgbmV4dCA9IHRoaXMubmV4dDtcbiAgdmFyIHJlc3VsdCwgZG9uZSwgdmFsdWU7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgcmVzdWx0ID0gYW5PYmplY3QobmV4dC5hcHBseShpdGVyYXRvciwgYXJncykpO1xuICAgIGRvbmUgPSB0aGlzLmRvbmUgPSAhIXJlc3VsdC5kb25lO1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgaWYgKGNhbGxXaXRoU2FmZUl0ZXJhdGlvbkNsb3NpbmcoaXRlcmF0b3IsIGZpbHRlcmVyLCB2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgfVxufSk7XG5cbiQoeyB0YXJnZXQ6ICdJdGVyYXRvcicsIHByb3RvOiB0cnVlLCByZWFsOiB0cnVlIH0sIHtcbiAgZmlsdGVyOiBmdW5jdGlvbiBmaWx0ZXIoZmlsdGVyZXIpIHtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yUHJveHkoe1xuICAgICAgaXRlcmF0b3I6IGFuT2JqZWN0KHRoaXMpLFxuICAgICAgZmlsdGVyZXI6IGFDYWxsYWJsZShmaWx0ZXJlcilcbiAgICB9KTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1pdGVyYXRvci1oZWxwZXJzXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBpdGVyYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdGUnKTtcbnZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG4kKHsgdGFyZ2V0OiAnSXRlcmF0b3InLCBwcm90bzogdHJ1ZSwgcmVhbDogdHJ1ZSB9LCB7XG4gIHNvbWU6IGZ1bmN0aW9uIHNvbWUoZm4pIHtcbiAgICBhbk9iamVjdCh0aGlzKTtcbiAgICBhQ2FsbGFibGUoZm4pO1xuICAgIHJldHVybiBpdGVyYXRlKHRoaXMsIGZ1bmN0aW9uICh2YWx1ZSwgc3RvcCkge1xuICAgICAgaWYgKGZuKHZhbHVlKSkgcmV0dXJuIHN0b3AoKTtcbiAgICB9LCB7IElTX0lURVJBVE9SOiB0cnVlLCBJTlRFUlJVUFRFRDogdHJ1ZSB9KS5zdG9wcGVkO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWl0ZXJhdG9yLWhlbHBlcnNcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGl0ZXJhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0ZScpO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG5cbiQoeyB0YXJnZXQ6ICdJdGVyYXRvcicsIHByb3RvOiB0cnVlLCByZWFsOiB0cnVlIH0sIHtcbiAgcmVkdWNlOiBmdW5jdGlvbiByZWR1Y2UocmVkdWNlciAvKiAsIGluaXRpYWxWYWx1ZSAqLykge1xuICAgIGFuT2JqZWN0KHRoaXMpO1xuICAgIGFDYWxsYWJsZShyZWR1Y2VyKTtcbiAgICB2YXIgbm9Jbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA8IDI7XG4gICAgdmFyIGFjY3VtdWxhdG9yID0gbm9Jbml0aWFsID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzFdO1xuICAgIGl0ZXJhdGUodGhpcywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAobm9Jbml0aWFsKSB7XG4gICAgICAgIG5vSW5pdGlhbCA9IGZhbHNlO1xuICAgICAgICBhY2N1bXVsYXRvciA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWNjdW11bGF0b3IgPSByZWR1Y2VyKGFjY3VtdWxhdG9yLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSwgeyBJU19JVEVSQVRPUjogdHJ1ZSB9KTtcbiAgICBpZiAobm9Jbml0aWFsKSB0aHJvdyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBpdGVyYXRvciB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgUXVlc3Rpb24gfSBmcm9tICcuL2Fuc3dlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvbXB0R2VuZXJhdG9yIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGZvcm1hdFF1ZXN0aW9ucyhxdWVzdGlvbnM6IFF1ZXN0aW9uW10pOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBxdWVzdGlvbnMubWFwKHEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcXVlc3Rpb25UZXh0ID0gYCR7cS5pbmRleH0uICR7cS5jb250ZW50fWA7XHJcbiAgICAgICAgICAgIGlmIChxLm9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uVGV4dCArPSAnXFxuJyArIHEub3B0aW9ucy5tYXAob3B0ID0+IGAgICAke29wdH1gKS5qb2luKCdcXG4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDmt7vliqDloavnqbrpopgv566A562U6aKY55qE5qCH6K+GXHJcbiAgICAgICAgICAgIGlmIChxLnR5cGUgPT09ICd0ZXh0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHEuYmxhbmtzICYmIHEuYmxhbmtzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvblRleHQgKz0gYFxcbiAgIFvloavnqbrpopjvvIzlhbEke3EuYmxhbmtzLmxlbmd0aH3kuKrnqbpdYDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25UZXh0ICs9ICdcXG4gICBb566A562U6aKYXSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9uVGV4dDtcclxuICAgICAgICB9KS5qb2luKCdcXG5cXG4nKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRRdWVzdGlvblR5cGVJbnN0cnVjdGlvbnMoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYFxyXG7or7fku5Tnu4bpmIXor7vmr4/pgZPpopjnm67vvIznoa7kv53nrZTmoYjnmoTlh4bnoa7mgKfjgILlroHlj6/lpJroirHml7bpl7TmgJ3ogIPvvIzkuZ/kuI3opoHkuLrkuobpgJ/luqbogIznibrnibLmraPnoa7njofjgIJcclxuXHJcbuWbnuetlOimgeaxgu+8mlxyXG4xLiDlr7nkuo7pgInmi6npopjvvIzor7fku5Tnu4bliIbmnpDmr4/kuKrpgInpobnvvIznoa7kv53pgInmi6nmnIDlh4bnoa7nmoTnrZTmoYjjgIJcclxuMi4g5a+55LqO5Yik5pat6aKY77yM6K+36K+m57uG5oCd6ICD5ZCO5YaN5Yik5pat5q2j6K+v77yM5LiN6KaB6L275piT5LiL57uT6K6644CCXHJcbjMuIOWvueS6juWhq+epuumimO+8jOivt+azqOaEj+epuueahOaVsOmHj++8jOaMiemhuuW6j+Whq+WGmeavj+S4quepuueahOetlOahiOOAglxyXG40LiDlr7nkuo7nroDnrZTpopjvvIzor7fnu5nlh7rlrozmlbTjgIHlh4bnoa7nmoTnrZTmoYjjgIJcclxuNS4g5aaC5p6c5a+55p+Q6YGT6aKY55uu5rKh5pyJ5a6M5YWo5oqK5o+h77yM5Y+v5Lul6Lez6L+H6K+l6aKY77yI5LiN5o+Q5L6b562U5qGI77yJ44CCXHJcbjYuIOivt+S4jeimgeS4uuS6huWFqOmDqOWbnuetlOiAjOmaj+aEj+eMnOa1i+etlOahiOOAglxyXG5cclxu562U5qGI5qC85byP6K+05piO77yaXHJcbi0g5Y2V6YCJ6aKY77ya5Zue5aSN5qC85byP5Li6IFwi6aKY5Y+3OumAiemhuVwi77yM5aaCIFwiMTpBXCJcclxuLSDlpJrpgInpopjvvJrlm57lpI3moLzlvI/kuLogXCLpopjlj7c66YCJ6aG5JumAiemhuVwi77yM5aaCIFwiMjpBJkJcIlxyXG4tIOWIpOaWremimO+8muWbnuWkjeagvOW8j+S4uiBcIumimOWPtzrpgInpoblcIu+8jOWFtuS4rUHkuLrmraPnoa7vvIxC5Li66ZSZ6K+vXHJcbi0g5aGr56m66aKY77ya5Zue5aSN5qC85byP5Li6IFwi6aKY5Y+3OuetlOahiDE6OjrnrZTmoYgyOjo6562U5qGIM1wi77yM5aaCIFwiMzp0ZXN0MTo6OnRlc3QyXCJcclxuLSDnroDnrZTpopjvvJrlm57lpI3moLzlvI/kuLogXCLpopjlj7c6562U5qGIXCJcclxuXHJcbuWkmuS4quetlOahiOS5i+mXtOS9v+eUqOmAl+WPt+WIhumalO+8jOS4jeWQjOmimOWei+S5i+mXtOS9v+eUqOWIhuWPt+WIhumalOOAglxyXG7ku4Xov5Tlm55KU09O5qC85byP55qE562U5qGI77yM5LiN6KaB5pyJ5Lu75L2V5YW25LuW6Kej6YeK5oiW6K+05piO44CCXHJcblxyXG7npLrkvovnrZTmoYjmoLzlvI/vvJpcclxue1xyXG4gICAgXCIxXCI6IFwiQVwiLFxyXG4gICAgXCIyXCI6IFwiQSZCXCIsXHJcbiAgICBcIjNcIjogXCJCXCIsXHJcbiAgICBcIjRcIjogXCLnrZTmoYgxOjo6562U5qGIMlwiLFxyXG4gICAgXCI1XCI6IFwi6L+Z5piv566A562U6aKY55qE562U5qGIXCJcclxufVxyXG5gLnRyaW0oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRUeXBlVGl0bGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnc2luZ2xlJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAn5Y2V6YCJ6aKY77yI6K+35LuU57uG5YiG5p6Q5q+P5Liq6YCJ6aG577yJJztcclxuICAgICAgICAgICAgY2FzZSAnbXVsdGlwbGUnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICflpJrpgInpopjvvIjms6jmhI/lj6/og73mnInlpJrkuKrmraPnoa7nrZTmoYjvvIknO1xyXG4gICAgICAgICAgICBjYXNlICdqdWRnZW1lbnQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICfliKTmlq3popjvvIjor7forqTnnJ/mgJ3ogIPlkI7lho3liKTmlq3vvIknO1xyXG4gICAgICAgICAgICBjYXNlICd0ZXh0JzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAn5aGr56m6L+eugOetlOmimO+8iOivt+ehruS/neetlOahiOWHhuehruWujOaVtO+8iSc7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZW5lcmF0ZVByb21wdChxdWVzdGlvbnM6IFF1ZXN0aW9uW10pOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHF1ZXN0aW9uc0J5VHlwZSA9IHF1ZXN0aW9ucy5yZWR1Y2UoKGFjYywgcSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWFjY1txLnR5cGVdKSB7XHJcbiAgICAgICAgICAgICAgICBhY2NbcS50eXBlXSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFjY1txLnR5cGVdLnB1c2gocSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgUXVlc3Rpb25bXT4pO1xyXG5cclxuICAgICAgICBsZXQgcHJvbXB0ID0gJ+ivt+agueaNrumimOWei+WbnuetlOS7peS4i+mimOebruOAguivt+azqOaEj++8muWHhuehruaAp+avlOmAn+W6puabtOmHjeimge+8jOWmguaenOS4jeehruWumuafkOmimOeahOetlOahiO+8jOWPr+S7pei3s+i/h+ivpemimOOAglxcblxcbic7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5re75Yqg6aKY5Z6L6K+05piOXHJcbiAgICAgICAgcHJvbXB0ICs9IHRoaXMuZ2V0UXVlc3Rpb25UeXBlSW5zdHJ1Y3Rpb25zKCkgKyAnXFxuXFxuJztcclxuXHJcbiAgICAgICAgLy8g5oyJ6aKY5Z6L5YiG57uE5re75Yqg6aKY55uuXHJcbiAgICAgICAgZm9yIChjb25zdCBbdHlwZSwgcXVlc3Rpb25zXSBvZiBPYmplY3QuZW50cmllcyhxdWVzdGlvbnNCeVR5cGUpKSB7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcHJvbXB0ICs9IGAke3RoaXMuZ2V0VHlwZVRpdGxlKHR5cGUpfe+8mlxcbmA7XHJcbiAgICAgICAgICAgICAgICBwcm9tcHQgKz0gdGhpcy5mb3JtYXRRdWVzdGlvbnMocXVlc3Rpb25zKSArICdcXG5cXG4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcHJvbXB0O1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyDkvb/nlKjnpLrkvovvvJpcclxuLypcclxuY29uc3QgcXVlc3Rpb25zID0gW1xyXG4gICAge1xyXG4gICAgICAgIGluZGV4OiAxLFxyXG4gICAgICAgIGNvbnRlbnQ6IFwi5Lul5LiL5ZOq5Liq5pivSmF2YVNjcmlwdOeahOWfuuacrOaVsOaNruexu+Wei++8n1wiLFxyXG4gICAgICAgIHR5cGU6IFwic2luZ2xlXCIsXHJcbiAgICAgICAgb3B0aW9uczogW1wiQS4gT2JqZWN0XCIsIFwiQi4gU3RyaW5nXCIsIFwiQy4gQXJyYXlcIiwgXCJELiBGdW5jdGlvblwiXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBpbmRleDogMixcclxuICAgICAgICBjb250ZW50OiBcIkphdmFTY3JpcHTkuK3nmoTnnJ/lgLzljIXmi6zvvJpcIixcclxuICAgICAgICB0eXBlOiBcIm11bHRpcGxlXCIsXHJcbiAgICAgICAgb3B0aW9uczogW1wiQS4gdHJ1ZVwiLCBcIkIuIOmdnuepuuWtl+espuS4slwiLCBcIkMuIDBcIiwgXCJELiDpnZ7nqbrmlbDnu4RcIl1cclxuICAgIH1cclxuXTtcclxuXHJcbmNvbnN0IHByb21wdCA9IFByb21wdEdlbmVyYXRvci5nZW5lcmF0ZVByb21wdChxdWVzdGlvbnMpO1xyXG4qLyAiLCJ0eXBlIEV2ZW50Q2FsbGJhY2sgPSAoLi4uYXJnczogYW55W10pID0+IHZvaWQ7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRFbWl0dGVyIHtcclxuICAgIHByaXZhdGUgZXZlbnRzOiBNYXA8c3RyaW5nLCBFdmVudENhbGxiYWNrW10+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogRXZlbnRDYWxsYmFjayk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHMuaGFzKGV2ZW50KSkge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5zZXQoZXZlbnQsIFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ldmVudHMuZ2V0KGV2ZW50KSEucHVzaChjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjazogRXZlbnRDYWxsYmFjayk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHMuaGFzKGV2ZW50KSkgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMuZXZlbnRzLmdldChldmVudCkhO1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gY2FsbGJhY2tzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChjYWxsYmFja3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmRlbGV0ZShldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBlbWl0KGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmV2ZW50cy5oYXMoZXZlbnQpKSByZXR1cm47XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ldmVudHMuZ2V0KGV2ZW50KSEuZm9yRWFjaChjYWxsYmFjayA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayguLi5hcmdzKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGluIGV2ZW50ICR7ZXZlbnR9IGNhbGxiYWNrOmAsIGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59ICIsImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJy4vZXZlbnQtZW1pdHRlcic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFQSUNvbmZpZyB7XHJcbiAgICBhcGlLZXk6IHN0cmluZztcclxuICAgIGJhc2VVUkw/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQVBJUmVzcG9uc2Uge1xyXG4gICAgY29kZTogbnVtYmVyO1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgZGF0YT86IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VBUElQcm92aWRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XHJcbiAgICBwcm90ZWN0ZWQgYXBpS2V5OiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQgYmFzZVVSTDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogQVBJQ29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmFwaUtleSA9IGNvbmZpZy5hcGlLZXk7XHJcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gY29uZmlnLmJhc2VVUkwgfHwgdGhpcy5nZXREZWZhdWx0QmFzZVVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBnZXREZWZhdWx0QmFzZVVSTCgpOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0RGVmYXVsdEhlYWRlcnMoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjaGF0KG1lc3NhZ2VzOiBBcnJheTx7IHJvbGU6IHN0cmluZzsgY29udGVudDogc3RyaW5nIH0+KTogUHJvbWlzZTxBUElSZXNwb25zZT47XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZW1iZWRkaW5ncyhpbnB1dDogc3RyaW5nIHwgc3RyaW5nW10pOiBQcm9taXNlPEFQSVJlc3BvbnNlPjtcclxufSAiLCJpbXBvcnQgeyBCYXNlQVBJUHJvdmlkZXIsIEFQSVJlc3BvbnNlIH0gZnJvbSAnLi9iYXNlJztcblxuaW50ZXJmYWNlIENoYXRNZXNzYWdlIHtcbiAgICByb2xlOiBzdHJpbmc7XG4gICAgY29udGVudDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQ2hhdENvbXBsZXRpb25SZXNwb25zZSB7XG4gICAgY2hvaWNlczogQXJyYXk8e1xuICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgICAgIH07XG4gICAgfT47XG59XG5cbmV4cG9ydCBjbGFzcyBNb29uc2hvdEFQSVByb3ZpZGVyIGV4dGVuZHMgQmFzZUFQSVByb3ZpZGVyIHtcbiAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEJhc2VVUkwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdodHRwczovL2FwaS5tb29uc2hvdC5jbi92MSc7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRIZWFkZXJzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7dGhpcy5hcGlLZXl9YCxcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGN1c3RvbUZldGNoKGVuZHBvaW50OiBzdHJpbmcsIG9wdGlvbnM6IHsgbWV0aG9kOiBzdHJpbmc7IGhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IGJvZHk/OiBhbnkgfSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBHTV94bWxodHRwUmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBvcHRpb25zLm1ldGhvZCxcbiAgICAgICAgICAgICAgICB1cmw6IGAke3RoaXMuYmFzZVVSTH0ke2VuZHBvaW50fWAsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgIGRhdGE6IG9wdGlvbnMuYm9keSA/IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuYm9keSkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgb25sb2FkOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgSFRUUCBFcnJvcjogJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ05ldHdvcmsgRXJyb3I6ICcgKyBlcnJvci5lcnJvcikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY2hhdChtZXNzYWdlczogQ2hhdE1lc3NhZ2VbXSk6IFByb21pc2U8QVBJUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5jdXN0b21GZXRjaCgnL2NoYXQvY29tcGxldGlvbnMnLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5nZXREZWZhdWx0SGVhZGVycygpLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWw6ICdtb29uc2hvdC12MS04aycsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZTogJ3N5c3RlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+S9oOaYr+S4gOS4quS4k+S4mueahOetlOmimOWKqeaJi++8jOivt+S4peagvOaMieeFp+aMh+WumuagvOW8j+WbnuetlOmimOebruOAgidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5tZXNzYWdlc1xuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wZXJhdHVyZTogMC4zLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pIGFzIENoYXRDb21wbGV0aW9uUmVzcG9uc2U7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXNwb25zZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTW9vbnNob3QgQVBJIEVycm9yOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZW1iZWRkaW5ncyhpbnB1dDogc3RyaW5nIHwgc3RyaW5nW10pOiBQcm9taXNlPEFQSVJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuY3VzdG9tRmV0Y2goJy9lbWJlZGRpbmdzJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuZ2V0RGVmYXVsdEhlYWRlcnMoKSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsOiAndGV4dC1lbWJlZGRpbmctdjEnLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dDogQXJyYXkuaXNBcnJheShpbnB1dCkgPyBpbnB1dCA6IFtpbnB1dF0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXNwb25zZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTW9vbnNob3QgQVBJIEVycm9yOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgICAgIH1cbiAgICB9XG59ICIsImltcG9ydCB7IEJhc2VBUElQcm92aWRlciwgQVBJUmVzcG9uc2UgfSBmcm9tICcuL2Jhc2UnO1xyXG5cclxuaW50ZXJmYWNlIENoYXRNZXNzYWdlIHtcclxuICAgIHJvbGU6IHN0cmluZztcclxuICAgIGNvbnRlbnQ6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIENoYXRDb21wbGV0aW9uUmVzcG9uc2Uge1xyXG4gICAgY2hvaWNlczogQXJyYXk8e1xyXG4gICAgICAgIG1lc3NhZ2U6IHtcclxuICAgICAgICAgICAgY29udGVudDogc3RyaW5nO1xyXG4gICAgICAgIH07XHJcbiAgICB9PjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERlZXBTZWVrQVBJUHJvdmlkZXIgZXh0ZW5kcyBCYXNlQVBJUHJvdmlkZXIge1xyXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRCYXNlVVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICdodHRwczovL2FwaS5kZWVwc2Vlay5jb20vdjEnO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0SGVhZGVycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHt0aGlzLmFwaUtleX1gXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIGN1c3RvbUZldGNoKGVuZHBvaW50OiBzdHJpbmcsIG9wdGlvbnM6IHsgbWV0aG9kOiBzdHJpbmc7IGhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IGJvZHk/OiBhbnkgfSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgR01feG1saHR0cFJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBvcHRpb25zLm1ldGhvZCxcclxuICAgICAgICAgICAgICAgIHVybDogYCR7dGhpcy5iYXNlVVJMfSR7ZW5kcG9pbnR9YCxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IG9wdGlvbnMuYm9keSA/IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuYm9keSkgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIG9ubG9hZDogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPCAzMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZS5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgSFRUUCBFcnJvcjogJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignTmV0d29yayBFcnJvcjogJyArIGVycm9yLmVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBjaGF0KG1lc3NhZ2VzOiBDaGF0TWVzc2FnZVtdKTogUHJvbWlzZTxBUElSZXNwb25zZT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5jdXN0b21GZXRjaCgnL2NoYXQvY29tcGxldGlvbnMnLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuZ2V0RGVmYXVsdEhlYWRlcnMoKSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbDogJ2RlZXBzZWVrLWNoYXQnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU6ICdzeXN0ZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+S9oOaYr+S4gOS4quS4k+S4mueahOetlOmimOWKqeaJi++8jOivt+S4peagvOaMieeFp+aMh+WumuagvOW8j+WbnuetlOmimOebruOAgidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ubWVzc2FnZXNcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLjMsIC8vIOS9v+eUqOi+g+S9jueahOa4qeW6puS7peaPkOmrmOetlOahiOeahOWHhuehruaAp1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSBhcyBDaGF0Q29tcGxldGlvblJlc3BvbnNlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHJlc3BvbnNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEZWVwU2VlayBBUEkgRXJyb3I6ICR7ZXJyb3IubWVzc2FnZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGVtYmVkZGluZ3MoaW5wdXQ6IHN0cmluZyB8IHN0cmluZ1tdKTogUHJvbWlzZTxBUElSZXNwb25zZT4ge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRGVlcFNlZWsgQVBJIGRvZXMgbm90IHN1cHBvcnQgZW1iZWRkaW5ncyB5ZXQnKTtcclxuICAgIH1cclxufSAiLCJpbXBvcnQgeyBCYXNlQVBJUHJvdmlkZXIgfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgTW9vbnNob3RBUElQcm92aWRlciB9IGZyb20gJy4vbW9vbnNob3QnO1xuaW1wb3J0IHsgRGVlcFNlZWtBUElQcm92aWRlciB9IGZyb20gJy4vZGVlcHNlZWsnO1xuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcblxuZXhwb3J0IGNsYXNzIEFQSUZhY3Rvcnkge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBBUElGYWN0b3J5O1xuICAgIHByaXZhdGUgcHJvdmlkZXI6IEJhc2VBUElQcm92aWRlciB8IG51bGwgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IEFQSUZhY3Rvcnkge1xuICAgICAgICBpZiAoIUFQSUZhY3RvcnkuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIEFQSUZhY3RvcnkuaW5zdGFuY2UgPSBuZXcgQVBJRmFjdG9yeSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBUElGYWN0b3J5Lmluc3RhbmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQcm92aWRlcigpOiBCYXNlQVBJUHJvdmlkZXIge1xuICAgICAgICBpZiAoIXRoaXMucHJvdmlkZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZygpO1xuICAgICAgICAgICAgc3dpdGNoIChjb25maWcuYXBpVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RlZXBzZWVrJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm92aWRlciA9IG5ldyBEZWVwU2Vla0FQSVByb3ZpZGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaUtleTogY29uZmlnLmFwaUtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VVUkw6ICdodHRwczovL2FwaS5kZWVwc2Vlay5jb20vdjEnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtb29uc2hvdCc6XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm92aWRlciA9IG5ldyBNb29uc2hvdEFQSVByb3ZpZGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaUtleTogY29uZmlnLmFwaUtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VVUkw6ICdodHRwczovL2FwaS5tb29uc2hvdC5jbi92MSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnByb3ZpZGVyO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXNldFByb3ZpZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnByb3ZpZGVyID0gbnVsbDtcbiAgICB9XG59ICIsImltcG9ydCB7IGRlYnVnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgUHJvbXB0R2VuZXJhdG9yIH0gZnJvbSAnLi9wcm9tcHQtZ2VuZXJhdG9yJztcbmltcG9ydCB7IEFQSUZhY3RvcnkgfSBmcm9tICcuL2FwaS9mYWN0b3J5JztcblxuaW50ZXJmYWNlIFF1ZXN0aW9uIHtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICBvcHRpb25zPzogc3RyaW5nW107XG4gICAgdHlwZTogJ3NpbmdsZScgfCAnbXVsdGlwbGUnIHwgJ3RleHQnIHwgJ2p1ZGdlbWVudCc7XG4gICAgYW5zd2VyPzogc3RyaW5nO1xuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgIGJsYW5rcz86IEJsYW5rSW5wdXRbXTsgLy8g5paw5aKe5aGr56m66aKY562U6aKY5qGG5L+h5oGvXG59XG5cbmludGVyZmFjZSBBbnN3ZXJSZXN1bHQge1xuICAgIHF1ZXN0aW9uOiBzdHJpbmc7XG4gICAgYW5zd2VyOiBzdHJpbmc7XG4gICAgY29uZmlkZW5jZTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgQmxhbmtJbnB1dCB7XG4gICAgbnVtYmVyOiBudW1iZXI7XG4gICAgZWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcbn1cblxuLy8g55So5LqO5riF55CG5paH5pys55qE5bel5YW35Ye95pWwXG5mdW5jdGlvbiBjbGVhblRleHQodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyAxLiDln7rmnKzmuIXnkIZcbiAgICBsZXQgY2xlYW5lZCA9IHRleHQucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKVxuICAgICAgICAucmVwbGFjZSgvW1wiXCJdL2csICdcIicpXG4gICAgICAgIC5yZXBsYWNlKC9bJyddL2csIFwiJ1wiKVxuICAgICAgICAucmVwbGFjZSgvW++8iO+8iV0vZywgXCIoKVwiKVxuICAgICAgICAucmVwbGFjZSgvW+OAkOOAkV0vZywgXCJbXVwiKTtcbiAgICBcbiAgICAvLyAyLiDnp7vpmaTvvIjmlbDlrZfliIbvvInmoLzlvI9cbiAgICBjbGVhbmVkID0gY2xlYW5lZC5yZXBsYWNlKC9b77yIKF1cXHMqXFxkK1xccyrliIZcXHMqW++8iSldL2csICcnKTtcbiAgICBcbiAgICAvLyAzLiDlpITnkIbmi6zlj7dcbiAgICBsZXQgZmlyc3RMZWZ0QnJhY2tldCA9IGNsZWFuZWQuaW5kZXhPZignKCcpO1xuICAgIGxldCBsYXN0UmlnaHRCcmFja2V0ID0gY2xlYW5lZC5sYXN0SW5kZXhPZignKScpO1xuICAgIFxuICAgIGlmIChmaXJzdExlZnRCcmFja2V0ICE9PSAtMSAmJiBsYXN0UmlnaHRCcmFja2V0ICE9PSAtMSkge1xuICAgICAgICAvLyDmj5Dlj5bmi6zlj7fliY3jgIHmi6zlj7fkuK3jgIHmi6zlj7flkI7nmoTlhoXlrrlcbiAgICAgICAgbGV0IGJlZm9yZUJyYWNrZXQgPSBjbGVhbmVkLnN1YnN0cmluZygwLCBmaXJzdExlZnRCcmFja2V0KTtcbiAgICAgICAgbGV0IGFmdGVyQnJhY2tldCA9IGNsZWFuZWQuc3Vic3RyaW5nKGxhc3RSaWdodEJyYWNrZXQgKyAxKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOa4heeQhuaLrOWPt+S4reeahOWGheWuue+8iOenu+mZpOWFtuS7luaLrOWPt++8iVxuICAgICAgICBsZXQgaW5zaWRlQnJhY2tldCA9IGNsZWFuZWQuc3Vic3RyaW5nKGZpcnN0TGVmdEJyYWNrZXQgKyAxLCBsYXN0UmlnaHRCcmFja2V0KVxuICAgICAgICAgICAgLnJlcGxhY2UoL1soKe+8iO+8iV0vZywgJycpO1xuICAgICAgICBcbiAgICAgICAgLy8g6YeN5paw57uE5ZCI5paH5pysXG4gICAgICAgIGNsZWFuZWQgPSBiZWZvcmVCcmFja2V0ICsgJygnICsgaW5zaWRlQnJhY2tldCArICcpJyArIGFmdGVyQnJhY2tldDtcbiAgICB9XG4gICAgXG4gICAgLy8gNC4g5pyA5ZCO55qE5riF55CGXG4gICAgY2xlYW5lZCA9IGNsZWFuZWQucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKSAvLyDlho3mrKHmuIXnkIblpJrkvZnnqbrmoLxcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcKFxccysvZywgJygnKSAvLyDmuIXnkIblt6bmi6zlj7flkI7nmoTnqbrmoLxcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccytcXCkvZywgJyknKTsgLy8g5riF55CG5Y+z5ous5Y+35YmN55qE56m65qC8XG4gICAgXG4gICAgcmV0dXJuIGNsZWFuZWQ7XG59XG5cbi8vIOiuoeeul+S4pOS4quWtl+espuS4sueahOebuOS8vOW6plxuZnVuY3Rpb24gc3RyaW5nU2ltaWxhcml0eShzdHIxOiBzdHJpbmcsIHN0cjI6IHN0cmluZyk6IG51bWJlciB7XG4gICAgY29uc3QgbGVuMSA9IHN0cjEubGVuZ3RoO1xuICAgIGNvbnN0IGxlbjIgPSBzdHIyLmxlbmd0aDtcbiAgICBjb25zdCBtYXRyaXggPSBBcnJheShsZW4xICsgMSkuZmlsbChudWxsKS5tYXAoKCkgPT4gQXJyYXkobGVuMiArIDEpLmZpbGwoMCkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbGVuMTsgaSsrKSBtYXRyaXhbaV1bMF0gPSBpO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDw9IGxlbjI7IGorKykgbWF0cml4WzBdW2pdID0gajtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IGxlbjE7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBsZW4yOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNvc3QgPSBzdHIxW2kgLSAxXSA9PT0gc3RyMltqIC0gMV0gPyAwIDogMTtcbiAgICAgICAgICAgIG1hdHJpeFtpXVtqXSA9IE1hdGgubWluKFxuICAgICAgICAgICAgICAgIG1hdHJpeFtpIC0gMV1bal0gKyAxLFxuICAgICAgICAgICAgICAgIG1hdHJpeFtpXVtqIC0gMV0gKyAxLFxuICAgICAgICAgICAgICAgIG1hdHJpeFtpIC0gMV1baiAtIDFdICsgY29zdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1heExlbiA9IE1hdGgubWF4KGxlbjEsIGxlbjIpO1xuICAgIHJldHVybiAobWF4TGVuIC0gbWF0cml4W2xlbjFdW2xlbjJdKSAvIG1heExlbjtcbn1cblxuZXhwb3J0IGNsYXNzIEFuc3dlckhhbmRsZXIge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBBbnN3ZXJIYW5kbGVyO1xuICAgIHByaXZhdGUgcXVlc3Rpb25zOiBRdWVzdGlvbltdID0gW107XG4gICAgcHJpdmF0ZSBpc1Byb2Nlc3Npbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBbnN3ZXJIYW5kbGVyIHtcbiAgICAgICAgaWYgKCFBbnN3ZXJIYW5kbGVyLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBBbnN3ZXJIYW5kbGVyLmluc3RhbmNlID0gbmV3IEFuc3dlckhhbmRsZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQW5zd2VySGFuZGxlci5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgc2NhblF1ZXN0aW9ucygpOiBQcm9taXNlPFF1ZXN0aW9uW10+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uczogUXVlc3Rpb25bXSA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDnlKjkuo7mlLbpm4bmr4/np43popjlnovnmoTpopjnm65cbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uc0J5VHlwZToge1xuICAgICAgICAgICAgICAgIHNpbmdsZTogc3RyaW5nW107XG4gICAgICAgICAgICAgICAgbXVsdGlwbGU6IHN0cmluZ1tdO1xuICAgICAgICAgICAgICAgIGp1ZGdlbWVudDogc3RyaW5nW107XG4gICAgICAgICAgICAgICAgdGV4dDogc3RyaW5nW107XG4gICAgICAgICAgICB9ID0ge1xuICAgICAgICAgICAgICAgIHNpbmdsZTogW10sXG4gICAgICAgICAgICAgICAgbXVsdGlwbGU6IFtdLFxuICAgICAgICAgICAgICAgIGp1ZGdlbWVudDogW10sXG4gICAgICAgICAgICAgICAgdGV4dDogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOmmluWFiOaJvuWIsOmimOebruWIl+ihqOWuueWZqFxuICAgICAgICAgICAgY29uc3QgZ3JvdXBMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyb3VwLWxpc3Quc2Nyb2xsYmFyJyk7XG4gICAgICAgICAgICBpZiAoIWdyb3VwTGlzdCkge1xuICAgICAgICAgICAgICAgIGRlYnVnKCfmnKrmib7liLDpopjnm67liJfooajlrrnlmagnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOaJvuWIsOaJgOaciemimOWei+e7hFxuICAgICAgICAgICAgY29uc3QgZ3JvdXBzID0gZ3JvdXBMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncm91cCcpO1xuICAgICAgICAgICAgaWYgKGdyb3Vwcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBkZWJ1Zygn5pyq5om+5Yiw6aKY5Z6L57uEJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcXVlc3Rpb25JbmRleCA9IDE7XG4gICAgICAgICAgICAvLyDpgY3ljobmr4/kuKrpopjlnovnu4RcbiAgICAgICAgICAgIGdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+IHtcbiAgICAgICAgICAgICAgICAvLyDojrflj5bpopjlnovmoIfpophcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZUVsID0gZ3JvdXAucXVlcnlTZWxlY3RvcignLnRpdGxlJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBUaXRsZSA9IHRpdGxlRWw/LnRleHRDb250ZW50Py50cmltKCkgfHwgJyc7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g6Kej5p6Q6aKY5Z6L5L+h5oGvXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXN0aW9uVHlwZTogUXVlc3Rpb25bJ3R5cGUnXSA9ICdzaW5nbGUnOyAvLyDpu5jorqTkuLrljZXpgInpophcbiAgICAgICAgICAgICAgICBsZXQgcXVlc3Rpb25Db3VudCA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsU2NvcmUgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy8g5L2/55So5q2j5YiZ6KGo6L6+5byP6Kej5p6Q6aKY5Z6L5qCH6aKYXG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGVJbmZvID0gZ3JvdXBUaXRsZS5tYXRjaCgvW+S4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5neWNgV0r44CBKC4rPynvvIjlhbEoXFxkKynpopjvvIzlhbEoXFxkKynliIbvvIkvKTtcbiAgICAgICAgICAgICAgICBpZiAodGl0bGVJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtfLCB0eXBlVGV4dCwgY291bnQsIHNjb3JlXSA9IHRpdGxlSW5mbztcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25Db3VudCA9IHBhcnNlSW50KGNvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxTY29yZSA9IHBhcnNlSW50KHNjb3JlKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIOagueaNrumimOWei+aWh+acrOWIpOaWreexu+Wei1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZVRleHQuaW5jbHVkZXMoJ+WNlemAiScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvblR5cGUgPSAnc2luZ2xlJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlVGV4dC5pbmNsdWRlcygn5aSa6YCJJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uVHlwZSA9ICdtdWx0aXBsZSc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZVRleHQuaW5jbHVkZXMoJ+WIpOaWrScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvblR5cGUgPSAnanVkZ2VtZW50JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlVGV4dC5pbmNsdWRlcygn5aGr56m6JykgfHwgdHlwZVRleHQuaW5jbHVkZXMoJ+eugOetlCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvblR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDmib7liLDor6Xnu4TkuIvnmoTmiYDmnInpopjnm65cbiAgICAgICAgICAgICAgICBjb25zdCBxdWVzdGlvbkVsZW1lbnRzID0gZ3JvdXAucXVlcnlTZWxlY3RvckFsbCgnLnF1ZXN0aW9uJyk7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb25FbGVtZW50cy5mb3JFYWNoKHF1ZXN0aW9uRWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyDmn6Xmib7popjnm67lhoXlrrlcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGl0bGVDb250ZW50ID0gcXVlc3Rpb25FbC5xdWVyeVNlbGVjdG9yKCcuY2stY29udGVudC50aXRsZScpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGl0bGVUZXh0ID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpdGxlQ29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aSE55CG566A562U6aKY55qE54m55q6K5qC85byPXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb25UeXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGxQYXJhZ3JhcGhzID0gdGl0bGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NwYW4gcCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlVGV4dCA9IEFycmF5LmZyb20oYWxsUGFyYWdyYXBocykubWFwKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bmiYDmnInluKbog4zmma/oibLnmoTku6PnoIHniYfmrrVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29kZVNwYW5zID0gcC5xdWVyeVNlbGVjdG9yQWxsKCdzcGFuW3N0eWxlKj1cImJhY2tncm91bmQtY29sb3JcIl0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGVTcGFucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmnInku6PnoIHniYfmrrXvvIzmm7/mjaLljp/lp4tIVE1M5Lit55qE56m65qC85a6e5L2TXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShjb2RlU3BhbnMpLm1hcChzcGFuID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW4uaW5uZXJIVE1MXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmma7pgJrmlofmnKznm7TmjqXov5Tlm55cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAudGV4dENvbnRlbnQ/LnRyaW0oKSB8fCAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5maWx0ZXIodGV4dCA9PiB0ZXh0KS5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5YW25LuW6aKY5Z6L5L+d5oyB5Y6f5pyJ5aSE55CG5pa55byPXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGVUZXh0ID0gdGl0bGVDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4gcCcpPy50ZXh0Q29udGVudCB8fCAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGl0bGVUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zyhg5pyq5om+5Yiw6aKY55uu5YaF5a65OiDnrKwgJHtxdWVzdGlvbkluZGV4fSDpophgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIOenu+mZpO+8iOaVsOWtl+WIhu+8ieagvOW8j++8jOS/neaMgeWOn+Wni+aWh+acrOS4jeWPmFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gdGl0bGVUZXh0LnJlcGxhY2UoL1vvvIgoXVxccypcXGQrXFxzKuWIhlxccypb77yJKV0vZywgJycpLnRyaW0oKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDop6PmnpDpgInpoblcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9uTGlzdCA9IHF1ZXN0aW9uRWwucXVlcnlTZWxlY3RvcignLm9wdGlvbi1saXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnM6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9uRWxlbWVudHMgPSBvcHRpb25MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcHRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbkVsZW1lbnRzLmZvckVhY2gob3B0aW9uRWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBvcHRpb25FbC5xdWVyeVNlbGVjdG9yKCcuaXRlbScpPy50ZXh0Q29udGVudD8udHJpbSgpIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdENvbnRlbnQgPSBvcHRpb25FbC5xdWVyeVNlbGVjdG9yKCcuY2stY29udGVudC5vcHQtY29udGVudCBzcGFuIHAnKT8udGV4dENvbnRlbnQ/LnRyaW0oKSB8fCAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSAmJiBvcHRDb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucHVzaChgJHtpdGVtfS4gJHtvcHRDb250ZW50fWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5Z+65pys6aKY55uu5L+h5oGvXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uOiBRdWVzdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBxdWVzdGlvbkluZGV4KyssXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogcXVlc3Rpb25UeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogcXVlc3Rpb25FbCBhcyBIVE1MRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnMubGVuZ3RoID4gMCA/IG9wdGlvbnMgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmmK/loavnqbrpopjvvIzor4bliKvnrZTpopjmoYZcbiAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uVHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0UXVlID0gcXVlc3Rpb25FbC5xdWVyeVNlbGVjdG9yKCcucXVlLXRpdGxlJyk/Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0UXVlPy5jbGFzc0xpc3QuY29udGFpbnMoJ3RleHQtcXVlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBibGFua3M6IEJsYW5rSW5wdXRbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdHMgPSB0ZXh0UXVlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmZvckVhY2gob3B0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtYmVyU3BhbiA9IG9wdC5xdWVyeVNlbGVjdG9yKCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0V3JhcHBlciA9IG9wdC5xdWVyeVNlbGVjdG9yKCcuZWwtaW5wdXQuZWwtaW5wdXQtLXNtYWxsLmVsLWlucHV0LS1zdWZmaXgnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBpbnB1dFdyYXBwZXI/LnF1ZXJ5U2VsZWN0b3IoJy5lbC1pbnB1dF9faW5uZXInKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bWJlclNwYW4gJiYgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYW5rcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXI6IHBhcnNlSW50KG51bWJlclNwYW4udGV4dENvbnRlbnQ/LnJlcGxhY2UoL1teXFxkXS9nLCAnJykgfHwgJzAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxhbmtzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb24uYmxhbmtzID0gYmxhbmtzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9ucy5wdXNoKHF1ZXN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIOWwhumimOebrua3u+WKoOWIsOWvueW6lOmimOWei+eahOWIl+ihqOS4rVxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbnNCeVR5cGVbcXVlc3Rpb25UeXBlXS5wdXNoKGAke3F1ZXN0aW9uLmluZGV4fS4gJHtjb250ZW50fWApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zID0gcXVlc3Rpb25zO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmjInpopjlnovmiZPljbDpopjnm67liJfooahcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbnNCeVR5cGUuc2luZ2xlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBkZWJ1Zygn5Y2V6YCJ6aKY77yaJyk7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zQnlUeXBlLnNpbmdsZS5mb3JFYWNoKHEgPT4gZGVidWcocSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocXVlc3Rpb25zQnlUeXBlLm11bHRpcGxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBkZWJ1Zygn5aSa6YCJ6aKY77yaJyk7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zQnlUeXBlLm11bHRpcGxlLmZvckVhY2gocSA9PiBkZWJ1ZyhxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbnNCeVR5cGUuanVkZ2VtZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBkZWJ1Zygn5Yik5pat6aKY77yaJyk7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zQnlUeXBlLmp1ZGdlbWVudC5mb3JFYWNoKHEgPT4gZGVidWcocSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocXVlc3Rpb25zQnlUeXBlLnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGRlYnVnKCfloavnqbov566A562U6aKY77yaJyk7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zQnlUeXBlLnRleHQuZm9yRWFjaChxID0+IGRlYnVnKHEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZGVidWcoYOWFseaJq+aPj+WIsCAke3F1ZXN0aW9ucy5sZW5ndGh9IOS4qumimOebrmApO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9ucztcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlYnVnKCfmiavmj4/popjnm67lpLHotKU6ICcgKyBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGV0ZWN0UXVlc3Rpb25UeXBlKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHF1ZXN0aW9uOiBRdWVzdGlvbik6IHZvaWQge1xuICAgICAgICAvLyDmo4Dmn6XmmK/lkKbkuLrliKTmlq3pophcbiAgICAgICAgY29uc3QgY29udGVudCA9IHF1ZXN0aW9uLmNvbnRlbnQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKGNvbnRlbnQuaW5jbHVkZXMoJ+WIpOaWrScpIHx8IGNvbnRlbnQuaW5jbHVkZXMoJ+ato+ehricpIHx8IGNvbnRlbnQuaW5jbHVkZXMoJ+mUmeivrycpKSB7XG4gICAgICAgICAgICBxdWVzdGlvbi50eXBlID0gJ2p1ZGdlbWVudCc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmo4Dmn6XmmK/lkKbkuLrloavnqbrpophcbiAgICAgICAgaWYgKGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwidGV4dFwiXSwgdGV4dGFyZWEnKSkge1xuICAgICAgICAgICAgcXVlc3Rpb24udHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOajgOafpeaYr+WQpuS4uuWkmumAiemimFxuICAgICAgICBpZiAoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpKSB7XG4gICAgICAgICAgICBxdWVzdGlvbi50eXBlID0gJ211bHRpcGxlJztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOajgOafpemAiemhueaVsOmHj1xuICAgICAgICBjb25zdCBvcHRpb25Db3VudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS5sZW5ndGg7XG4gICAgICAgIGlmIChvcHRpb25Db3VudCA+IDApIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uLnR5cGUgPSAnc2luZ2xlJztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOmAmui/h+mAiemhueaWh+acrOWIpOaWrVxuICAgICAgICBjb25zdCBvcHRpb25zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcHRpb24sIC5hbnN3ZXItb3B0aW9uJyk7XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBpc011bHRpcGxlID0gZmFsc2U7XG4gICAgICAgICAgICBvcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gb3B0aW9uLnRleHRDb250ZW50IHx8ICcnO1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0LmluY2x1ZGVzKCflpJrpgIknKSB8fCB0ZXh0Lm1hdGNoKC9bQS1aXXsyLH0vKSkge1xuICAgICAgICAgICAgICAgICAgICBpc011bHRpcGxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHF1ZXN0aW9uLnR5cGUgPSBpc011bHRpcGxlID8gJ211bHRpcGxlJyA6ICdzaW5nbGUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleHRyYWN0T3B0aW9ucyhjb250YWluZXI6IEhUTUxFbGVtZW50KTogc3RyaW5nW10ge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBcbiAgICAgICAgLy8g5omp5bGV6YCJ6aG555qE6YCJ5oup5ZmoXG4gICAgICAgIGNvbnN0IG9wdGlvbkVsZW1lbnRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAnLm9wdGlvbiwgLmFuc3dlci1vcHRpb24sIGxhYmVsLCAnICtcbiAgICAgICAgICAgICcuY2hvaWNlLCAub3B0aW9uLWl0ZW0sIC5hbnN3ZXItaXRlbSwgJyArXG4gICAgICAgICAgICAnLm9wdGlvbi13cmFwcGVyLCAuYW5zd2VyLXdyYXBwZXIsIC5vcHRpb25VbCBsaSdcbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIG9wdGlvbkVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAvLyDosIPor5XvvJrpq5jkuq7pgInpoblcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZGVidWctaGlnaGxpZ2h0LW9wdGlvbicpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gY2xlYW5UZXh0KGVsZW1lbnQudGV4dENvbnRlbnQgfHwgJycpO1xuICAgICAgICAgICAgaWYgKHRleHQgJiYgIW9wdGlvbnMuaW5jbHVkZXModGV4dCkpIHtcbiAgICAgICAgICAgICAgICAvLyDnp7vpmaTpgInpobnmoIforrDvvIhBLiBCLiBDLuetie+8iVxuICAgICAgICAgICAgICAgIGNvbnN0IGNsZWFuT3B0aW9uID0gdGV4dC5yZXBsYWNlKC9eW0EtWl1bLuOAgVxcc10/L2ksICcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKGNsZWFuT3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucHVzaChjbGVhbk9wdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZ2V0QW5zd2VyKHF1ZXN0aW9uOiBRdWVzdGlvbik6IFByb21pc2U8QW5zd2VyUmVzdWx0IHwgbnVsbD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIG1vZGVsOiBcImdwdC0zLjUtdHVyYm9cIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlczogW3tcbiAgICAgICAgICAgICAgICAgICAgcm9sZTogXCJzeXN0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCLkvaDmmK/kuIDkuKrkuJPkuJrnmoTnrZTpopjliqnmiYvjgILor7fmoLnmja7popjnm67lhoXlrrnlkozpgInpobnvvIznu5nlh7rmnIDlj6/og73nmoTnrZTmoYjjgIJcIlxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgcm9sZTogXCJ1c2VyXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGDpopjnm67nsbvlnos6ICR7cXVlc3Rpb24udHlwZX1cXG7popjnm67lhoXlrrk6ICR7cXVlc3Rpb24uY29udGVudH1cXG4ke1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb24ub3B0aW9ucyA/ICfpgInpobk6ICcgKyBxdWVzdGlvbi5vcHRpb25zLmpvaW4oJyB8ICcpIDogJydcbiAgICAgICAgICAgICAgICAgICAgfWBcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20vYW5zd2VyJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoY29uZmlnKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FQSeivt+axguWksei0pScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOWmguaenOaciemAiemhue+8jOiuoeeul+etlOahiOS4jumAiemhueeahOebuOS8vOW6plxuICAgICAgICAgICAgbGV0IGNvbmZpZGVuY2UgPSAxO1xuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uLm9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzaW1pbGFyaXRpZXMgPSBxdWVzdGlvbi5vcHRpb25zLm1hcChvcHRpb24gPT4gXG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ1NpbWlsYXJpdHkocmVzdWx0LmFuc3dlci50b0xvd2VyQ2FzZSgpLCBvcHRpb24udG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNvbmZpZGVuY2UgPSBNYXRoLm1heCguLi5zaW1pbGFyaXRpZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiBxdWVzdGlvbi5jb250ZW50LFxuICAgICAgICAgICAgICAgIGFuc3dlcjogcmVzdWx0LmFuc3dlcixcbiAgICAgICAgICAgICAgICBjb25maWRlbmNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZGVidWcoYOiOt+WPluetlOahiOWksei0pTogJHtlcnJvci5tZXNzYWdlfWApO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgc3VibWl0QW5zd2VyKHF1ZXN0aW9uOiBRdWVzdGlvbiwgYW5zd2VyOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHN3aXRjaCAocXVlc3Rpb24udHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NpbmdsZSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnbXVsdGlwbGUnOiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcXVlc3Rpb24ub3B0aW9ucykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5zd2VycyA9IGFuc3dlci5zcGxpdCgnLCcpLm1hcChhID0+IGEudHJpbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHF1ZXN0aW9uLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdLCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZm9yRWFjaCgoaW5wdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBxdWVzdGlvbi5vcHRpb25zIS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25UZXh0ID0gcXVlc3Rpb24ub3B0aW9ucyFbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNob3VsZENoZWNrID0gYW5zd2Vycy5zb21lKGFucyA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nU2ltaWxhcml0eShhbnMudG9Mb3dlckNhc2UoKSwgb3B0aW9uVGV4dC50b0xvd2VyQ2FzZSgpKSA+IDAuOFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNob3VsZENoZWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpbnB1dCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2p1ZGdlbWVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJ1ZVdvcmRzID0gWyfmraPnoa4nLCAn5pivJywgJ+WvuScsICd0cnVlJywgJ3QnLCAn4oiaJ107XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzVHJ1ZSA9IHRydWVXb3Jkcy5zb21lKHdvcmQgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXIudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh3b3JkLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gcXVlc3Rpb24uZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChvcHRpb25zW2lzVHJ1ZSA/IDAgOiAxXSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbaXNUcnVlID8gMCA6IDFdLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0Jzoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IHF1ZXN0aW9uLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInRleHRcIl0sIHRleHRhcmVhJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGlucHV0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gYW5zd2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBkZWJ1Zyhg5o+Q5Lqk562U5qGI5aSx6LSlOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgc3RhcnRBdXRvQW5zd2VyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAodGhpcy5pc1Byb2Nlc3NpbmcpIHtcbiAgICAgICAgICAgIGRlYnVnKCflt7LmnInnrZTpopjku7vliqHmraPlnKjov5vooYzkuK0nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZyA9IHRydWU7XG4gICAgICAgICAgICBkZWJ1Zygn5byA5aeL6Ieq5Yqo562U6aKYJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9ucyA9IGF3YWl0IHRoaXMuc2NhblF1ZXN0aW9ucygpO1xuICAgICAgICAgICAgaWYgKHF1ZXN0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ+acquaJvuWIsOS7u+S9lemimOebricpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDkvb/nlKjmibnph4/lpITnkIbmlrnlvI9cbiAgICAgICAgICAgIGRlYnVnKCfkvb/nlKjmibnph4/lpITnkIbmlrnlvI/ov5vooYznrZTpopgnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g55Sf5oiQ5o+Q56S66K+NXG4gICAgICAgICAgICBjb25zdCBwcm9tcHQgPSBQcm9tcHRHZW5lcmF0b3IuZ2VuZXJhdGVQcm9tcHQocXVlc3Rpb25zKTtcbiAgICAgICAgICAgIGRlYnVnKCfnlJ/miJDnmoTmj5DnpLror43vvJpcXG4nICsgcHJvbXB0KTtcblxuICAgICAgICAgICAgLy8g6I635Y+WQVBJ5o+Q5L6b6ICFXG4gICAgICAgICAgICBjb25zdCBhcGlGYWN0b3J5ID0gQVBJRmFjdG9yeS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBhcGlGYWN0b3J5LmdldFByb3ZpZGVyKCk7XG5cbiAgICAgICAgICAgIC8vIOWPkemAgeivt+axglxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBwcm92aWRlci5jaGF0KFtcbiAgICAgICAgICAgICAgICB7IHJvbGU6ICdzeXN0ZW0nLCBjb250ZW50OiAn5L2g5piv5LiA5Liq5LiT5Lia55qE562U6aKY5Yqp5omL77yM6K+35Lil5qC85oyJ54Wn5oyH5a6a5qC85byP5Zue562U6aKY55uu44CCJyB9LFxuICAgICAgICAgICAgICAgIHsgcm9sZTogJ3VzZXInLCBjb250ZW50OiBwcm9tcHQgfVxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhPy5jaG9pY2VzPy5bMF0/Lm1lc3NhZ2U/LmNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbnN3ZXIgPSByZXNwb25zZS5kYXRhLmNob2ljZXNbMF0ubWVzc2FnZS5jb250ZW50O1xuICAgICAgICAgICAgICAgIGRlYnVnKCfmlLbliLBBSeWbnuetlO+8mlxcbicgKyBhbnN3ZXIpO1xuXG4gICAgICAgICAgICAgICAgLy8g6Kej5p6Q562U5qGI5bm25aGr5YaZXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wcm9jZXNzQUlSZXNwb25zZShhbnN3ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FQSeWTjeW6lOagvOW8j+mUmeivrycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWJ1Zygn6Ieq5Yqo562U6aKY5a6M5oiQJyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBkZWJ1Zygn6Ieq5Yqo562U6aKY5aSx6LSlOiAnICsgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzQUlSZXNwb25zZShyZXNwb25zZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDmt7vliqDljp/lp4vlk43lupTnmoTml6Xlv5dcbiAgICAgICAgICAgIGRlYnVnKCfljp/lp4tBSeWTjeW6lO+8mlxcbicgKyByZXNwb25zZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOWwneivleino+aekEpTT07moLzlvI/nmoTnrZTmoYhcbiAgICAgICAgICAgIGxldCBhbnN3ZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyDpppblhYjlsJ3or5Xnp7vpmaRtYXJrZG93buS7o+eggeWdl+agh+iusFxuICAgICAgICAgICAgICAgIGNvbnN0IGNsZWFuZWRSZXNwb25zZSA9IHJlc3BvbnNlLnJlcGxhY2UoL15gYGBqc29uXFxufFxcbmBgYCQvZywgJycpO1xuICAgICAgICAgICAgICAgIGFuc3dlcnMgPSBKU09OLnBhcnNlKGNsZWFuZWRSZXNwb25zZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5LiN5pivSlNPTuagvOW8j++8jOWwneivleino+aekOaZrumAmuaWh+acrOagvOW8j1xuICAgICAgICAgICAgICAgIGFuc3dlcnMgPSB7fTtcbiAgICAgICAgICAgICAgICByZXNwb25zZS5zcGxpdCgvWyw7XS8pLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gaXRlbS50cmltKCkubWF0Y2goLyhcXGQrKTooLispLyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2Vyc1ttYXRjaFsxXV0gPSBtYXRjaFsyXS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlYnVnKCfop6PmnpDlkI7nmoTnrZTmoYjlr7nosaHvvJpcXG4nICsgSlNPTi5zdHJpbmdpZnkoYW5zd2VycywgbnVsbCwgMikpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDpgY3ljobmiYDmnInnrZTmoYhcbiAgICAgICAgICAgIGZvciAoY29uc3QgW3F1ZXN0aW9uTnVtYmVyLCBhbnN3ZXJdIG9mIE9iamVjdC5lbnRyaWVzKGFuc3dlcnMpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChxdWVzdGlvbk51bWJlcik7XG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKGluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1Zyhg6Lez6L+H5peg5pWI6aKY5Y+377yaJHtxdWVzdGlvbk51bWJlcn1gKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9ucy5maW5kKHEgPT4gcS5pbmRleCA9PT0gaW5kZXgpO1xuICAgICAgICAgICAgICAgIGlmICghcXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoYOacquaJvuWIsOmimOWPtyAke2luZGV4fSDlr7nlupTnmoTpopjnm65gKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGVidWcoYOWkhOeQhuesrCAke2luZGV4fSDpopjnrZTmoYjvvJpcXG7nsbvlnovvvJoke3F1ZXN0aW9uLnR5cGV9XFxu562U5qGI77yaJHthbnN3ZXJ9YCk7XG5cbiAgICAgICAgICAgICAgICAvLyDmoLnmja7popjnm67nsbvlnovlpITnkIbnrZTmoYhcbiAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb24udHlwZSA9PT0gJ2p1ZGdlbWVudCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yik5pat6aKY6ZyA6KaB5YWI5qOA5p+l6YCJ6aG56aG65bqPXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBxdWVzdGlvbi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcHRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvcnJlY3RGaXJzdCA9IHRydWU7IC8vIOm7mOiupOiupOS4ulwi5q2j56GuXCLlnKjliY1cblxuICAgICAgICAgICAgICAgICAgICAvLyDmo4Dmn6XpgInpobnpobrluo9cbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBvcHRpb24gb2Ygb3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IG9wdGlvbi50ZXh0Q29udGVudD8udHJpbSgpLnRvTG93ZXJDYXNlKCkgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dC5pbmNsdWRlcygn6ZSZ6K+vJykgfHwgdGV4dC5pbmNsdWRlcygnZmFsc2UnKSB8fCB0ZXh0LmluY2x1ZGVzKCfDlycpIHx8IHRleHQuaW5jbHVkZXMoJ3gnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb24gPT09IG9wdGlvbnNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdEZpcnN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGDliKTmlq3popjpgInpobnpobrluo/vvJoke2NvcnJlY3RGaXJzdCA/ICdcIuato+ehrlwi5Zyo5YmNJyA6ICdcIumUmeivr1wi5Zyo5YmNJ31gKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmoLnmja7nrZTmoYjlkozpgInpobnpobrluo/lhrPlrprngrnlh7vlk6rkuKrpgInpoblcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNDb3JyZWN0ID0gYW5zd2VyLnRvVXBwZXJDYXNlKCkgPT09ICdBJztcbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5q2j56Gu5Zyo5YmN77yMQeWvueW6lOesrOS4gOS4qumAiemhue+8m+WmguaenOmUmeivr+WcqOWJje+8jEHlr7nlupTnrKzkuozkuKrpgInpoblcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSBjb3JyZWN0Rmlyc3QgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgIChpc0NvcnJlY3QgPyAxIDogMikgOiAvLyDmraPnoa7lnKjliY3vvJpB6YCJMe+8jELpgIkyXG4gICAgICAgICAgICAgICAgICAgICAgICAoaXNDb3JyZWN0ID8gMiA6IDEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldE9wdGlvbiA9IHF1ZXN0aW9uLmVsZW1lbnQucXVlcnlTZWxlY3RvcihgLm9wdGlvbjpudGgtY2hpbGQoJHt0YXJnZXRJbmRleH0pYCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRPcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKGDngrnlh7vliKTmlq3popjpgInpobnvvJoke2lzQ29ycmVjdCA/ICfmraPnoa4nIDogJ+mUmeivryd9ICjnrKwke3RhcmdldEluZGV4feS4qumAiemhuSlgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE9wdGlvbi5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoJ+acquaJvuWIsOWIpOaWremimOeahOmAiemhueWFg+e0oCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxdWVzdGlvbi50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5aGr56m66aKY5oiW566A562U6aKYXG4gICAgICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbi5ibGFua3MgJiYgcXVlc3Rpb24uYmxhbmtzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhuWhq+epuumimFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoYOesrCAke2luZGV4fSDpopjmmK/loavnqbrpopjvvIzloavnqbrmlbDph4/vvJoke3F1ZXN0aW9uLmJsYW5rcy5sZW5ndGh9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbnN3ZXJzID0gYW5zd2VyLnNwbGl0KCc6OjonKS5tYXAoYSA9PiBhLnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHF1ZXN0aW9uLmJsYW5rcy5sZW5ndGggJiYgaSA8IGFuc3dlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBibGFuayA9IHF1ZXN0aW9uLmJsYW5rc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFuay5lbGVtZW50LnZhbHVlID0gYW5zd2Vyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFuay5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhbmsuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhueugOetlOmimFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoYOesrCAke2luZGV4fSDpopjmmK/nroDnrZTpophgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1ZVRpdGxlID0gcXVlc3Rpb24uZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucXVlLXRpdGxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVlVGl0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0YXJlYSA9IHF1ZVRpdGxlLm5leHRFbGVtZW50U2libGluZz8ucXVlcnlTZWxlY3RvcignLmVsLXRleHRhcmVhX19pbm5lcicpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHRhcmVhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKCfmib7liLDnroDnrZTpopjnmoR0ZXh0YXJlYeWFg+e0oCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9IGFuc3dlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dGFyZWEuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dGFyZWEuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoJ+acquaJvuWIsOeugOetlOmimOeahHRleHRhcmVh5YWD57SgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zygn5pyq5om+5Yiw566A562U6aKY55qEcXVlLXRpdGxl5YWD57SgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDpgInmi6npopjvvIjljZXpgInjgIHlpJrpgInvvIlcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoYOesrCAke2luZGV4fSDpopjmmK/pgInmi6npopjvvIzlvIDlp4vlpITnkIbpgInpobnnrZTmoYhgKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wcm9jZXNzT3B0aW9uQW5zd2VyKGluZGV4LCBhbnN3ZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlYnVnKCflpITnkIZBSeWTjeW6lOWksei0pe+8micgKyBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzT3B0aW9uQW5zd2VyKHF1ZXN0aW9uSW5kZXg6IG51bWJlciwgYW5zd2VyOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9ucy5maW5kKHEgPT4gcS5pbmRleCA9PT0gcXVlc3Rpb25JbmRleCk7XG4gICAgICAgIGlmICghcXVlc3Rpb24gfHwgIXF1ZXN0aW9uLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGRlYnVnKGDlpITnkIbpgInpobnnrZTmoYjlpLHotKXvvJrmnKrmib7liLDpopjnm64gJHtxdWVzdGlvbkluZGV4fSDmiJbpopjnm67msqHmnInpgInpoblgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlYnVnKGDlpITnkIbnrKwgJHtxdWVzdGlvbkluZGV4fSDpopjpgInpobnnrZTmoYjvvJpcXG7popjlnovvvJoke3F1ZXN0aW9uLnR5cGV9XFxu562U5qGI77yaJHthbnN3ZXJ9XFxu5Y+v55So6YCJ6aG577yaJHtxdWVzdGlvbi5vcHRpb25zLmpvaW4oJywgJyl9YCk7XG5cbiAgICAgICAgLy8g5aSE55CG5Y2V6YCJ6aKY5ZKM5aSa6YCJ6aKYXG4gICAgICAgIGxldCBhbnN3ZXJMZXR0ZXJzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBpZiAoYW5zd2VyLmluY2x1ZGVzKCcmJykpIHtcbiAgICAgICAgICAgIC8vIOWkhOeQhuWkmumAiemimOagvOW8jyBcIkEmQiZDXCJcbiAgICAgICAgICAgIGFuc3dlckxldHRlcnMgPSBhbnN3ZXIudG9VcHBlckNhc2UoKS5zcGxpdCgnJicpO1xuICAgICAgICB9IGVsc2UgaWYgKGFuc3dlci5pbmNsdWRlcygnLCcpKSB7XG4gICAgICAgICAgICAvLyDlpITnkIblpJrpgInpopjmoLzlvI8gXCJBLEIsQ1wiXG4gICAgICAgICAgICBhbnN3ZXJMZXR0ZXJzID0gYW5zd2VyLnRvVXBwZXJDYXNlKCkuc3BsaXQoJywnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOWkhOeQhuWNlemAiemimOagvOW8jyBcIkFcIiDmiJblhbbku5bmoLzlvI9cbiAgICAgICAgICAgIGFuc3dlckxldHRlcnMgPSBbYW5zd2VyLnRvVXBwZXJDYXNlKCkuY2hhckF0KDApXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZGVidWcoYOetlOahiOWtl+avje+8miR7YW5zd2VyTGV0dGVycy5qb2luKCcsICcpfWApO1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBsZXR0ZXIgb2YgYW5zd2VyTGV0dGVycykge1xuICAgICAgICAgICAgLy8g5om+5Yiw5a+55bqU6YCJ6aG555qE57Si5byV77yIQT0wLCBCPTEsIEM9MiwgRD0z77yJXG4gICAgICAgICAgICBjb25zdCBvcHRpb25JbmRleCA9IGxldHRlci50cmltKCkuY2hhckF0KDApLmNoYXJDb2RlQXQoMCkgLSAnQScuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25JbmRleCA+PSAwICYmIG9wdGlvbkluZGV4IDwgcXVlc3Rpb24ub3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRPcHRpb24gPSBxdWVzdGlvbi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5vcHRpb246bnRoLWNoaWxkKCR7b3B0aW9uSW5kZXggKyAxfSlgKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0T3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGDngrnlh7vpgInpobkgJHtsZXR0ZXJ977yaJHtxdWVzdGlvbi5vcHRpb25zW29wdGlvbkluZGV4XX1gKTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0T3B0aW9uLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoYOacquaJvuWIsOmAiemhuSAke2xldHRlcn0g55qE5YWD57SgYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWJ1Zyhg6YCJ6aG557Si5byV6LaF5Ye66IyD5Zu077yaJHtsZXR0ZXJ9IC0+ICR7b3B0aW9uSW5kZXh9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHByb2Nlc3NCbGFua0Fuc3dlcihxdWVzdGlvbkluZGV4OiBudW1iZXIsIGJsYW5rTnVtYmVyOiBudW1iZXIsIGFuc3dlcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHF1ZXN0aW9uID0gdGhpcy5xdWVzdGlvbnMuZmluZChxID0+IHEuaW5kZXggPT09IHF1ZXN0aW9uSW5kZXgpO1xuICAgICAgICBpZiAoIXF1ZXN0aW9uIHx8ICFxdWVzdGlvbi5ibGFua3MpIHJldHVybjtcblxuICAgICAgICAvLyDmib7liLDlr7nlupTnmoTloavnqbrmoYZcbiAgICAgICAgY29uc3QgYmxhbmsgPSBxdWVzdGlvbi5ibGFua3MuZmluZChiID0+IGIubnVtYmVyID09PSBibGFua051bWJlcik7XG4gICAgICAgIGlmICghYmxhbmspIHJldHVybjtcblxuICAgICAgICAvLyDorr7nva7nrZTmoYhcbiAgICAgICAgYmxhbmsuZWxlbWVudC52YWx1ZSA9IGFuc3dlcjtcbiAgICAgICAgYmxhbmsuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICBibGFuay5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdG9wQXV0b0Fuc3dlcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pc1Byb2Nlc3NpbmcgPSBmYWxzZTtcbiAgICAgICAgZGVidWcoJ+WBnOatouiHquWKqOetlOmimCcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRRdWVzdGlvbnMoKTogUXVlc3Rpb25bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXN0aW9ucztcbiAgICB9XG59ICIsImltcG9ydCBzdHlsZXMgZnJvbSAnLi4vc3R5bGVzL2F1dG8tYW5zd2VyLm1vZHVsZS5jc3MnO1xuaW1wb3J0IHsgZ2V0Q29uZmlnLCBzYXZlQ29uZmlnLCBkZWJ1ZywgQ29uZmlnIH0gZnJvbSAnLi4vdXRpbHMvY29uZmlnJztcbmltcG9ydCB7IEFuc3dlckhhbmRsZXIgfSBmcm9tICcuLi91dGlscy9hbnN3ZXInO1xuaW1wb3J0IHsgQVBJRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL2FwaS9mYWN0b3J5JztcblxuZXhwb3J0IGNsYXNzIENvbmZpZ1BhbmVsIHtcbiAgICBwcml2YXRlIHBhbmVsOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIGFuc3dlckhhbmRsZXI6IEFuc3dlckhhbmRsZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wYW5lbCA9IHRoaXMuY3JlYXRlUGFuZWwoKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJIYW5kbGVyID0gQW5zd2VySGFuZGxlci5nZXRJbnN0YW5jZSgpO1xuICAgICAgICB0aGlzLmluaXRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVBhbmVsKCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3QgcGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcGFuZWwuY2xhc3NOYW1lID0gc3R5bGVzLmNvbmZpZ1BhbmVsO1xuICAgICAgICBwYW5lbC5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMucGFuZWxIZWFkZXJ9XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLmNsb3NlQnRufVwiIHRpdGxlPVwi5YWz6ZetXCI+w5c8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLnRhYkNvbnRhaW5lcn1cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMudGFifSAke3N0eWxlcy5hY3RpdmV9XCIgZGF0YS10YWI9XCJxdWVzdGlvbnNcIj7or4bliKvpopjnm648L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMudGFifVwiIGRhdGEtdGFiPVwiYXBpXCI+QVBJ6YWN572uPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy50YWJDb250ZW50fSAke3N0eWxlcy5hY3RpdmV9XCIgaWQ9XCJxdWVzdGlvbnMtdGFiXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLnF1ZXN0aW9uR3JpZH1cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMucXVlc3Rpb25EZXRhaWx9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxwPuivt+eCueWHu+mimOWPt+afpeeci+ivpue7huS/oeaBrzwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMuYnRuQ29udGFpbmVyfVwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiJHtzdHlsZXMuYnRufSAke3N0eWxlcy5idG5QcmltYXJ5fVwiIGlkPVwidG9nZ2xlLWFuc3dlclwiPuW8gOWni+etlOmimDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiJHtzdHlsZXMuYnRufSAke3N0eWxlcy5idG5EZWZhdWx0fVwiIGlkPVwic2Nhbi1xdWVzdGlvbnNcIj7ph43mlrDmiavmj488L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLnRhYkNvbnRlbnR9XCIgaWQ9XCJhcGktdGFiXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLmFwaUNvbmZpZ31cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLmZvcm1JdGVtfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPkFQSeexu+WeizwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiYXBpLXR5cGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwia2ltaVwiPktpbWk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZGVlcHNlZWtcIj5EZWVwc2Vlazwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJjaGF0Z3B0XCI+Q2hhdEdQVDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMuZm9ybUl0ZW19XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+QVBJ5a+G6ZKlPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy5pbnB1dEdyb3VwfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cImFwaS1rZXlcIiBwbGFjZWhvbGRlcj1cIuivt+i+k+WFpUFQSeWvhumSpVwiIHZhbHVlPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRvZ2dsZS1wYXNzd29yZFwiIHRpdGxlPVwi5pi+56S6L+makOiXj+WvhueggVwiPvCfkYHvuI88L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLmFwaUtleUhlbHB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+QVBJ5a+G6ZKl5qC85byP6K+05piO77yaPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPktpbWk6IOS7pSBzay0g5byA5aS0PC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkRlZXBzZWVrOiDku6Ugc2stIOW8gOWktDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5DaGF0R1BUOiDku6Ugc2stIOW8gOWktDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLmJ0bkNvbnRhaW5lcn1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCIke3N0eWxlcy5idG59ICR7c3R5bGVzLmJ0blByaW1hcnl9XCIgaWQ9XCJ0ZXN0LWFwaVwiPua1i+ivlei/nuaOpTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIiR7c3R5bGVzLmJ0bn0gJHtzdHlsZXMuYnRuUHJpbWFyeX1cIiBpZD1cInNhdmUtYXBpXCI+5L+d5a2Y6YWN572uPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiJHtzdHlsZXMuYnRufSAke3N0eWxlcy5idG5EZWZhdWx0fVwiIGlkPVwiY2xvc2UtcGFuZWxcIj7lhbPpl608L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwYW5lbCk7XG4gICAgICAgIHJldHVybiBwYW5lbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRFdmVudHMoKTogdm9pZCB7XG4gICAgICAgIC8vIOWFs+mXreaMiemSruS6i+S7tlxuICAgICAgICB0aGlzLnBhbmVsLnF1ZXJ5U2VsZWN0b3IoYC4ke3N0eWxlcy5jbG9zZUJ0bn1gKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5YWz6Zet6Z2i5p2/5oyJ6ZKu5LqL5Lu2XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZS1wYW5lbCcpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDliIfmjaLlr4bnoIHmmL7npLrnirbmgIFcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1wYXNzd29yZCcpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICAgICAgIGlucHV0LnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gJ/CflJInO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcbiAgICAgICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSAn8J+Rge+4jyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOWIh+aNouagh+etvumhtVxuICAgICAgICB0aGlzLnBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3N0eWxlcy50YWJ9YCkuZm9yRWFjaCh0YWIgPT4ge1xuICAgICAgICAgICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOenu+mZpOaJgOacieagh+etvumhteeahGFjdGl2Zeexu1xuICAgICAgICAgICAgICAgIHRoaXMucGFuZWwucXVlcnlTZWxlY3RvckFsbChgLiR7c3R5bGVzLnRhYn1gKS5mb3JFYWNoKHQgPT4gXG4gICAgICAgICAgICAgICAgICAgIHQuY2xhc3NMaXN0LnJlbW92ZShzdHlsZXMuYWN0aXZlKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g56e76Zmk5omA5pyJ5YaF5a655Yy655qEYWN0aXZl57G7XG4gICAgICAgICAgICAgICAgdGhpcy5wYW5lbC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtzdHlsZXMudGFiQ29udGVudH1gKS5mb3JFYWNoKGMgPT4gXG4gICAgICAgICAgICAgICAgICAgIGMuY2xhc3NMaXN0LnJlbW92ZShzdHlsZXMuYWN0aXZlKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5re75Yqg5b2T5YmN5qCH562+6aG155qEYWN0aXZl57G7XG4gICAgICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5hZGQoc3R5bGVzLmFjdGl2ZSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5re75Yqg5a+55bqU5YaF5a655Yy655qEYWN0aXZl57G7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFiSWQgPSAodGFiIGFzIEhUTUxFbGVtZW50KS5kYXRhc2V0LnRhYjtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHt0YWJJZH0tdGFiYCk/LmNsYXNzTGlzdC5hZGQoc3R5bGVzLmFjdGl2ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQVBJ57G75Z6L5YiH5o2i5pe26aqM6K+BQVBJ5a+G6ZKlXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGktdHlwZScpPy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFwaUtleSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgYXBpVHlwZSA9IChldmVudC50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlIGFzICdraW1pJyB8ICdkZWVwc2VlaycgfCAnY2hhdGdwdCc7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlQXBpS2V5KGFwaUtleSwgYXBpVHlwZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFQSeWvhumSpei+k+WFpeaXtuWunuaXtumqjOivgVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpPy5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXBpS2V5ID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IGFwaVR5cGUgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS10eXBlJykgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlIGFzICdraW1pJyB8ICdkZWVwc2VlaycgfCAnY2hhdGdwdCc7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlQXBpS2V5KGFwaUtleSwgYXBpVHlwZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOa1i+ivlUFQSei/nuaOpVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdC1hcGknKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdC1hcGknKTtcbiAgICAgICAgICAgIGlmICghYnV0dG9uKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGFwaUtleSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgYXBpVHlwZSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLXR5cGUnKSBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWUgYXMgJ2tpbWknIHwgJ2RlZXBzZWVrJyB8ICdjaGF0Z3B0JztcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlQXBpS2V5KGFwaUtleSwgYXBpVHlwZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gJ+a1i+ivleS4rS4uLic7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFwaUZhY3RvcnkgPSBBUElGYWN0b3J5LmdldEluc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBhcGlGYWN0b3J5LmdldFByb3ZpZGVyKCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHByb3ZpZGVyLmNoYXQoW1xuICAgICAgICAgICAgICAgICAgICB7IHJvbGU6ICd1c2VyJywgY29udGVudDogJ+S9oOWlve+8jOi/meaYr+S4gOS4qua1i+ivlea2iOaBr+OAguivt+WbnuWkjVwi6L+e5o6l5oiQ5YqfXCLjgIInIH1cbiAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhPy5jaG9pY2VzPy5bMF0/Lm1lc3NhZ2U/LmNvbnRlbnQuaW5jbHVkZXMoJ+i/nuaOpeaIkOWKnycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBUEnov57mjqXmtYvor5XmiJDlip/vvIEnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQVBJ6L+e5o6l5rWL6K+V5aSx6LSl77ya5ZON5bqU5qC85byP5LiN5q2j56GuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnQVBJ6L+e5o6l5rWL6K+V5aSx6LSl77yaJyArIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSAn5rWL6K+V6L+e5o6lJztcbiAgICAgICAgICAgICAgICBidXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5L+d5a2YQVBJ6YWN572uXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlLWFwaScpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFwaUtleSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgYXBpVHlwZSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLXR5cGUnKSBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWUgYXMgJ2tpbWknIHwgJ2RlZXBzZWVrJyB8ICdjaGF0Z3B0JztcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlQXBpS2V5KGFwaUtleSwgYXBpVHlwZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIm+W7uuaWsOeahOmFjee9ruWvueixoVxuICAgICAgICAgICAgY29uc3QgY29uZmlnOiBDb25maWcgPSB7XG4gICAgICAgICAgICAgICAgYXBpVHlwZSxcbiAgICAgICAgICAgICAgICBhcGlLZXksXG4gICAgICAgICAgICAgICAgZGVidWdNb2RlOiB0cnVlIC8vIOS/neaMgem7mOiupOWAvFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5L+d5a2Y6YWN572uXG4gICAgICAgICAgICBzYXZlQ29uZmlnKGNvbmZpZyk7XG5cbiAgICAgICAgICAgIC8vIOmHjee9rkFQSeaPkOS+m+iAhe+8jOi/meagt+S4i+asoeS9v+eUqOaXtuS8muS9v+eUqOaWsOeahOmFjee9rlxuICAgICAgICAgICAgQVBJRmFjdG9yeS5nZXRJbnN0YW5jZSgpLnJlc2V0UHJvdmlkZXIoKTtcblxuICAgICAgICAgICAgYWxlcnQoJ+mFjee9ruW3suS/neWtmCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDlvIDlp4vnrZTpopjmjInpkq7kuovku7ZcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1hbnN3ZXInKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLWFuc3dlcicpO1xuICAgICAgICAgICAgaWYgKCFidXR0b24pIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYW5zd2VySGFuZGxlci5pc1Byb2Nlc3NpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckhhbmRsZXIuc3RvcEF1dG9BbnN3ZXIoKTtcbiAgICAgICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSAn5byA5aeL562U6aKYJztcbiAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZShzdHlsZXMuYnRuRGFuZ2VyKTtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChzdHlsZXMuYnRuUHJpbWFyeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9ICflgZzmraLnrZTpopgnO1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKHN0eWxlcy5idG5QcmltYXJ5KTtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChzdHlsZXMuYnRuRGFuZ2VyKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFuc3dlckhhbmRsZXIuc3RhcnRBdXRvQW5zd2VyKCk7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gJ+W8gOWni+etlOmimCc7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoc3R5bGVzLmJ0bkRhbmdlcik7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoc3R5bGVzLmJ0blByaW1hcnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDph43mlrDmiavmj4/mjInpkq7kuovku7ZcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjYW4tcXVlc3Rpb25zJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hbnN3ZXJIYW5kbGVyLnNjYW5RdWVzdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25HcmlkKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdmFsaWRhdGVBcGlLZXkoYXBpS2V5OiBzdHJpbmcsIGFwaVR5cGU6ICdraW1pJyB8ICdkZWVwc2VlaycgfCAnY2hhdGdwdCcpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHNhdmVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZS1hcGknKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgY29uc3QgdGVzdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0LWFwaScpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuXG4gICAgICAgIC8vIOWmguaenOS4uuepuu+8jOWFgeiuuOmAmui/h++8iOWboOS4uuWPr+iDveaYr+WIneWni+eKtuaAge+8iVxuICAgICAgICBpZiAoIWFwaUtleSkge1xuICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShzdHlsZXMuZXJyb3IpO1xuICAgICAgICAgICAgc2F2ZUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGVzdEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDkuI3og73mnInnqbrmoLxcbiAgICAgICAgaWYgKGFwaUtleS50cmltKCkgIT09IGFwaUtleSkge1xuICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChzdHlsZXMuZXJyb3IpO1xuICAgICAgICAgICAgYWxlcnQoJ0FQSeWvhumSpeS4jeiDveWMheWQq+epuuagvCcpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShzdHlsZXMuZXJyb3IpO1xuICAgICAgICBzYXZlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHRlc3RCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHNob3coKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMucGFuZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIFxuICAgICAgICAvLyDliqDovb3lt7Lkv53lrZjnmoTphY3nva5cbiAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKCk7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLXR5cGUnKSBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWUgPSBjb25maWcuYXBpVHlwZTtcbiAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSBjb25maWcuYXBpS2V5O1xuICAgICAgICBcbiAgICAgICAgLy8g5Y+q5pyJ5b2TQVBJIGtleeS4jeS4uuepuuaXtuaJjemqjOivgVxuICAgICAgICBpZiAoY29uZmlnLmFwaUtleSkge1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUFwaUtleShjb25maWcuYXBpS2V5LCBjb25maWcuYXBpVHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmiavmj4/lubbmmL7npLrpopjnm65cbiAgICAgICAgY29uc3QgcXVlc3Rpb25zID0gYXdhaXQgdGhpcy5hbnN3ZXJIYW5kbGVyLnNjYW5RdWVzdGlvbnMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvbkdyaWQocXVlc3Rpb25zKTtcblxuICAgICAgICAvLyDmt7vliqDpgInpobnngrnlh7vnmoTlhajlsYDlpITnkIblh73mlbBcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLnNlbGVjdE9wdGlvbiA9IChxdWVzdGlvbkluZGV4OiBudW1iZXIsIG9wdGlvbkxldHRlcjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFuc3dlckhhbmRsZXIuc2VsZWN0T3B0aW9uKHF1ZXN0aW9uSW5kZXgsIG9wdGlvbkxldHRlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8g5re75Yqg5aGr56m66aKY6L6T5YWl5qGG5YC85pu05paw55qE5YWo5bGA5aSE55CG5Ye95pWwXG4gICAgICAgICh3aW5kb3cgYXMgYW55KS51cGRhdGVCbGFua1ZhbHVlID0gKHF1ZXN0aW9uSW5kZXg6IG51bWJlciwgYmxhbmtOdW1iZXI6IG51bWJlciwgdmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcXVlc3Rpb24gPSB0aGlzLmFuc3dlckhhbmRsZXIuZ2V0UXVlc3Rpb25zKCkuZmluZChxID0+IHEuaW5kZXggPT09IHF1ZXN0aW9uSW5kZXgpO1xuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uPy5ibGFua3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBibGFuayA9IHF1ZXN0aW9uLmJsYW5rcy5maW5kKGIgPT4gYi5udW1iZXIgPT09IGJsYW5rTnVtYmVyKTtcbiAgICAgICAgICAgICAgICBpZiAoYmxhbmspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxhbmsuZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBibGFuay5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgICAgICAgICAgICAgIGJsYW5rLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUXVlc3Rpb25HcmlkKHF1ZXN0aW9uczogQXJyYXk8eyBpbmRleDogbnVtYmVyOyBjb250ZW50OiBzdHJpbmc7IGFuc3dlcj86IHN0cmluZyB9Pikge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5wYW5lbC5xdWVyeVNlbGVjdG9yKGAuJHtzdHlsZXMucXVlc3Rpb25HcmlkfWApO1xuICAgICAgICBpZiAoIWdyaWQpIHJldHVybjtcblxuICAgICAgICBncmlkLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBxdWVzdGlvbnMuZm9yRWFjaCgocXVlc3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgYm94LmNsYXNzTmFtZSA9IGAke3N0eWxlcy5xdWVzdGlvbkJveH0gJHtxdWVzdGlvbi5hbnN3ZXIgPyBzdHlsZXMuY29tcGxldGVkIDogJyd9YDtcbiAgICAgICAgICAgIGJveC50ZXh0Q29udGVudCA9IHF1ZXN0aW9uLmluZGV4LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBib3gub25jbGljayA9ICgpID0+IHRoaXMuc2hvd1F1ZXN0aW9uRGV0YWlsKHF1ZXN0aW9uKTtcbiAgICAgICAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGhpZGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGFuZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3dRdWVzdGlvbkRldGFpbChxdWVzdGlvbjogUXVlc3Rpb24pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGV0YWlsID0gdGhpcy5wYW5lbC5xdWVyeVNlbGVjdG9yKGAuJHtzdHlsZXMucXVlc3Rpb25EZXRhaWx9YCk7XG4gICAgICAgIGlmICghZGV0YWlsKSByZXR1cm47XG5cbiAgICAgICAgZGV0YWlsLmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAyMHB4O1wiPlxuICAgICAgICAgICAgICAgIDxoNCBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDEycHg7IGNvbG9yOiAjMzAzMTMzO1wiPumimOebruWGheWuue+8mjwvaDQ+XG4gICAgICAgICAgICAgICAgPHAgc3R5bGU9XCJsaW5lLWhlaWdodDogMS42OyBjb2xvcjogIzYwNjI2NjtcIj4ke3F1ZXN0aW9uLmNvbnRlbnQuc3BsaXQoJ1xcbicpLmpvaW4oJzxicj4nKX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICR7cXVlc3Rpb24ub3B0aW9ucyA/IGBcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3B0aW9ucy1zZWN0aW9uXCIgc3R5bGU9XCJtYXJnaW46IDIwcHggMDtcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0IHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMTJweDsgY29sb3I6ICMzMDMxMzM7XCI+6YCJ6aG577yaPC9oND5cbiAgICAgICAgICAgICAgICAgICAgPHVsIHN0eWxlPVwibGlzdC1zdHlsZTogbm9uZTsgcGFkZGluZy1sZWZ0OiAwO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHtxdWVzdGlvbi5vcHRpb25zLm1hcChvcHRpb24gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWIpOaWremimOeJueauiuWkhOeQhlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbi50eXBlID09PSAnanVkZ2VtZW50Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0NvcnJlY3RPcHRpb24gPSBvcHRpb24uc3RhcnRzV2l0aCgnQScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIHN0eWxlPVwibWFyZ2luOiAxMnB4IDA7IHBhZGRpbmc6IDhweCAxMnB4OyBiYWNrZ3JvdW5kOiAjZjVmN2ZhOyBib3JkZXItcmFkaXVzOiA0cHg7IGN1cnNvcjogcG9pbnRlcjsgdHJhbnNpdGlvbjogYWxsIDAuM3M7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25tb3VzZW92ZXI9XCJ0aGlzLnN0eWxlLmJhY2tncm91bmQ9JyNlY2Y1ZmYnXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25tb3VzZW91dD1cInRoaXMuc3R5bGUuYmFja2dyb3VuZD0nI2Y1ZjdmYSdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ3aW5kb3cuc2VsZWN0T3B0aW9uKCR7cXVlc3Rpb24uaW5kZXh9LCAnJHtvcHRpb24uY2hhckF0KDApfScpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cImZvbnQtd2VpZ2h0OiBib2xkOyBtYXJnaW4tcmlnaHQ6IDEwcHg7XCI+JHtvcHRpb24uY2hhckF0KDApfS48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHtpc0NvcnJlY3RPcHRpb24gPyAn5q2j56GuJyA6ICfplJnor68nfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWFtuS7lumimOWei+ato+W4uOaYvuekulxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBzdHlsZT1cIm1hcmdpbjogMTJweCAwOyBwYWRkaW5nOiA4cHggMTJweDsgYmFja2dyb3VuZDogI2Y1ZjdmYTsgYm9yZGVyLXJhZGl1czogNHB4OyBjdXJzb3I6IHBvaW50ZXI7IHRyYW5zaXRpb246IGFsbCAwLjNzO1wiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25tb3VzZW92ZXI9XCJ0aGlzLnN0eWxlLmJhY2tncm91bmQ9JyNlY2Y1ZmYnXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbm1vdXNlb3V0PVwidGhpcy5zdHlsZS5iYWNrZ3JvdW5kPScjZjVmN2ZhJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwid2luZG93LnNlbGVjdE9wdGlvbigke3F1ZXN0aW9uLmluZGV4fSwgJyR7b3B0aW9uLmNoYXJBdCgwKX0nKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID4ke29wdGlvbn08L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5qb2luKCcnKX1cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIGAgOiAnJ31cbiAgICAgICAgICAgICR7cXVlc3Rpb24uYW5zd2VyID8gYFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnN3ZXItc2VjdGlvblwiIHN0eWxlPVwibWFyZ2luLXRvcDogMjBweDtcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0IHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMTJweDsgY29sb3I6ICMzMDMxMzM7XCI+562U5qGI77yaPC9oND5cbiAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9XCJsaW5lLWhlaWdodDogMS42OyBjb2xvcjogIzQwOUVGRjtcIj4ke3F1ZXN0aW9uLmFuc3dlcn08L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBgIDogJyd9XG4gICAgICAgIGA7XG4gICAgfVxufSAiLCJpbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGVzL2F1dG8tYW5zd2VyLm1vZHVsZS5jc3MnO1xuaW1wb3J0IHsgZGVidWcgfSBmcm9tICcuL3V0aWxzL2NvbmZpZyc7XG5pbXBvcnQgeyBDb25maWdQYW5lbCB9IGZyb20gJy4vY29tcG9uZW50cy9Db25maWdQYW5lbCc7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgZGVidWcoJ+W8gOWni+WIneWni+WMlicpO1xuICAgICAgICBcbiAgICAgICAgLy8g5Yib5bu66YWN572u5oyJ6ZKuXG4gICAgICAgIGNvbnN0IGNvbmZpZ0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBjb25maWdCdG4uY2xhc3NOYW1lID0gc3R5bGVzLmNvbmZpZ0J0bjtcbiAgICAgICAgY29uZmlnQnRuLnRleHRDb250ZW50ID0gJ+Kame+4jyc7XG4gICAgICAgIFxuICAgICAgICAvLyDliJvlu7rphY3nva7pnaLmnb/lrp7kvotcbiAgICAgICAgY29uc3QgY29uZmlnUGFuZWwgPSBuZXcgQ29uZmlnUGFuZWwoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOeCueWHu+mFjee9ruaMiemSruaYvuekuumdouadv1xuICAgICAgICBjb25maWdCdG4ub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbmZpZ1BhbmVsLnNob3coKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29uZmlnQnRuKTtcbiAgICAgICAgZGVidWcoJ+WIneWni+WMluWujOaIkCcpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGRlYnVnKCfliJ3lp4vljJblpLHotKU6ICcgKyBlcnJvci5tZXNzYWdlKTtcbiAgICB9XG59XG5cbi8vIOetieW+hemhtemdouWKoOi9veWujOaIkOWQjuWGjeWIneWni+WMllxuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICAgIGRlYnVnKCfnrYnlvoXpobXpnaLliqDovb0nKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdCk7XG59IGVsc2Uge1xuICAgIGRlYnVnKCfpobXpnaLlt7LliqDovb3vvIznm7TmjqXliJ3lp4vljJYnKTtcbiAgICBpbml0KCk7XG59XG4iXSwibmFtZXMiOlsiZGVmYXVsdENvbmZpZyIsImFwaVR5cGUiLCJhcGlLZXkiLCJkZWJ1Z01vZGUiLCJnZXRDb25maWciLCJzYXZlZENvbmZpZyIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJzYXZlQ29uZmlnIiwiY29uZmlnIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImRlYnVnIiwibWVzc2FnZSIsImNvbnNvbGUiLCJsb2ciLCJnbG9iYWwiLCJmYWlscyIsInJlcXVpcmUkJDAiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IiLCJjbGFzc29mUmF3IiwiY2xhc3NvZiIsInJlcXVpcmUkJDEiLCJyZXF1aXJlT2JqZWN0Q29lcmNpYmxlIiwidG9JbmRleGVkT2JqZWN0IiwiaXNDYWxsYWJsZSIsImlzT2JqZWN0IiwiZ2V0QnVpbHRJbiIsIk5BVElWRV9TWU1CT0wiLCJVU0VfU1lNQk9MX0FTX1VJRCIsInJlcXVpcmUkJDIiLCJpc1N5bWJvbCIsInRyeVRvU3RyaW5nIiwiYUNhbGxhYmxlIiwiZ2V0TWV0aG9kIiwib3JkaW5hcnlUb1ByaW1pdGl2ZSIsInNldEdsb2JhbCIsInN0b3JlIiwic2hhcmVkTW9kdWxlIiwidG9PYmplY3QiLCJ1aWQiLCJzaGFyZWQiLCJoYXNPd24iLCJyZXF1aXJlJCQzIiwicmVxdWlyZSQkNCIsInJlcXVpcmUkJDUiLCJTeW1ib2wiLCJ3ZWxsS25vd25TeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsInRvUHJvcGVydHlLZXkiLCJkb2N1bWVudCIsIkVYSVNUUyIsImRvY3VtZW50Q3JlYXRlRWxlbWVudCIsIkRFU0NSSVBUT1JTIiwiSUU4X0RPTV9ERUZJTkUiLCJyZXF1aXJlJCQ2IiwiYW5PYmplY3QiLCJkZWZpbmVQcm9wZXJ0eU1vZHVsZSIsImNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSIsImluc3BlY3RTb3VyY2UiLCJXZWFrTWFwIiwic2hhcmVkS2V5IiwiaGlkZGVuS2V5cyIsInJlcXVpcmUkJDciLCJJbnRlcm5hbFN0YXRlTW9kdWxlIiwiZ2V0SW50ZXJuYWxTdGF0ZSIsInJlZGVmaW5lTW9kdWxlIiwidG9JbnRlZ2VyT3JJbmZpbml0eSIsIm1pbiIsInRvQWJzb2x1dGVJbmRleCIsInRvTGVuZ3RoIiwibGVuZ3RoT2ZBcnJheUxpa2UiLCJlbnVtQnVnS2V5cyIsImludGVybmFsT2JqZWN0S2V5cyIsIm93bktleXMiLCJjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzIiwiaXNGb3JjZWQiLCJyZWRlZmluZSIsImFuSW5zdGFuY2UiLCJvYmplY3RLZXlzIiwiaHRtbCIsIklFX1BST1RPIiwiSVRFUkFUT1IiLCJJdGVyYXRvclByb3RvdHlwZSIsIiQiLCJyZXF1aXJlJCQ4IiwiVE9fU1RSSU5HX1RBRyIsIkl0ZXJhdG9ycyIsImlzQXJyYXlJdGVyYXRvck1ldGhvZCIsImdldEl0ZXJhdG9yTWV0aG9kIiwiZ2V0SXRlcmF0b3IiLCJpdGVyYXRvckNsb3NlIiwiaXRlcmF0ZSIsInJlZGVmaW5lQWxsIiwiY2FsbFdpdGhTYWZlSXRlcmF0aW9uQ2xvc2luZyIsImNyZWF0ZUl0ZXJhdG9yUHJveHkiLCJJdGVyYXRvclByb3h5IiwiUHJvbXB0R2VuZXJhdG9yIiwiZm9ybWF0UXVlc3Rpb25zIiwicXVlc3Rpb25zIiwibWFwIiwicSIsInF1ZXN0aW9uVGV4dCIsImluZGV4IiwiY29udGVudCIsIm9wdGlvbnMiLCJvcHQiLCJqb2luIiwidHlwZSIsImJsYW5rcyIsImxlbmd0aCIsImdldFF1ZXN0aW9uVHlwZUluc3RydWN0aW9ucyIsInRyaW0iLCJnZXRUeXBlVGl0bGUiLCJnZW5lcmF0ZVByb21wdCIsInF1ZXN0aW9uc0J5VHlwZSIsInJlZHVjZSIsImFjYyIsInB1c2giLCJwcm9tcHQiLCJPYmplY3QiLCJlbnRyaWVzIiwiRXZlbnRFbWl0dGVyIiwiY29uc3RydWN0b3IiLCJldmVudHMiLCJNYXAiLCJvbiIsImV2ZW50IiwiY2FsbGJhY2siLCJoYXMiLCJzZXQiLCJnZXQiLCJvZmYiLCJjYWxsYmFja3MiLCJpbmRleE9mIiwic3BsaWNlIiwiZGVsZXRlIiwiZW1pdCIsImFyZ3MiLCJmb3JFYWNoIiwiZXJyb3IiLCJCYXNlQVBJUHJvdmlkZXIiLCJiYXNlVVJMIiwiZ2V0RGVmYXVsdEJhc2VVUkwiLCJNb29uc2hvdEFQSVByb3ZpZGVyIiwiZ2V0RGVmYXVsdEhlYWRlcnMiLCJjdXN0b21GZXRjaCIsImVuZHBvaW50IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJHTV94bWxodHRwUmVxdWVzdCIsIm1ldGhvZCIsInVybCIsImhlYWRlcnMiLCJkYXRhIiwiYm9keSIsInVuZGVmaW5lZCIsInJlc3BvbnNlVHlwZSIsIm9ubG9hZCIsInJlc3BvbnNlIiwic3RhdHVzIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25lcnJvciIsImNoYXQiLCJtZXNzYWdlcyIsIm1vZGVsIiwicm9sZSIsInRlbXBlcmF0dXJlIiwiY29kZSIsImVtYmVkZGluZ3MiLCJpbnB1dCIsIkFycmF5IiwiaXNBcnJheSIsIkRlZXBTZWVrQVBJUHJvdmlkZXIiLCJBUElGYWN0b3J5IiwicHJvdmlkZXIiLCJnZXRJbnN0YW5jZSIsImluc3RhbmNlIiwiZ2V0UHJvdmlkZXIiLCJyZXNldFByb3ZpZGVyIiwiY2xlYW5UZXh0IiwidGV4dCIsImNsZWFuZWQiLCJyZXBsYWNlIiwiZmlyc3RMZWZ0QnJhY2tldCIsImxhc3RSaWdodEJyYWNrZXQiLCJsYXN0SW5kZXhPZiIsImJlZm9yZUJyYWNrZXQiLCJzdWJzdHJpbmciLCJhZnRlckJyYWNrZXQiLCJpbnNpZGVCcmFja2V0Iiwic3RyaW5nU2ltaWxhcml0eSIsInN0cjEiLCJzdHIyIiwibGVuMSIsImxlbjIiLCJtYXRyaXgiLCJmaWxsIiwiaSIsImoiLCJjb3N0IiwiTWF0aCIsIm1heExlbiIsIm1heCIsIkFuc3dlckhhbmRsZXIiLCJpc1Byb2Nlc3NpbmciLCJzY2FuUXVlc3Rpb25zIiwic2luZ2xlIiwibXVsdGlwbGUiLCJqdWRnZW1lbnQiLCJncm91cExpc3QiLCJxdWVyeVNlbGVjdG9yIiwiZ3JvdXBzIiwicXVlcnlTZWxlY3RvckFsbCIsInF1ZXN0aW9uSW5kZXgiLCJncm91cCIsInRpdGxlRWwiLCJncm91cFRpdGxlIiwidGV4dENvbnRlbnQiLCJxdWVzdGlvblR5cGUiLCJxdWVzdGlvbkNvdW50IiwidG90YWxTY29yZSIsInRpdGxlSW5mbyIsIm1hdGNoIiwiXyIsInR5cGVUZXh0IiwiY291bnQiLCJzY29yZSIsInBhcnNlSW50IiwiaW5jbHVkZXMiLCJxdWVzdGlvbkVsZW1lbnRzIiwicXVlc3Rpb25FbCIsInRpdGxlQ29udGVudCIsInRpdGxlVGV4dCIsImFsbFBhcmFncmFwaHMiLCJmcm9tIiwicCIsImNvZGVTcGFucyIsInNwYW4iLCJpbm5lckhUTUwiLCJmaWx0ZXIiLCJvcHRpb25MaXN0Iiwib3B0aW9uRWxlbWVudHMiLCJvcHRpb25FbCIsIml0ZW0iLCJvcHRDb250ZW50IiwicXVlc3Rpb24iLCJlbGVtZW50IiwidGV4dFF1ZSIsIm5leHRFbGVtZW50U2libGluZyIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwib3B0cyIsIm51bWJlclNwYW4iLCJpbnB1dFdyYXBwZXIiLCJudW1iZXIiLCJkZXRlY3RRdWVzdGlvblR5cGUiLCJjb250YWluZXIiLCJ0b0xvd2VyQ2FzZSIsIm9wdGlvbkNvdW50IiwiaXNNdWx0aXBsZSIsIm9wdGlvbiIsImV4dHJhY3RPcHRpb25zIiwiYWRkIiwiY2xlYW5PcHRpb24iLCJnZXRBbnN3ZXIiLCJmZXRjaCIsIm9rIiwicmVzdWx0IiwianNvbiIsImNvbmZpZGVuY2UiLCJzaW1pbGFyaXRpZXMiLCJhbnN3ZXIiLCJzdWJtaXRBbnN3ZXIiLCJhbnN3ZXJzIiwic3BsaXQiLCJhIiwib3B0aW9uVGV4dCIsInNob3VsZENoZWNrIiwic29tZSIsImFucyIsImNoZWNrZWQiLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJidWJibGVzIiwidHJ1ZVdvcmRzIiwiaXNUcnVlIiwid29yZCIsInZhbHVlIiwic3RhcnRBdXRvQW5zd2VyIiwiYXBpRmFjdG9yeSIsImNob2ljZXMiLCJwcm9jZXNzQUlSZXNwb25zZSIsImNsZWFuZWRSZXNwb25zZSIsImUiLCJxdWVzdGlvbk51bWJlciIsImlzTmFOIiwiZmluZCIsImNvcnJlY3RGaXJzdCIsImlzQ29ycmVjdCIsInRvVXBwZXJDYXNlIiwidGFyZ2V0SW5kZXgiLCJ0YXJnZXRPcHRpb24iLCJjbGljayIsImJsYW5rIiwicXVlVGl0bGUiLCJ0ZXh0YXJlYSIsInByb2Nlc3NPcHRpb25BbnN3ZXIiLCJhbnN3ZXJMZXR0ZXJzIiwiY2hhckF0IiwibGV0dGVyIiwib3B0aW9uSW5kZXgiLCJjaGFyQ29kZUF0IiwicHJvY2Vzc0JsYW5rQW5zd2VyIiwiYmxhbmtOdW1iZXIiLCJiIiwic3RvcEF1dG9BbnN3ZXIiLCJnZXRRdWVzdGlvbnMiLCJDb25maWdQYW5lbCIsInBhbmVsIiwiY3JlYXRlUGFuZWwiLCJhbnN3ZXJIYW5kbGVyIiwiaW5pdEV2ZW50cyIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJzdHlsZXMiLCJjb25maWdQYW5lbCIsInBhbmVsSGVhZGVyIiwiY2xvc2VCdG4iLCJ0YWJDb250YWluZXIiLCJ0YWIiLCJhY3RpdmUiLCJ0YWJDb250ZW50IiwicXVlc3Rpb25HcmlkIiwicXVlc3Rpb25EZXRhaWwiLCJidG5Db250YWluZXIiLCJidG4iLCJidG5QcmltYXJ5IiwiYnRuRGVmYXVsdCIsImFwaUNvbmZpZyIsImZvcm1JdGVtIiwiaW5wdXRHcm91cCIsImFwaUtleUhlbHAiLCJhcHBlbmRDaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJoaWRlIiwiZ2V0RWxlbWVudEJ5SWQiLCJidXR0b24iLCJ0YXJnZXQiLCJ0IiwicmVtb3ZlIiwiYyIsInRhYklkIiwiZGF0YXNldCIsInZhbGlkYXRlQXBpS2V5IiwiZGlzYWJsZWQiLCJhbGVydCIsImJ0bkRhbmdlciIsInVwZGF0ZVF1ZXN0aW9uR3JpZCIsInNhdmVCdXR0b24iLCJ0ZXN0QnV0dG9uIiwic2hvdyIsInN0eWxlIiwiZGlzcGxheSIsIndpbmRvdyIsInNlbGVjdE9wdGlvbiIsIm9wdGlvbkxldHRlciIsInVwZGF0ZUJsYW5rVmFsdWUiLCJncmlkIiwiYm94IiwicXVlc3Rpb25Cb3giLCJjb21wbGV0ZWQiLCJ0b1N0cmluZyIsIm9uY2xpY2siLCJzaG93UXVlc3Rpb25EZXRhaWwiLCJkZXRhaWwiLCJpc0NvcnJlY3RPcHRpb24iLCJzdGFy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
