(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["marky"] = factory();
	else
		root["marky"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 75);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(46), __esModule: true };

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(27)('wks')
  , uid        = __webpack_require__(31)
  , Symbol     = __webpack_require__(3).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Creates an HTML element with some built-in shortcut methods
 * @param {String}      type    tag name for the element
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */Object.defineProperty(exports,'__esModule',{value:true});var Element=exports.Element={init:function init(type){var title=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;var id=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;this.type=type;this.title=title;this.id=id;this.element=this.register();if(this.title)this.element.title=this.title},register:function register(){return document.createElement(this.type)},assign:function assign(prop,value){this.element[prop]=value},appendTo:function appendTo(container){container.appendChild(this.element)},addClass:function addClass(){var _this=this;for(var _len=arguments.length,classNames=Array(_len),_key=0;_key<_len;_key++){classNames[_key]=arguments[_key]}classNames.forEach(function(className){_this.element.classList.add(className.replace(/[ ]/g,'-').toLowerCase())})},removeClass:function removeClass(){var _this2=this;for(var _len2=arguments.length,classNames=Array(_len2),_key2=0;_key2<_len2;_key2++){classNames[_key2]=arguments[_key2]}classNames.forEach(function(className){_this2.element.classList.remove(className.replace(/[ ]/g,'-').toLowerCase())})},listen:function listen(evt,cb){this.element.addEventListener(evt,cb)}};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(12);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(24)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(9)
  , createDesc = __webpack_require__(14);
