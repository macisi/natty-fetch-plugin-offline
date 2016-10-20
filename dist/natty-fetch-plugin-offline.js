(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("natty-fetch"), require("localforage"));
	else if(typeof define === 'function' && define.amd)
		define("nattyFetchPluginOffline", ["natty-fetch", "localforage"], factory);
	else if(typeof exports === 'object')
		exports["nattyFetchPluginOffline"] = factory(require("natty-fetch"), require("localforage"));
	else
		root["nattyFetchPluginOffline"] = factory(root["nattyFetch"], root["localforage"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
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

	"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var _nattyFetch=__webpack_require__(1),_nattyFetch2=_interopRequireDefault(_nattyFetch),_localforage=__webpack_require__(2),_localforage2=_interopRequireDefault(_localforage),_objectAssign=__webpack_require__(3),_objectAssign2=_interopRequireDefault(_objectAssign),_util=__webpack_require__(4),_nattyFetch$_util=_nattyFetch2.default._util,appendQueryString=_nattyFetch$_util.appendQueryString,extend=_nattyFetch$_util.extend,param=_nattyFetch$_util.param,_event=_nattyFetch$_util._event,jsonp=_nattyFetch2.default.jsonp,ajax=_nattyFetch2.default.ajax,localStore={},offlinePlugin=function(e){e.config.customRequest=function(a,n,r){var i=e._path.replace(/\W/g,"_"),o=localStore[i];o||(o=localStore[i]=_localforage2.default.createInstance({name:i}));var c=param((0,_util.removeStaticParam)(a.data,n.data)),l={traditional:n.traditional,cache:n.cache,mark:a.mark,log:n.log,url:n.mock?n.mockUrl:n.url,data:a.data,success:function(t){e.processResponse(a,n,r,t),o.setItem(c,t)},complete:function(){void 0!==a.retryTime&&a.retryTime!==n.retry||(e.api.pending=!1,e.api._requester=null)}},u=void 0;u=n.jsonp?(0,_objectAssign2.default)(l,{flag:n.jsonpFlag,callbackName:n.jsonpCallbackName,error:function e(){var e={message:"Not Accessable JSONP: "+a.mark.__api};r.reject(e),_event.fire("g.reject",[e,n]),_event.fire(t.api.contextId+".reject",[e,n])}}):(0,_objectAssign2.default)(l,{header:n.header,withCredentials:n.withCredentials,accept:"json",error:function e(i){var o=void 0;switch(i){case 404:o="Not Found";break;case 500:o="Internal Server Error";break;default:o="Unknown Server Error"}var e={status:i,message:o+": "+a.mark.__api};r.reject(e),_event.fire("g.reject",[e,n]),_event.fire(t.api.contextId+".reject",[e,n])}});var s=function(){n.jsonp?jsonp(u):ajax(u)};(0,_util.isOnline)().then(function(t){t?s():o.getItem(c).then(function(t){e.processResponse(a,n,r,t)})}).catch(function(){s()})}},plugin={offlinePlugin:offlinePlugin};_nattyFetch2.default.plugin.offline=plugin,exports.default=plugin;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";function toObject(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}function shouldUseNative(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var r={},t=0;t<10;t++)r["_"+String.fromCharCode(t)]=t;var n=Object.getOwnPropertyNames(r).map(function(e){return r[e]});if("0123456789"!==n.join(""))return!1;var o={};return"abcdefghijklmnopqrst".split("").forEach(function(e){o[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},o)).join("")}catch(e){return!1}}var hasOwnProperty=Object.prototype.hasOwnProperty,propIsEnumerable=Object.prototype.propertyIsEnumerable;module.exports=shouldUseNative()?Object.assign:function(e,r){for(var t,n,o=toObject(e),a=1;a<arguments.length;a++){t=Object(arguments[a]);for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);if(Object.getOwnPropertySymbols){n=Object.getOwnPropertySymbols(t);for(var s=0;s<n.length;s++)propIsEnumerable.call(t,n[s])&&(o[n[s]]=t[n[s]])}}return o};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";function isOnline(){return new Promise(function(e,n){dd.device.connection.getNetworkType({onSuccess:function(n){e("none"===n.result?!1:n.result)},onFail:function(e){n(e)}})})}function removeStaticParam(e,n,t){var r={},i=t&&Array.isArray(t)&&t.length>0;return Object.keys(e).forEach(function(o){n.hasOwnProperty(o)||i&&t.indexOf(o)===-1||(r[o]=e[o])}),r}Object.defineProperty(exports,"__esModule",{value:!0}),exports.isOnline=isOnline,exports.removeStaticParam=removeStaticParam;

/***/ }
/******/ ])
});
;