(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("natty-fetch"), require("a-storage"));
	else if(typeof define === 'function' && define.amd)
		define("nattyFetchPluginOffline", ["natty-fetch", "a-storage"], factory);
	else if(typeof exports === 'object')
		exports["nattyFetchPluginOffline"] = factory(require("natty-fetch"), require("a-storage"));
	else
		root["nattyFetchPluginOffline"] = factory(root["nattyFetch"], root["a-storage"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _nattyFetch = __webpack_require__(1);

	var _nattyFetch2 = _interopRequireDefault(_nattyFetch);

	var _objectAssign = __webpack_require__(2);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _md = __webpack_require__(3);

	var _md2 = _interopRequireDefault(_md);

	var _util = __webpack_require__(7);

	var _aStorage = __webpack_require__(8);

	var _aStorage2 = _interopRequireDefault(_aStorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _nattyFetch$_util = _nattyFetch2.default._util,
	    appendQueryString = _nattyFetch$_util.appendQueryString,
	    extend = _nattyFetch$_util.extend,
	    param = _nattyFetch$_util.param,
	    NULL = _nattyFetch$_util.NULL,
	    TRUE = _nattyFetch$_util.TRUE,
	    FALSE = _nattyFetch$_util.FALSE;
	var jsonp = _nattyFetch2.default.jsonp,
	    ajax = _nattyFetch2.default.ajax,
	    _event = _nattyFetch2.default._event;


	var pluginMethods = {
	  getStorageKey: function getStorageKey(param) {
	    return (0, _md2.default)(JSON.stringify(param));
	  },
	  makeRequest: function makeRequest(apiInstance, vars, config, defer) {
	    var _this = this;

	    var key = this.getStorageKey((0, _objectAssign2.default)({}, vars.mark, apiInstance.dynamicParams));

	    apiInstance.offlinePlugin.isOffline().then(function (offline) {
	      if (offline) {
	        apiInstance.offlinePlugin.storage.getItem(key).then(function (content) {
	          defer.resolve(JSON.parse(content));
	        }).catch(function (error) {
	          return defer.reject(error);
	        });
	      } else {
	        if (config.jsonp) {
	          _this.sendJSONP.call(apiInstance, vars, config, key, defer);
	        } else {
	          _this.sendAjax.call(apiInstance, vars, config, key, defer);
	        }
	      }
	    });
	  },
	  sendAjax: function sendAjax(vars, config, key, defer) {
	    var t = this;
	    var url = config.mock ? config.mockUrl : config.url;

	    t.api._requester = ajax({
	      traditional: config.traditional,
	      urlStamp: config.urlStamp,
	      mark: vars.mark,
	      useMark: config.mark,
	      log: config.log,
	      url: url,
	      method: config.method,
	      data: vars.data,
	      header: config.header,
	      withCredentials: config.withCredentials,
	      accept: 'json',
	      success: function success(response) {
	        pluginMethods.processResponse.call(t, vars, config, defer, response, key);
	      },
	      error: function error(status) {
	        // 如果跨域使用了自定义的header，且服务端没有配置允许对应的header，此处status为0，目前无法处理。
	        var error = {
	          status: status,
	          message: 'Error(status ' + status + ') in request for ' + vars.mark._api + '(' + url + ')'
	        };

	        defer.reject(error);
	        _event.fire('g.reject', [error, config]);
	        _event.fire(t.api.contextId + '.reject', [error, config]);
	      },
	      complete: function complete() /*status, xhr*/{
	        if (vars.retryTime === undefined || vars.retryTime === config.retry) {
	          t.api.pending = FALSE;
	          t.api._requester = NULL;
	        }
	      }
	    });
	  },
	  sendJSONP: function sendJSONP(vars, config, key, defer) {
	    var t = this;
	    var url = config.mock ? config.mockUrl : config.url;

	    return jsonp({
	      traditional: config.traditional,
	      log: config.log,
	      mark: vars.mark,
	      useMark: config.mark,
	      url: url,
	      data: vars.data,
	      urlStamp: config.urlStamp,
	      flag: config.jsonpFlag,
	      callbackName: config.jsonpCallbackName,
	      success: function success(response) {
	        pluginMethods.processResponse.call(t, vars, config, defer, response, key);
	      },
	      error: function error() {
	        var error = {
	          message: 'Not accessable JSONP in request for ' + vars.mark._api + '(' + url + ')'
	        };

	        defer.reject(error);
	        _event.fire('g.reject', [error, config]);
	        _event.fire(t.api.contextId + '.reject', [error, config]);
	      },
	      complete: function complete() {
	        if (vars.retryTime === undefined || vars.retryTime === config.retry) {
	          t.api.pending = FALSE;
	          t.api._requester = NULL;
	        }
	      }
	    });
	  },
	  processResponse: function processResponse(vars, config, defer, response, key) {
	    var t = this;
	    // 调用 didFetch 钩子函数
	    config.didFetch(vars, config);

	    // 非标准格式数据的预处理
	    response = config.fit(response, vars);
	    // console.log(vars, config, defer, response);

	    if (response.success) {
	      (function () {
	        // 数据处理
	        var content = config.process(response.content, vars);

	        var resolveDefer = function resolveDefer() {
	          defer.resolve(content);
	          _event.fire('g.resolve', [content, config], config);
	          _event.fire(t.api.contextId + '.resolve', [content, config], config);
	        };

	        // 不再支持内置 storageUseable 配置
	        // TODO: 文档中说明
	        resolveDefer();
	        t.offlinePlugin.storage.setItem(key, JSON.stringify(content));
	      })();
	    } else {
	      var error = extend({
	        message: '`success` is false, ' + t._path
	      }, response.error);
	      // NOTE response是只读的对象!!!
	      defer.reject(error);
	      _event.fire('g.reject', [error, config]);
	      _event.fire(t.api.contextId + '.reject', [error, config]);
	    }
	  }
	};

	var defaultPluginConfig = {
	  driver: _aStorage.DRIVERS.LOCALSTORAGE,
	  offlineEnv: ['2g', '3g', 'unknown', 'none'],
	  getEnvType: _util.getNetworkType
	};

	var NattyFetchPluginOffline = function NattyFetchPluginOffline() {
	  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  config = (0, _objectAssign2.default)(defaultPluginConfig, config);
	  var _config = config,
	      driver = _config.driver,
	      offlineEnv = _config.offlineEnv,
	      getEnvType = _config.getEnvType;

	  var storage = (0, _aStorage2.default)({
	    driver: driver
	  });

	  var isOffline = function isOffline() {
	    return new Promise(function (resolve) {
	      getEnvType().then(function (env) {
	        resolve(offlineEnv.indexOf(env) !== -1);
	      });
	    });
	  };

	  var plugin = function plugin(apiInstance) {
	    apiInstance.offlinePlugin = plugin;
	    var _makeVars = apiInstance.makeVars.bind(apiInstance);
	    // 重新构造内置的 makeVars 以获得动态参数
	    apiInstance.makeVars = function (data) {
	      apiInstance.dynamicParams = data;
	      return _makeVars(data);
	    };
	    apiInstance.config.customRequest = function (vars, config, defer) {
	      pluginMethods.makeRequest(apiInstance, vars, config, defer);
	    };
	  };

	  plugin.isOffline = isOffline;
	  plugin.storage = storage;

	  return plugin;
	};

	exports.default = NattyFetchPluginOffline;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	(function(){
	  var crypt = __webpack_require__(4),
	      utf8 = __webpack_require__(5).utf8,
	      isBuffer = __webpack_require__(6),
	      bin = __webpack_require__(5).bin,

	  // The core
	  md5 = function (message, options) {
	    // Convert to byte array
	    if (message.constructor == String)
	      if (options && options.encoding === 'binary')
	        message = bin.stringToBytes(message);
	      else
	        message = utf8.stringToBytes(message);
	    else if (isBuffer(message))
	      message = Array.prototype.slice.call(message, 0);
	    else if (!Array.isArray(message))
	      message = message.toString();
	    // else, assume byte array already

	    var m = crypt.bytesToWords(message),
	        l = message.length * 8,
	        a =  1732584193,
	        b = -271733879,
	        c = -1732584194,
	        d =  271733878;

	    // Swap endian
	    for (var i = 0; i < m.length; i++) {
	      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
	             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
	    }

	    // Padding
	    m[l >>> 5] |= 0x80 << (l % 32);
	    m[(((l + 64) >>> 9) << 4) + 14] = l;

	    // Method shortcuts
	    var FF = md5._ff,
	        GG = md5._gg,
	        HH = md5._hh,
	        II = md5._ii;

	    for (var i = 0; i < m.length; i += 16) {

	      var aa = a,
	          bb = b,
	          cc = c,
	          dd = d;

	      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
	      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
	      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
	      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
	      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
	      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
	      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
	      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
	      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
	      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
	      c = FF(c, d, a, b, m[i+10], 17, -42063);
	      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
	      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
	      d = FF(d, a, b, c, m[i+13], 12, -40341101);
	      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
	      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

	      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
	      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
	      c = GG(c, d, a, b, m[i+11], 14,  643717713);
	      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
	      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
	      d = GG(d, a, b, c, m[i+10],  9,  38016083);
	      c = GG(c, d, a, b, m[i+15], 14, -660478335);
	      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
	      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
	      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
	      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
	      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
	      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
	      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
	      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
	      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

	      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
	      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
	      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
	      b = HH(b, c, d, a, m[i+14], 23, -35309556);
	      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
	      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
	      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
	      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
	      a = HH(a, b, c, d, m[i+13],  4,  681279174);
	      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
	      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
	      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
	      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
	      d = HH(d, a, b, c, m[i+12], 11, -421815835);
	      c = HH(c, d, a, b, m[i+15], 16,  530742520);
	      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

	      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
	      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
	      c = II(c, d, a, b, m[i+14], 15, -1416354905);
	      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
	      a = II(a, b, c, d, m[i+12],  6,  1700485571);
	      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
	      c = II(c, d, a, b, m[i+10], 15, -1051523);
	      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
	      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
	      d = II(d, a, b, c, m[i+15], 10, -30611744);
	      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
	      b = II(b, c, d, a, m[i+13], 21,  1309151649);
	      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
	      d = II(d, a, b, c, m[i+11], 10, -1120210379);
	      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
	      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

	      a = (a + aa) >>> 0;
	      b = (b + bb) >>> 0;
	      c = (c + cc) >>> 0;
	      d = (d + dd) >>> 0;
	    }

	    return crypt.endian([a, b, c, d]);
	  };

	  // Auxiliary functions
	  md5._ff  = function (a, b, c, d, x, s, t) {
	    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._gg  = function (a, b, c, d, x, s, t) {
	    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._hh  = function (a, b, c, d, x, s, t) {
	    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._ii  = function (a, b, c, d, x, s, t) {
	    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };

	  // Package private blocksize
	  md5._blocksize = 16;
	  md5._digestsize = 16;

	  module.exports = function (message, options) {
	    if (message === undefined || message === null)
	      throw new Error('Illegal argument ' + message);

	    var digestbytes = crypt.wordsToBytes(md5(message, options));
	    return options && options.asBytes ? digestbytes :
	        options && options.asString ? bin.bytesToString(digestbytes) :
	        crypt.bytesToHex(digestbytes);
	  };

	})();


/***/ },
/* 4 */
/***/ function(module, exports) {

	(function() {
	  var base64map
	      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

	  crypt = {
	    // Bit-wise rotation left
	    rotl: function(n, b) {
	      return (n << b) | (n >>> (32 - b));
	    },

	    // Bit-wise rotation right
	    rotr: function(n, b) {
	      return (n << (32 - b)) | (n >>> b);
	    },

	    // Swap big-endian to little-endian and vice versa
	    endian: function(n) {
	      // If number given, swap endian
	      if (n.constructor == Number) {
	        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
	      }

	      // Else, assume array and swap all items
	      for (var i = 0; i < n.length; i++)
	        n[i] = crypt.endian(n[i]);
	      return n;
	    },

	    // Generate an array of any length of random bytes
	    randomBytes: function(n) {
	      for (var bytes = []; n > 0; n--)
	        bytes.push(Math.floor(Math.random() * 256));
	      return bytes;
	    },

	    // Convert a byte array to big-endian 32-bit words
	    bytesToWords: function(bytes) {
	      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
	        words[b >>> 5] |= bytes[i] << (24 - b % 32);
	      return words;
	    },

	    // Convert big-endian 32-bit words to a byte array
	    wordsToBytes: function(words) {
	      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
	        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
	      return bytes;
	    },

	    // Convert a byte array to a hex string
	    bytesToHex: function(bytes) {
	      for (var hex = [], i = 0; i < bytes.length; i++) {
	        hex.push((bytes[i] >>> 4).toString(16));
	        hex.push((bytes[i] & 0xF).toString(16));
	      }
	      return hex.join('');
	    },

	    // Convert a hex string to a byte array
	    hexToBytes: function(hex) {
	      for (var bytes = [], c = 0; c < hex.length; c += 2)
	        bytes.push(parseInt(hex.substr(c, 2), 16));
	      return bytes;
	    },

	    // Convert a byte array to a base-64 string
	    bytesToBase64: function(bytes) {
	      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
	        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
	        for (var j = 0; j < 4; j++)
	          if (i * 8 + j * 6 <= bytes.length * 8)
	            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
	          else
	            base64.push('=');
	      }
	      return base64.join('');
	    },

	    // Convert a base-64 string to a byte array
	    base64ToBytes: function(base64) {
	      // Remove non-base-64 characters
	      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

	      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
	          imod4 = ++i % 4) {
	        if (imod4 == 0) continue;
	        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
	            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
	            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
	      }
	      return bytes;
	    }
	  };

	  module.exports = crypt;
	})();


/***/ },
/* 5 */
/***/ function(module, exports) {

	var charenc = {
	  // UTF-8 encoding
	  utf8: {
	    // Convert a string to a byte array
	    stringToBytes: function(str) {
	      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
	    },

	    // Convert a byte array to a string
	    bytesToString: function(bytes) {
	      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
	    }
	  },

	  // Binary encoding
	  bin: {
	    // Convert a string to a byte array
	    stringToBytes: function(str) {
	      for (var bytes = [], i = 0; i < str.length; i++)
	        bytes.push(str.charCodeAt(i) & 0xFF);
	      return bytes;
	    },

	    // Convert a byte array to a string
	    bytesToString: function(bytes) {
	      for (var str = [], i = 0; i < bytes.length; i++)
	        str.push(String.fromCharCode(bytes[i]));
	      return str.join('');
	    }
	  }
	};

	module.exports = charenc;


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	module.exports = function (obj) {
	  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
	}

	function isBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getNetworkType = getNetworkType;
	/**
	 * 获取设备所处网络环境
	 * @return promise
	 */
	function getNetworkType() {
	  return new Promise(function (resolve) {
	    dd.device.connection.getNetworkType({
	      onSuccess: function onSuccess(data) {
	        resolve(data.result);
	      },
	      onFail: function onFail(err) {
	        resolve('unknown');
	      }
	    });
	  });
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }
/******/ ])
});
;