module.exports = __webpack_require__(6) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(4)
  , IE8_DOM_DEFINE = __webpack_require__(52)
  , toPrimitive    = __webpack_require__(67)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(3)
  , core      = __webpack_require__(5)
  , ctx       = __webpack_require__(21)
  , hide      = __webpack_require__(8)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(27)('keys')
  , uid    = __webpack_require__(31);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,'__esModule',{value:true});exports.Icon=undefined;var _toConsumableArray2=__webpack_require__(44);var _toConsumableArray3=_interopRequireDefault(_toConsumableArray2);var _create=__webpack_require__(0);var _create2=_interopRequireDefault(_create);var _Element=__webpack_require__(2);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * Creates HTML i elements
 * @type {Element}
 * @param {Array} classNames classes to use with element
 */var Icon=exports.Icon=(0,_create2.default)(_Element.Element);Icon.init=function(classNames){_Element.Element.init.call(this,'i');this.addClass.apply(this,(0,_toConsumableArray3.default)(classNames))};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,'__esModule',{value:true});exports.Marky=undefined;var _mark=__webpack_require__(40);var _mark2=_interopRequireDefault(_mark);var _dispatcher=__webpack_require__(38);var dispatcher=_interopRequireWildcard(_dispatcher);var _customEvents=__webpack_require__(19);var _handlers=__webpack_require__(39);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var Marky=exports.Marky={init:function init(){var container=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;var output=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;this.mark=_mark2.default;this.state=[{markdown:'',html:'',selection:[0,0]}];this.index=0;this.editor=editor;this.container=container;this.output=output},/**
   * Removes the container and all descendants from the DOM
   * @param  {container} container the container used to invoke `mark()`
   */destroy:function destroy(){var container=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.container;if(container.parentNode){container.parentNode.removeChild(container)}},/**
   * Handles updating the state on forward-progress changes
   * @requires dispatcher/update
   * @param {String} markdown the new markdown blob
   * @param {Array}  state    the state timeline
   * @param {Number} index    current state index
   */update:function update(markdown){var selection=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[0,0];var state=arguments.length>2&&arguments[2]!==undefined?arguments[2]:this.state;var index=arguments.length>3&&arguments[3]!==undefined?arguments[3]:this.index;var editor=arguments.length>4&&arguments[4]!==undefined?arguments[4]:this.editor;var action=dispatcher.update(markdown,selection,state,index);this.state=action.state;this.index=action.index;editor.dispatchEvent(_customEvents.markychange);return this.index},/**
   * Handles updating the editor's value and selection range
   * @param  {Object} handled value = string; range = start and end of selection
   * @param  {HTMLElement} editor  the marky marked editor
   */updateEditor:function updateEditor(markdown,range){var editor=arguments.length>2&&arguments[2]!==undefined?arguments[2]:this.editor;editor.value=markdown;editor.setSelectionRange(range[0],range[1])},/**
   * Handles updating the hidden input's value
   * @param  {String} html   an HTML string
   * @param  {HTMLElement} output the hidden input storing the HTML string
   */updateOutput:function updateOutput(html){var output=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.output;output.value=html},/**
   * Handles moving backward in state
   * @requires dispatcher/undo
   * @param   {Number}      num    number of states to move back
   * @param   {Array}       state  the state timeline
   * @param   {Number}      index  current state index
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */undo:function undo(){var num=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1;var state=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.state;var index=arguments.length>2&&arguments[2]!==undefined?arguments[2]:this.index;var editor=arguments.length>3&&arguments[3]!==undefined?arguments[3]:this.editor;if(index===0)return index;var action=dispatcher.undo(num,state,index);this.index=action.index;this.updateEditor(action.state.markdown,action.state.selection,editor);editor.dispatchEvent(_customEvents.markychange);return this.index},/**
   * Handles moving forward in state
   * @requires dispatcher/redo
   * @param   {Number}      num    number of states to move back
   * @param   {Array}       state  the state timeline
   * @param   {Number}      index  current state index
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Number}      the new index
   */redo:function redo(){var num=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1;var state=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.state;var index=arguments.length>2&&arguments[2]!==undefined?arguments[2]:this.index;var editor=arguments.length>3&&arguments[3]!==undefined?arguments[3]:this.editor;if(index===state.length-1)return index;var action=dispatcher.redo(num,state,index);this.index=action.index;this.updateEditor(action.state.markdown,action.state.selection,editor);editor.dispatchEvent(_customEvents.markychange);return this.index},/**
   * Setsa the selection indices in the editor
   * @param   {Array}       arr    starting and ending indices
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the array that was passed in
   */setSelection:function setSelection(){var arr=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[0,0];var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;editor.setSelectionRange(arr[0],arr[1]);return arr},/**
   * expands the selection to the right
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new selection indices
   */expandSelectionForward:function expandSelectionForward(){var num=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;var start=editor.selectionStart;var end=editor.selectionEnd+num;editor.setSelectionRange(start,end);return[start,end]},/**
   * expands the selection to the left
   * @param   {Number}      num    number of characters to expand by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new selection indices
   */expandSelectionBackward:function expandSelectionBackward(){var num=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;var start=editor.selectionStart-num;var end=editor.selectionEnd;editor.setSelectionRange(start,end);return[start,end]},/**
   * expands the cursor to the right
   * @param   {Number}      num    number of characters to move by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new cursor position
   */moveCursorBackward:function moveCursorBackward(){var num=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;var start=editor.selectionStart-num;editor.setSelectionRange(start,start);return start},/**
   * expands the cursor to the left
   * @param   {Number}      num    number of characters to move by
   * @param   {HTMLElement} editor the marky marked editor
   * @returns {Array}       the new cursor position
   */moveCursorForward:function moveCursorForward(){var num=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;var start=editor.selectionStart+num;editor.setSelectionRange(start,start);return start},/**
   * implements a bold on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the bold
   */bold:function bold(indices){var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var boldify=(0,_handlers.inlineHandler)(editor.value,indices,'**');this.updateEditor(boldify.value,boldify.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[boldify.range[0],boldify.range[1]]},/**
   * implements an italic on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the italic
   */italic:function italic(indices){var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var italicize=(0,_handlers.inlineHandler)(editor.value,indices,'_');this.updateEditor(italicize.value,italicize.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[italicize.range[0],italicize.range[1]]},/**
   * implements a strikethrough on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the strikethrough
   */strikethrough:function strikethrough(indices){var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var strikitize=(0,_handlers.inlineHandler)(editor.value,indices,'~~');this.updateEditor(strikitize.value,strikitize.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[strikitize.range[0],strikitize.range[1]]},/**
   * implements a code on a selection
   * @requires handlers/inlineHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the code
   */code:function code(indices){var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var codify=(0,_handlers.inlineHandler)(editor.value,indices,'`');this.updateEditor(codify.value,codify.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[codify.range[0],codify.range[1]]},/**
   * implements a blockquote on a selection
   * @requires handlers/blockHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the bold
   */blockquote:function blockquote(indices){var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var quotify=(0,_handlers.blockHandler)(editor.value,indices,'> ');this.updateEditor(quotify.value,quotify.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[quotify.range[0],quotify.range[1]]},/**
   * implements a heading on a selection
   * @requires handlers/blockHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the heading
   */heading:function heading(){var value=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var indices=arguments[1];var editor=arguments.length>2&&arguments[2]!==undefined?arguments[2]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var markArr=[];var mark=void 0;for(var i=1;i<=value;i++){markArr.push('#')}mark=markArr.join('');var space=mark?' ':'';var headingify=(0,_handlers.blockHandler)(editor.value,indices,mark+space);this.updateEditor(headingify.value,headingify.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[headingify.range[0],headingify.range[1]]},/**
   * inserts a link snippet at the end of a selection
   * @requires handlers/insertHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the snippet is inserted
   */link:function link(indices){var url=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'http://url.com';var display=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'http://url.com';var editor=arguments.length>3&&arguments[3]!==undefined?arguments[3]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var mark='['+display+']('+url+')';var linkify=(0,_handlers.insertHandler)(editor.value,indices,mark);this.updateEditor(linkify.value,linkify.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[linkify.range[0],linkify.range[1]]},/**
   * inserts an image snippet at the end of a selection
   * @requires handlers/insertHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the snippet is inserted
   */image:function image(indices){var source=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'http://imagesource.com/image.jpg';var alt=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'http://imagesource.com/image.jpg';var editor=arguments.length>3&&arguments[3]!==undefined?arguments[3]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var mark='!['+alt+']('+source+')';var imageify=(0,_handlers.insertHandler)(editor.value,indices,mark);this.updateEditor(imageify.value,imageify.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[imageify.range[0],imageify.range[1]]},/**
   * implements an unordered list on a selection
   * @requires handlers/listHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the list is implemented
   */unorderedList:function unorderedList(indices){var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var listify=(0,_handlers.listHandler)(editor.value,indices,'ul');this.updateEditor(listify.value,listify.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[listify.range[0],listify.range[1]]},/**
   * implements an ordered list on a selection
   * @requires handlers/listHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the list is implemented
   */orderedList:function orderedList(indices){var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var listify=(0,_handlers.listHandler)(editor.value,indices,'ol');this.updateEditor(listify.value,listify.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[listify.range[0],listify.range[1]]},/**
   * implements an indent on a selection
   * @requires handlers/indentHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the indent is implemented
   */indent:function indent(indices){var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var indentify=(0,_handlers.indentHandler)(editor.value,indices,'in');this.updateEditor(indentify.value,indentify.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[indentify.range[0],indentify.range[1]]},/**
   * implements an outdent on a selection
   * @requires handlers/indentHandler
   * @param   {Array}       indices starting and ending positions for the selection
   * @param   {HTMLElement} editor  the marky marked editor
   * @returns {Array}       the new selection after the outdent is implemented
   */outdent:function outdent(indices){var editor=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.editor;indices=indices||[editor.selectionStart,editor.selectionEnd];var indentify=(0,_handlers.indentHandler)(editor.value,indices,'out');this.updateEditor(indentify.value,indentify.range,editor);editor.dispatchEvent(_customEvents.markyupdate);return[indentify.range[0],indentify.range[1]]}};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* global CustomEvent */Object.defineProperty(exports,'__esModule',{value:true});(function(){function CustomEvent(event,params){params=params||{bubbles:false,cancelable:false,detail:undefined};var evt=document.createEvent('CustomEvent');evt.initCustomEvent(event,params.bubbles,params.cancelable,params.detail);return evt}CustomEvent.prototype=window.Event.prototype;window.CustomEvent=CustomEvent})();var markyblur=exports.markyblur=new CustomEvent('markyblur');var markyfocus=exports.markyfocus=new CustomEvent('markyfocus');var markyselect=exports.markyselect=new CustomEvent('markyselect');var markyupdate=exports.markyupdate=new CustomEvent('markyupdate');var markychange=exports.markychange=new CustomEvent('markychange');

/***/ }),
/* 20 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(47);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(12)
  , document = __webpack_require__(3).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(4)
  , dPs         = __webpack_require__(60)
  , enumBugKeys = __webpack_require__(23)
  , IE_PROTO    = __webpack_require__(15)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(22)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(51).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(9).f
  , has = __webpack_require__(7)
  , TAG = __webpack_require__(1)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(53)
  , defined = __webpack_require__(10);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(16)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(10);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Marky Mark
 * Author: Patrick Fricano
 * https://www.github.com/patrickfatrick/marky-marked
 */var _marky=__webpack_require__(33);var _marky2=_interopRequireDefault(_marky);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}module.exports=_marky2.default;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,'__esModule',{value:true});var _create=__webpack_require__(0);var _create2=_interopRequireDefault(_create);var _Marky=__webpack_require__(18);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}if(true)__webpack_require__(72);var marky=(0,_create2.default)(_Marky.Marky);marky.init();exports.default=marky;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,'__esModule',{value:true});exports.Button=undefined;var _create=__webpack_require__(0);var _create2=_interopRequireDefault(_create);var _Element=__webpack_require__(2);var _Icon=__webpack_require__(17);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * Creates HTML button elements
 * @type {Element}
 * @requires Icon
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 * @param {Array}      iconClasses      classes to use for <i> elements
 */var Button=exports.Button=(0,_create2.default)(_Element.Element);Button.init=function(title,id){_Element.Element.init.call(this,'button',title,id);this.addClass(this.title,this.id);this.assign('value',this.title);this.icon=(0,_create2.default)(_Icon.Icon);for(var _len=arguments.length,iconClasses=Array(_len>2?_len-2:0),_key=2;_key<_len;_key++){iconClasses[_key-2]=arguments[_key]}this.icon.init(iconClasses);this.icon.appendTo(this.element)};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,'__esModule',{value:true});exports.HeadingDialog=exports.ImageDialog=exports.LinkDialog=undefined;var _create=__webpack_require__(0);var _create2=_interopRequireDefault(_create);var _Element=__webpack_require__(2);var _ListItems=__webpack_require__(36);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * Creates dialog (modal) elements
 * @type {Element}
 * @requires  HeadingItem
 * @param {String}      title   title for the element
 * @param {String}      id      editor ID to associate with the element
 */var LinkDialog=exports.LinkDialog=(0,_create2.default)(_Element.Element);LinkDialog.init=function(title,id){_Element.Element.init.call(this,'div',title,id);this.addClass(this.title,id,'dialog');LinkDialog.linkForm=(0,_create2.default)(_Element.Element);this.linkForm.init('form','Link Form');this.linkForm.assign('id',this.id+'-link-form');this.linkUrlInput=(0,_create2.default)(_Element.Element);this.linkUrlInput.init('input','Link Url');this.linkUrlInput.addClass('link-url-input');this.linkUrlInput.assign('type','text');this.linkUrlInput.assign('name',this.id+'-link-url-input');this.linkUrlInput.assign('placeholder','http://url.com');this.linkDisplayInput=(0,_create2.default)(_Element.Element);this.linkDisplayInput.init('input','Link Display');this.linkDisplayInput.addClass('link-display-input');this.linkDisplayInput.assign('type','text');this.linkDisplayInput.assign('name',this.id+'-link-display-input');this.linkDisplayInput.assign('placeholder','Display text');this.insertButton=(0,_create2.default)(_Element.Element);this.insertButton.init('button','Insert Link');this.insertButton.addClass('insert-link');this.insertButton.assign('textContent','Insert');this.linkUrlInput.appendTo(this.linkForm.element);this.linkDisplayInput.appendTo(this.linkForm.element);this.insertButton.appendTo(this.linkForm.element);this.linkForm.appendTo(this.element)};var ImageDialog=exports.ImageDialog=(0,_create2.default)(_Element.Element);ImageDialog.init=function(title,id){_Element.Element.init.call(this,'div',title,id);this.addClass(this.title,id,'dialog');ImageDialog.imageForm=(0,_create2.default)(_Element.Element);this.imageForm.init('form','Image Form');this.imageForm.assign('id',this.id+'-image-form');this.imageSourceInput=(0,_create2.default)(_Element.Element);this.imageSourceInput.init('input','Image Source');this.imageSourceInput.addClass('image-source-input');this.imageSourceInput.assign('type','text');this.imageSourceInput.assign('name',this.id+'-image-source-input');this.imageSourceInput.assign('placeholder','http://url.com/image.jpg');this.imageAltInput=(0,_create2.default)(_Element.Element);this.imageAltInput.init('input','Image Alt');this.imageAltInput.addClass('image-alt-input');this.imageAltInput.assign('type','text');this.imageAltInput.assign('name',this.id+'-image-alt-input');this.imageAltInput.assign('placeholder','Alt text');this.insertButton=(0,_create2.default)(_Element.Element);this.insertButton.init('button','Insert Image');this.insertButton.addClass('insert-image');this.insertButton.assign('textContent','Insert');this.imageSourceInput.appendTo(this.imageForm.element);this.imageAltInput.appendTo(this.imageForm.element);this.insertButton.appendTo(this.imageForm.element);this.imageForm.appendTo(this.element)};var HeadingDialog=exports.HeadingDialog=(0,_create2.default)(_Element.Element);HeadingDialog.init=function(title,id){var _this=this;_Element.Element.init.call(this,'div',title,id);this.addClass(this.title,id,'dialog');this.headingList=(0,_create2.default)(_Element.Element);this.headingList.init('ul','Heading List');this.headingList.assign('id',id+'-heading-list');this.options=[];for(var i=0;i<6;i++){var option=(0,_create2.default)(_ListItems.HeadingItem);option.init('Heading '+(i+1),i+1);this.options.push(option)}var remove=(0,_create2.default)(_ListItems.HeadingItem);remove.init('Remove Heading','0','fa','fa-remove');this.options.push(remove);this.options.forEach(function(option){option.appendTo(_this.headingList.element)});this.headingList.appendTo(this.element)};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,'__esModule',{value:true});exports.HeadingItem=undefined;var _create=__webpack_require__(0);var _create2=_interopRequireDefault(_create);var _Element=__webpack_require__(2);var _Icon=__webpack_require__(17);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * Creates HTML option elements
 * @type {Element}
 * @requires  Icon
 * @param {String}  title   title for the element
 * @param {String}  value   a value to assign the element
 * @param {Array}  iconClasses    classes to use for <i> elements
 */var HeadingItem=exports.HeadingItem=(0,_create2.default)(_Element.Element);HeadingItem.init=function(title,value){_Element.Element.init.call(this,'li',title);this.addClass(this.title.replace(' ','-'));this.assign('value',value);this.button=(0,_create2.default)(_Element.Element);this.button.init('button',title);this.button.assign('value',value);this.button.addClass('heading-button');this.button.appendTo(this.element);for(var _len=arguments.length,iconClasses=Array(_len>2?_len-2:0),_key=2;_key<_len;_key++){iconClasses[_key-2]=arguments[_key]}if(iconClasses.length){this.icon=(0,_create2.default)(_Icon.Icon);this.icon.init(iconClasses);this.icon.appendTo(this.button.element)}else{this.button.assign('textContent',value)}};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,'__esModule',{value:true});exports.Separator=undefined;var _create=__webpack_require__(0);var _create2=_interopRequireDefault(_create);var _Element=__webpack_require__(2);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * Create separator spans for the toolbar
 * @type {Element}
 */var Separator=exports.Separator=(0,_create2.default)(_Element.Element);Separator.init=function(){_Element.Element.init.call(this,'span');this.addClass('separator')};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,'__esModule',{value:true});exports.update=update;exports.undo=undo;exports.redo=redo;var _marked=__webpack_require__(73);var _marked2=_interopRequireDefault(_marked);var _pushState=__webpack_require__(42);var _pushState2=_interopRequireDefault(_pushState);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * updates the state
 * @external marked
 * @requires pushState
 * @param   {String} markdown   markdown blob
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */function update(markdown,selection,state,stateIndex){var markedOptions={sanitize:true};var html=(0,_marked2.default)(markdown,markedOptions).toString()||'';var newState=(0,_pushState2.default)(state,stateIndex,function(){return{markdown:markdown,html:html,selection:selection}});return newState}/**
 * moves backward in state
 * @param   {Number} num        the number of states to move back by
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */function undo(num,state,stateIndex){stateIndex=stateIndex>num-1?stateIndex-num:0;return{state:state[stateIndex],index:stateIndex}}/**
 * moves forwardin state
 * @param   {Number} num        the number of states to move back by
 * @param   {Array}  state      the state timeline
 * @param   {Number} stateIndex the current state index
 * @returns {Object} the newly active state
 */function redo(num,state,stateIndex){stateIndex=stateIndex<state.length-(num+1)?stateIndex+num:state.length-1;return{state:state[stateIndex],index:stateIndex}}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,'__esModule',{value:true});exports.inlineHandler=inlineHandler;exports.blockHandler=blockHandler;exports.listHandler=listHandler;exports.indentHandler=indentHandler;exports.insertHandler=insertHandler;var _parsers=__webpack_require__(41);/**
 * Handles wrapping format strings around a selection
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} mark    the format string to use
 * @returns {Object} the new string, the updated indices
 */function inlineHandler(string,indices,mark){var value=void 0;var useMark=[mark,mark];if(string.indexOf(mark)!==-1){indices.forEach(function(n,i){if(string.lastIndexOf(mark,n)===n-mark.length){string=string.substring(0,n-mark.length)+string.substring(n,string.length);if(i===0){indices[0]=indices[0]-mark.length;indices[1]=indices[1]-mark.length}else{indices[1]=indices[1]-mark.length}if(i===1&&useMark[0])indices[1]=indices[1]+mark.length;useMark[i]=''}if(string.indexOf(mark,n)===n){string=string.substring(0,n)+string.substring(n+mark.length,string.length);if(i===0&&indices[0]!==indices[1]){indices[1]=indices[1]-mark.length}if(i===0&&indices[0]===indices[1]){indices[0]=indices[0]-mark.length}if(i===1&&useMark[0])indices[1]=indices[1]+mark.length;useMark[i]=''}})}value=string.substring(0,indices[0])+useMark[0]+string.substring(indices[0],indices[1])+useMark[1]+string.substring(indices[1],string.length);return{value:value,range:[indices[0]+useMark[0].length,indices[1]+useMark[1].length]}}/**
 * Handles adding/removing a format string to a line
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} mark    the format string to use
 * @returns {Object} the new string, the updated indices
 */function blockHandler(string,indices,mark){var start=indices[0];var end=indices[1];var value=void 0;var lineStart=(0,_parsers.startOfLine)(string,start);var lineEnd=(0,_parsers.endOfLine)(string,end);if((0,_parsers.indexOfMatch)(string,/^[#>]/m,lineStart)===lineStart){var currentFormat=string.substring(lineStart,lineStart+string.substring(lineStart).search(/[0-9~*`_-]|\b|\n|$/gm));value=string.substring(0,lineStart)+string.substring(lineStart+string.substring(lineStart).search(/[0-9~*`_-]|\b|\n|$/gm),string.length);lineEnd=lineEnd-currentFormat.length;if(currentFormat.trim()!==mark.trim()&&mark.trim().length){value=string.substring(0,lineStart)+mark+string.substring(lineStart+string.substring(lineStart).search(/[0-9~*`_-]|\b|\n|$/gm),string.length);lineStart=lineStart+mark.length;lineEnd=lineEnd+mark.length}return{value:value,range:[lineStart,lineEnd]}}value=string.substring(0,lineStart)+mark+string.substring(lineStart,string.length);return{value:value,range:[start+mark.length,end+mark.length]}}/**
 * Handles adding/removing format strings to groups of lines
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} type    ul or ol
 * @returns {Object} the new string, the updated indices
 */function listHandler(string,indices,type){var start=(0,_parsers.startOfLine)(string,indices[0]);var end=(0,_parsers.endOfLine)(string,indices[1]);var lines=(0,_parsers.splitLines)(string.substring(start,end));var newLines=[];var value=void 0;lines.forEach(function(line,i){var mark=type==='ul'?'-'+' ':i+1+'.'+' ';var newLine=void 0;if((0,_parsers.indexOfMatch)(line,/^[0-9#>-]/m,0)===0){var currentFormat=line.substring(0,0+line.substring(0).search(/[~*`_[!]|[a-zA-Z]|\r|\n|$/gm));newLine=line.substring(line.search(/[~*`_[!]|[a-zA-Z]|\r|\n|$/gm),line.length);if(currentFormat.trim()!==mark.trim()){newLine=mark+line.substring(line.search(/[~*`_[!]|[a-zA-Z]|\r|\n|$/gm),line.length)}return newLines.push(newLine)}newLine=mark+line.substring(0,line.length);return newLines.push(newLine)});var joined=newLines.join('\r\n');value=string.substring(0,start)+newLines.join('\r\n')+string.substring(end,string.length);return{value:value,range:[start,start+joined.replace(/\n/gm,'').length]}}/**
 * Handles adding/removing indentation to groups of lines
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} type    in or out
 * @returns {Object} the new string, the updated indices
 */function indentHandler(string,indices,type){var start=(0,_parsers.startOfLine)(string,indices[0]);var end=(0,_parsers.endOfLine)(string,indices[1]);var lines=(0,_parsers.splitLines)(string.substring(start,end));var newLines=[];var value=void 0;lines.forEach(function(line){var mark='    ';var newLine=void 0;if(type==='out'){newLine=line.indexOf(mark,0)===0?line.substring(mark.length,line.length):line.substring(line.search(/[~*`_[!#>-]|[a-zA-Z0-9]|\r|\n|$/gm),line.length);return newLines.push(newLine)}newLine=mark+line.substring(0,line.length);return newLines.push(newLine)});var joined=newLines.join('\r\n');value=string.substring(0,start)+newLines.join('\r\n')+string.substring(end,string.length);return{value:value,range:[start,start+joined.replace(/\n/gm,'').length]}}/**
 * Handles inserting a snippet at the end of a selection
 * @param   {String} string  the entire string to use
 * @param   {Array}  indices the starting and ending positions to wrap
 * @param   {String} mark    the snippet to insert
 * @returns {Object} the new string, the updated indices
 */function insertHandler(string,indices,mark){var start=indices[0];var end=indices[1];var value=void 0;value=string.substring(0,start)+mark+string.substring(end,string.length);return{value:value,range:[start,start+mark.length]}}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* global HTMLCollection HTMLElement NodeList */Object.defineProperty(exports,'__esModule',{value:true});var _create=__webpack_require__(0);var _create2=_interopRequireDefault(_create);exports.default=function(){var containers=arguments.length>0&&arguments[0]!==undefined?arguments[0]:document.getElementsByTagName('marky-mark');if(!(containers instanceof Array)&&!(containers instanceof HTMLCollection)&&!(containers instanceof NodeList)){throw new TypeError('`containers` argument should be an Array or HTMLCollection')}var idArr=[];return Array.prototype.forEach.call(containers,function(container,i){if(!(container instanceof HTMLElement)){throw new TypeError('`containers` argument should only contain HTMLElements')}var idIndex=i;/**
     * Ignore container if it's not empty
     */if(container.children.length){if(container.getAttribute('id'))idArr.push(parseInt(container.getAttribute('id').split('-')[2]));return}/**
     * Create and register main elements:
     * toolbar, editor, dialog container, hidden input
     */var toolbar=(0,_create2.default)(_Element.Element);toolbar.init('div','Toolbar');if(idArr.length){idArr.sort();idIndex=idArr[idArr.length-1]+1}var id='marky-mark-'+idIndex;container.id=id;toolbar.addClass('marky-toolbar',id);var dialogs=(0,_create2.default)(_Element.Element);dialogs.init('div','Dialogs');dialogs.addClass('marky-dialogs',id);var markyEditor=(0,_create2.default)(_Element.Element);markyEditor.init('textarea','Marky Marked Editor');markyEditor.addClass('marky-editor',id);var markyOutput=(0,_create2.default)(_Element.Element);markyOutput.init('input','Marky Marked Output');markyOutput.assign('type','hidden');markyOutput.addClass('marky-output',id);var marky=(0,_create2.default)(_Marky.Marky);marky.init(container,markyEditor.element,markyOutput.element);markyEditor.assign('_marky',marky);/**
     * Create and register dialogs and set listeners
     */function formSubmit(e){e.preventDefault();markyEditor.element.focus()}var headingDialog=(0,_create2.default)(_Dialogs.HeadingDialog);headingDialog.init('Heading Dialog',id);headingDialog.element.style.visibility='hidden';headingDialog.options.forEach(function(option){option.listen('click',function(e){e.preventDefault();var value=parseInt(e.target.value);markyEditor.element.focus();headingDialog.removeClass('toggled');headingDialog.element.style.visibility='hidden';markyEditor.element._marky.heading(value,[markyEditor.element.selectionStart,markyEditor.element.selectionEnd])})});var linkDialog=(0,_create2.default)(_Dialogs.LinkDialog);linkDialog.init('Link Dialog',id);linkDialog.element.style.visibility='hidden';linkDialog.linkForm.listen('submit',formSubmit);linkDialog.insertButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();var url=linkDialog.linkUrlInput.element.value?linkDialog.linkUrlInput.element.value:'http://url.com';var display=linkDialog.linkDisplayInput.element.value?linkDialog.linkDisplayInput.element.value:url;linkDialog.linkUrlInput.element.value='';linkDialog.linkDisplayInput.element.value='';linkDialog.element.style.visibility='hidden';linkDialog.removeClass('toggled');markyEditor.element._marky.link([markyEditor.element.selectionStart,markyEditor.element.selectionEnd],url,display)});var imageDialog=(0,_create2.default)(_Dialogs.ImageDialog);imageDialog.init('Image Dialog',id);imageDialog.element.style.visibility='hidden';imageDialog.imageForm.listen('submit',formSubmit);imageDialog.insertButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();var source=imageDialog.imageSourceInput.element.value?imageDialog.imageSourceInput.element.value:'http://imagesource.com/image.jpg';var alt=imageDialog.imageAltInput.element.value?imageDialog.imageAltInput.element.value:source;imageDialog.imageSourceInput.element.value='';imageDialog.imageAltInput.element.value='';imageDialog.element.style.visibility='hidden';imageDialog.removeClass('toggled');markyEditor.element._marky.image([markyEditor.element.selectionStart,markyEditor.element.selectionEnd],source,alt)});/**
     * Create and register toolbar buttons and set listeners
     */function buttonMousedown(e){e.preventDefault();e.currentTarget.classList.add('active');markyEditor.element.focus()}function buttonMouseup(e){e.currentTarget.classList.remove('active')}var headingButton=(0,_create2.default)(_Button.Button);headingButton.init('Heading',id,'fa','fa-header');headingButton.dialog=headingDialog.element;headingButton.listen('click',function(e){e.preventDefault();e.currentTarget.blur();headingButton.dialog.classList.toggle('toggled');imageDialog.element.style.visibility='hidden';imageDialog.removeClass('toggled');linkDialog.element.style.visibility='hidden';linkDialog.removeClass('toggled');if(headingButton.dialog.style.visibility==='hidden'){headingButton.dialog.style.visibility='visible';return}headingButton.dialog.style.visibility='hidden'});var boldButton=(0,_create2.default)(_Button.Button);boldButton.init('Bold',id,'fa','fa-bold');boldButton.listen('mousedown',buttonMousedown);boldButton.listen('mouseup',buttonMouseup);boldButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();markyEditor.element._marky.bold([markyEditor.element.selectionStart,markyEditor.element.selectionEnd])});var italicButton=(0,_create2.default)(_Button.Button);italicButton.init('Italic',id,'fa','fa-italic');italicButton.listen('mousedown',buttonMousedown);italicButton.listen('mouseup',buttonMouseup);italicButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();markyEditor.element._marky.italic([markyEditor.element.selectionStart,markyEditor.element.selectionEnd])});var strikethroughButton=(0,_create2.default)(_Button.Button);strikethroughButton.init('Strikethrough',id,'fa','fa-strikethrough');strikethroughButton.listen('mousedown',buttonMousedown);strikethroughButton.listen('mouseup',buttonMouseup);strikethroughButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();markyEditor.element._marky.strikethrough([markyEditor.element.selectionStart,markyEditor.element.selectionEnd])});var codeButton=(0,_create2.default)(_Button.Button);codeButton.init('Code',id,'fa','fa-code');codeButton.listen('mousedown',buttonMousedown);codeButton.listen('mouseup',buttonMouseup);codeButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();markyEditor.element._marky.code([markyEditor.element.selectionStart,markyEditor.element.selectionEnd])});var blockquoteButton=(0,_create2.default)(_Button.Button);blockquoteButton.init('Blockquote',id,'fa','fa-quote-right');blockquoteButton.listen('mousedown',buttonMousedown);blockquoteButton.listen('mouseup',buttonMouseup);blockquoteButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();markyEditor.element._marky.blockquote([markyEditor.element.selectionStart,markyEditor.element.selectionEnd])});var linkButton=(0,_create2.default)(_Button.Button);linkButton.init('Link',id,'fa','fa-link');linkButton.dialog=linkDialog.element;linkButton.listen('mousedown',buttonMousedown);linkButton.listen('mouseup',buttonMouseup);linkButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();linkButton.dialog.classList.toggle('toggled');imageDialog.element.style.visibility='hidden';imageDialog.removeClass('toggled');headingDialog.element.style.visibility='hidden';headingDialog.removeClass('toggled');if(linkButton.dialog.style.visibility==='hidden'){linkButton.dialog.children[0].children[1].value=markyEditor.element.value.substring(markyEditor.element.selectionStart,markyEditor.element.selectionEnd);linkButton.dialog.style.visibility='visible';return}linkButton.dialog.style.visibility='hidden'});var imageButton=(0,_create2.default)(_Button.Button);imageButton.init('Image',id,'fa','fa-file-image-o');imageButton.dialog=imageDialog.element;imageButton.listen('mousedown',buttonMousedown);imageButton.listen('mouseup',buttonMouseup);imageButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();imageButton.dialog.classList.toggle('toggled');linkDialog.element.style.visibility='hidden';linkDialog.removeClass('toggled');headingDialog.element.style.visibility='hidden';headingDialog.removeClass('toggled');if(imageButton.dialog.style.visibility==='hidden'){imageButton.dialog.children[0].children[1].value=markyEditor.element.value.substring(markyEditor.element.selectionStart,markyEditor.element.selectionEnd);imageButton.dialog.style.visibility='visible';return}imageButton.dialog.style.visibility='hidden'});var unorderedListButton=(0,_create2.default)(_Button.Button);unorderedListButton.init('Unordered List',id,'fa','fa-list-ul');unorderedListButton.listen('mousedown',buttonMousedown);unorderedListButton.listen('mouseup',buttonMouseup);unorderedListButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();markyEditor.element._marky.unorderedList([markyEditor.element.selectionStart,markyEditor.element.selectionEnd])});var orderedListButton=(0,_create2.default)(_Button.Button);orderedListButton.init('Ordered List',id,'fa','fa-list-ol');orderedListButton.listen('mousedown',buttonMousedown);orderedListButton.listen('mouseup',buttonMouseup);orderedListButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();markyEditor.element._marky.orderedList([markyEditor.element.selectionStart,markyEditor.element.selectionEnd])});var outdentButton=(0,_create2.default)(_Button.Button);outdentButton.init('Outdent',id,'fa','fa-outdent');outdentButton.listen('mousedown',buttonMousedown);outdentButton.listen('mouseup',buttonMouseup);outdentButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();markyEditor.element._marky.outdent([markyEditor.element.selectionStart,markyEditor.element.selectionEnd])});var indentButton=(0,_create2.default)(_Button.Button);indentButton.init('Indent',id,'fa','fa-indent');indentButton.listen('mousedown',buttonMousedown);indentButton.listen('mouseup',buttonMouseup);indentButton.listen('click',function(e){e.preventDefault();markyEditor.element.focus();markyEditor.element._marky.indent([markyEditor.element.selectionStart,markyEditor.element.selectionEnd])});var undoButton=(0,_create2.default)(_Button.Button);undoButton.init('Undo',id,'fa','fa-backward');undoButton.listen('mousedown',buttonMousedown);undoButton.listen('mouseup',buttonMouseup);undoButton.listen('click',function(e){e.preventDefault();if(undoButton.element.classList.contains('disabled'))return;markyEditor.element.focus();markyEditor.element._marky.undo(1,markyEditor.element._marky.state,markyEditor.element._marky.index)});var redoButton=(0,_create2.default)(_Button.Button);redoButton.init('Redo',id,'fa','fa-forward');redoButton.listen('mousedown',buttonMousedown);redoButton.listen('mouseup',buttonMouseup);redoButton.listen('click',function(e){e.preventDefault();if(redoButton.element.classList.contains('disabled'))return;markyEditor.element.focus();markyEditor.element._marky.redo(1,markyEditor.element._marky.state,markyEditor.element._marky.index)});var fullscreenButton=(0,_create2.default)(_Button.Button);fullscreenButton.init('Fullscreen',id,'fa','fa-expand');fullscreenButton.listen('click',function(e){e.preventDefault();e.currentTarget.blur();e.currentTarget.classList.toggle('fullscreen-toggled');container.classList.toggle('fullscreen-toggled');markyEditor.element.classList.toggle('fullscreen-toggled');fullscreenButton.icon.element.classList.toggle('fa-expand');fullscreenButton.icon.element.classList.toggle('fa-compress')});/**
     * Create and register separators
     */var separatorA=(0,_create2.default)(_Separator.Separator);separatorA.init();var separatorB=(0,_create2.default)(_Separator.Separator);separatorB.init();var separatorC=(0,_create2.default)(_Separator.Separator);separatorC.init();var separatorD=(0,_create2.default)(_Separator.Separator);separatorD.init();var separatorE=(0,_create2.default)(_Separator.Separator);separatorE.init();/**
     * Insert elements into the DOM
     */toolbar.appendTo(container);markyEditor.appendTo(container);markyOutput.appendTo(container);headingButton.appendTo(toolbar.element);separatorA.appendTo(toolbar.element);boldButton.appendTo(toolbar.element);italicButton.appendTo(toolbar.element);strikethroughButton.appendTo(toolbar.element);codeButton.appendTo(toolbar.element);blockquoteButton.appendTo(toolbar.element);separatorB.appendTo(toolbar.element);linkButton.appendTo(toolbar.element);imageButton.appendTo(toolbar.element);separatorC.appendTo(toolbar.element);unorderedListButton.appendTo(toolbar.element);orderedListButton.appendTo(toolbar.element);outdentButton.appendTo(toolbar.element);indentButton.appendTo(toolbar.element);separatorD.appendTo(toolbar.element);undoButton.appendTo(toolbar.element);redoButton.appendTo(toolbar.element);separatorE.appendTo(toolbar.element);fullscreenButton.appendTo(toolbar.element);dialogs.appendTo(toolbar.element);linkDialog.appendTo(dialogs.element);imageDialog.appendTo(dialogs.element);headingDialog.appendTo(dialogs.element);/**
     * Listeners for the editor
     */markyEditor.listen('markyupdate',function(e){e.currentTarget._marky.update(e.currentTarget.value,[e.currentTarget.selectionStart,e.currentTarget.selectionEnd],e.currentTarget._marky.state,e.currentTarget._marky.index)},false);markyEditor.listen('markychange',function(e){var html=e.currentTarget._marky.state[e.currentTarget._marky.index].html;if(e.currentTarget._marky.index===0){undoButton.addClass('disabled')}else{undoButton.removeClass('disabled')}if(e.currentTarget._marky.index===e.currentTarget._marky.state.length-1){redoButton.addClass('disabled')}else{redoButton.removeClass('disabled')}e.currentTarget._marky.updateOutput(html)},false);/**
     * Listen for input events, set timeout to update state, clear timeout from previous input
     */markyEditor.listen('input',function(e){window.clearTimeout(timeoutID);timeoutID=window.setTimeout(function(){e.target.dispatchEvent(_customEvents.markyupdate)},1000)},false);/**
     * Listen for change events (requires loss of focus) and update state
     */markyEditor.listen('change',function(e){e.currentTarget.dispatchEvent(_customEvents.markyupdate)},false);/**
     * Listen for pasting into the editor and update state
     */markyEditor.listen('paste',function(e){setTimeout(function(){e.currentTarget.dispatchEvent(_customEvents.markyupdate)},0)},false);/**
     * Listen for cutting from the editor and update state
     */markyEditor.listen('cut',function(e){setTimeout(function(){e.currentTarget.dispatchEvent(_customEvents.markyupdate)},0)},false);var deleteSelection=0;/**
     * Listen for keydown events,
     * if key is delete key,
     * set deleteSelection to length of selection
     */markyEditor.listen('keydown',function(e){if(e.which===8)deleteSelection=e.currentTarget.selectionEnd-e.currentTarget.selectionStart});var keyMap=[];// Used for determining whether or not to update state on space keyup
var punctuations=[46,// period
44,// comma
63,// question mark
33,// exclamation point
58,// colon
59,// semi-colon
47,// back slash
92,// forward slash
38,// ampersand
124,// vertical pipe
32// space
];/**
     * Listen for keyup events,
     * if key is space or punctuation (but not a space following punctuation or another space),
     * update state and clear input timeout.
     */markyEditor.listen('keypress',function(e){keyMap.push(e.which);if(keyMap.length>2)keyMap.shift();punctuations.forEach(function(punctuation){if(e.which===32&&keyMap[0]===punctuation){return window.clearTimeout(timeoutID)}if(e.which===punctuation){window.clearTimeout(timeoutID);return e.currentTarget.dispatchEvent(_customEvents.markyupdate)}})});/**
     * Listen for keyup events,
     * if key is delete and it's a bulk selection,
     * update state and clear input timeout.
     */markyEditor.listen('keyup',function(e){if(e.which===8&&deleteSelection>0){window.clearTimeout(timeoutID);deleteSelection=0;e.currentTarget.dispatchEvent(_customEvents.markyupdate)}});markyEditor.listen('select',function(e){e.currentTarget.dispatchEvent(_customEvents.markyselect)});markyEditor.listen('blur',function(e){e.currentTarget.dispatchEvent(_customEvents.markyblur)});markyEditor.listen('focus',function(e){e.currentTarget.dispatchEvent(_customEvents.markyfocus)});markyEditor.listen('click',function(){imageDialog.element.style.visibility='hidden';imageDialog.removeClass('toggled');linkDialog.element.style.visibility='hidden';linkDialog.removeClass('toggled');headingDialog.element.style.visibility='hidden';headingDialog.removeClass('toggled')})})};var _Marky=__webpack_require__(18);var _Element=__webpack_require__(2);var _Button=__webpack_require__(34);var _Dialogs=__webpack_require__(35);var _Separator=__webpack_require__(37);var _customEvents=__webpack_require__(19);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var timeoutID=void 0;// Used later for input events
/**
 * Register and append the DOM elements needed and set the event listeners
 * @param   {String}  tag name to be used for initialization
 */

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Finds the first index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional starting index
 * @returns {Number} the index of the match
 */Object.defineProperty(exports,'__esModule',{value:true});exports.indexOfMatch=indexOfMatch;exports.indicesOfMatches=indicesOfMatches;exports.lastIndexOfMatch=lastIndexOfMatch;exports.splitLinesBackward=splitLinesBackward;exports.splitLines=splitLines;exports.startOfLine=startOfLine;exports.endOfLine=endOfLine;function indexOfMatch(string,regex,index){var str=index!==null?string.substring(index):string;var matches=str.match(regex);return matches?str.indexOf(matches[0])+index:-1}/**
 * Finds the first index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional starting index
 * @returns {Number} the index of the match
 */function indicesOfMatches(string,regex,index){var str=index!==null?string.substring(index):string;var matches=str.match(regex);var indices=[];matches.forEach(function(match,i){var prevIndex=indices?indices[i-1]:null;indices.push(str.indexOf(match,prevIndex+1)+index)});return indices||-1}/**
 * Finds the last index based on a regex match
 * @param   {RegExp} regex a regex object
 * @param   {Number} index optional ending index
 * @returns {Number} the index of the match
 */function lastIndexOfMatch(string,regex,index){var str=index!==null?string.substring(0,index):string;var matches=str.match(regex);return matches?str.lastIndexOf(matches[matches.length-1]):-1}/**
 * Creates an array of lines separated by line breaks
 * @param   {Number} index optional ending index
 * @returns {Array}  an array of strings
 */function splitLinesBackward(string,index){var str=index?string.substring(0,index):string;return str.split(/\r\n|\r|\n/)}/**
 * Creates an array of lines split by line breaks
 * @param   {Number} index optional starting index
 * @returns {Array}  an array of strings
 */function splitLines(string,index){var str=index?string.substring(index):string;return str.split(/\r\n|\r|\n/)}/**
 * Finds the start of a line
 * @param   {Number} index  optional position
 * @returns {Number} the index of the line start
 */function startOfLine(string){var index=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;return lastIndexOfMatch(string,/^.*/gm,index)}/**
 * Finds the end of a line
 * @param   {Number} index  optional position
 * @returns {Number} the index of the line end
 */function endOfLine(string){var index=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;return indexOfMatch(string,/(\r|\n|$)/gm,index)}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Handles adding and removing state
 * @param   {Array}    state      the state timeline
 * @param   {Number}   stateIndex the current state index
 * @param   {Function} fn         a function to call
 * @returns {Object}   the new timeline
 */Object.defineProperty(exports,'__esModule',{value:true});exports.default=function(state,stateIndex,fn){state=state.slice(0,stateIndex+1);var newVersion=fn();state.push(newVersion);stateIndex++;if(stateIndex>999){state.shift();stateIndex--}return{state:state,index:stateIndex}};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(45), __esModule: true };

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(43);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(71);
__webpack_require__(69);
module.exports = __webpack_require__(5).Array.from;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(70);
var $Object = __webpack_require__(5).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(28)
  , toLength  = __webpack_require__(29)
  , toIndex   = __webpack_require__(66);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(20)
  , TAG = __webpack_require__(1)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(9)
  , createDesc      = __webpack_require__(14);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3).document && document.documentElement;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(6) && !__webpack_require__(24)(function(){
  return Object.defineProperty(__webpack_require__(22)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(20);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(13)
  , ITERATOR   = __webpack_require__(1)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(4);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(25)
  , descriptor     = __webpack_require__(14)
  , setToStringTag = __webpack_require__(26)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(8)(IteratorPrototype, __webpack_require__(1)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(59)
  , $export        = __webpack_require__(11)
  , redefine       = __webpack_require__(64)
  , hide           = __webpack_require__(8)
  , has            = __webpack_require__(7)
  , Iterators      = __webpack_require__(13)
  , $iterCreate    = __webpack_require__(56)
  , setToStringTag = __webpack_require__(26)
  , getPrototypeOf = __webpack_require__(61)
  , ITERATOR       = __webpack_require__(1)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(1)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(9)
  , anObject = __webpack_require__(4)
  , getKeys  = __webpack_require__(63);

module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(7)
  , toObject    = __webpack_require__(30)
  , IE_PROTO    = __webpack_require__(15)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(7)
  , toIObject    = __webpack_require__(28)
  , arrayIndexOf = __webpack_require__(48)(false)
  , IE_PROTO     = __webpack_require__(15)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(62)
  , enumBugKeys = __webpack_require__(23);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(16)
  , defined   = __webpack_require__(10);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(16)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(12);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(49)
  , ITERATOR  = __webpack_require__(1)('iterator')
  , Iterators = __webpack_require__(13);
module.exports = __webpack_require__(5).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(21)
  , $export        = __webpack_require__(11)
  , toObject       = __webpack_require__(30)
  , call           = __webpack_require__(55)
  , isArrayIter    = __webpack_require__(54)
  , toLength       = __webpack_require__(29)
  , createProperty = __webpack_require__(50)
  , getIterFn      = __webpack_require__(68);

$export($export.S + $export.F * !__webpack_require__(58)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(11)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(25)});

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(65)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(57)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 72 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities 
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (true) {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(74)))

/***/ }),
/* 74 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(32);


/***/ })
/******/ ]);
});