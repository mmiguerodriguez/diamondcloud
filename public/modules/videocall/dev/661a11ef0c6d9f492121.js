/******/ (function(modules) { // webpackBootstrap
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

	__webpack_require__(1);
	module.exports = __webpack_require__(9);


/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _reactDom = __webpack_require__(10);

	var _reactRouter = __webpack_require__(11);

	var _routes = __webpack_require__(12);

	var _routes2 = _interopRequireDefault(_routes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _reactDom.render)((0, _routes2.default)(), document.querySelector('#render-target'));

	_reactRouter.browserHistory.push('/');
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }
	}();

	;

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = ReactRouter;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _reactRouter = __webpack_require__(11);

	var _VideoChatPage = __webpack_require__(13);

	var _VideoChatPage2 = _interopRequireDefault(_VideoChatPage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var renderRoutes = function renderRoutes() {
	  return React.createElement(
	    _reactRouter.Router,
	    { history: _reactRouter.browserHistory },
	    React.createElement(
	      _reactRouter.Route,
	      { path: '/', component: _VideoChatPage2.default },
	      React.createElement(_reactRouter.IndexRoute, { component: _VideoChatPage2.default })
	    )
	  );
	};

	var _default = renderRoutes;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(renderRoutes, 'renderRoutes', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/routes.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/routes.jsx');
	}();

	;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends2 = __webpack_require__(14);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(52);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(57);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(58);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(62);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(97);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(105);

	var _react2 = _interopRequireDefault(_react);

	var _VideoChatLayout = __webpack_require__(106);

	var _VideoChatLayout2 = _interopRequireDefault(_VideoChatLayout);

	var _ErrorMessage = __webpack_require__(111);

	var _ErrorMessage2 = _interopRequireDefault(_ErrorMessage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ERROR_DELAY = 5000;

	/**
	 * Grabs all the data for the component to work.
	 * User profile data and board id.
	 */

	var VideoChatPage = function (_React$Component) {
	  (0, _inherits3.default)(VideoChatPage, _React$Component);

	  function VideoChatPage() {
	    (0, _classCallCheck3.default)(this, VideoChatPage);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (VideoChatPage.__proto__ || (0, _getPrototypeOf2.default)(VideoChatPage)).call(this));

	    _this.state = {
	      localVideoId: 'user-video',
	      readyToCall: false,
	      videos: [],
	      peers: [],
	      webrtc: {},
	      error: {
	        body: '',
	        delay: ERROR_DELAY,
	        showing: false
	      }
	    };

	    _this.error = _this.error.bind(_this);
	    return _this;
	  }

	  (0, _createClass3.default)(VideoChatPage, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var self = this;

	      var webrtc = new SimpleWebRTC({
	        localVideoEl: self.state.localVideoId,
	        remoteVideosEl: '',
	        autoRequestMedia: true,
	        detectSpeakingEvents: true,
	        nick: DiamondAPI.getCurrentUser().profile.name,
	        url: 'https://diamondcloud.tk:8888',
	        secure: true
	      });

	      self.setState({
	        webrtc: webrtc
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var self = this;

	      var webrtc = self.state.webrtc;
	      var VIDEO_START = 'playing';
	      var AUDIO_START = 'unmuted';

	      // RTC ready event
	      webrtc.on('readyToCall', function () {
	        self.setState({
	          readyToCall: true
	        });
	      });

	      // Remote peer created event
	      webrtc.on('createdPeer', function (peer) {
	        // Created peer on room
	      });

	      // New/Removed videos events
	      webrtc.on('videoAdded', function (video, peer) {
	        var _self$state = self.state,
	            videos = _self$state.videos,
	            peers = _self$state.peers;


	        videos.push({
	          id: peer.id,
	          domId: webrtc.getDomId(peer),
	          video: VIDEO_START,
	          audio: AUDIO_START,
	          peer: peer
	        });

	        peers.push(peer);

	        self.setState({
	          videos: videos,
	          peers: peers
	        });
	      });
	      webrtc.on('videoRemoved', function (video, peer) {
	        var _self$state2 = self.state,
	            videos = _self$state2.videos,
	            peers = _self$state2.peers;

	        var videoDomId = webrtc.getDomId(peer);

	        videos.forEach(function (video, index) {
	          if (video.domId === videoDomId) {
	            videos.splice(index, 1);
	          }
	        });

	        peers.forEach(function (_peer, index) {
	          if (_peer.id === peer.id) {
	            peers.splice(index, 1);
	          }
	        });

	        self.setState({
	          videos: videos,
	          peers: peers
	        });
	      });

	      // Access to media stream events
	      webrtc.on('localStream', function (stream) {});
	      webrtc.on('localMediaError', function (error) {
	        self.error({
	          type: 'show',
	          body: 'Error en la cámara/micrófono'
	        });
	      });

	      // Local video/audio events
	      webrtc.on('videoOn', function () {
	        // Local video just turned on
	      });
	      webrtc.on('videoOff', function () {
	        // Local video just turned off
	      });
	      webrtc.on('audioOn', function () {
	        // Local audio just turned on
	      });
	      webrtc.on('audioOff', function () {
	        // Local audio just turned off
	      });

	      // Failure events
	      webrtc.on('iceFailed', function (peer) {
	        // Local p2p/ice failure
	        var pc = peer.pc;
	        self.error({
	          type: 'show',
	          body: 'Hubo un error con la conexión local'
	        });
	      });
	      webrtc.on('connectivityError', function (peer) {
	        // Remote p2p/ice failure
	        var pc = peer.pc;
	        self.error({
	          type: 'show',
	          body: 'Hubo un error con la conexión remota'
	        });
	      });
	    }
	  }, {
	    key: 'error',
	    value: function error(_ref) {
	      var _ref$type = _ref.type,
	          type = _ref$type === undefined ? 'show' : _ref$type,
	          _ref$body = _ref.body,
	          body = _ref$body === undefined ? 'Ha ocurrido un error' : _ref$body,
	          _ref$delay = _ref.delay,
	          delay = _ref$delay === undefined ? ERROR_DELAY : _ref$delay;

	      if (type === 'hide') {
	        this.setState({
	          error: {
	            body: '',
	            delay: ERROR_DELAY,
	            showing: false
	          }
	        });
	      } else if (type === 'show') {
	        this.setState({
	          error: {
	            body: body,
	            delay: delay || ERROR_DELAY,
	            showing: true
	          }
	        });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_VideoChatLayout2.default, (0, _extends3.default)({
	          error: this.error
	        }, this.state)),
	        this.state.error.showing ? _react2.default.createElement(_ErrorMessage2.default, (0, _extends3.default)({
	          error: this.error
	        }, this.state.error)) : null
	      );
	    }
	  }]);
	  return VideoChatPage;
	}(_react2.default.Component);

	var _default = VideoChatPage;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(ERROR_DELAY, 'ERROR_DELAY', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/videochat/VideoChatPage.jsx');

	  __REACT_HOT_LOADER__.register(VideoChatPage, 'VideoChatPage', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/videochat/VideoChatPage.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/videochat/VideoChatPage.jsx');
	}();

	;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(15);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(16), __esModule: true };

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(17);
	module.exports = __webpack_require__(20).Object.assign;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(18);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(33)});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(19)
	  , core      = __webpack_require__(20)
	  , ctx       = __webpack_require__(21)
	  , hide      = __webpack_require__(23)
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

/***/ },
/* 19 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 20 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(22);
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

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(24)
	  , createDesc = __webpack_require__(32);
	module.exports = __webpack_require__(28) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(25)
	  , IE8_DOM_DEFINE = __webpack_require__(27)
	  , toPrimitive    = __webpack_require__(31)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(28) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(28) && !__webpack_require__(29)(function(){
	  return Object.defineProperty(__webpack_require__(30)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(29)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26)
	  , document = __webpack_require__(19).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(26);
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

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(34)
	  , gOPS     = __webpack_require__(49)
	  , pIE      = __webpack_require__(50)
	  , toObject = __webpack_require__(51)
	  , IObject  = __webpack_require__(38)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(29)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(35)
	  , enumBugKeys = __webpack_require__(48);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(36)
	  , toIObject    = __webpack_require__(37)
	  , arrayIndexOf = __webpack_require__(41)(false)
	  , IE_PROTO     = __webpack_require__(45)('IE_PROTO');

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

/***/ },
/* 36 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(38)
	  , defined = __webpack_require__(40);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(39);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(37)
	  , toLength  = __webpack_require__(42)
	  , toIndex   = __webpack_require__(44);
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

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(43)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(43)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(46)('keys')
	  , uid    = __webpack_require__(47);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(19)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 49 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 50 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(40);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(53), __esModule: true };

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(54);
	module.exports = __webpack_require__(20).Object.getPrototypeOf;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(51)
	  , $getPrototypeOf = __webpack_require__(55);

	__webpack_require__(56)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(36)
	  , toObject    = __webpack_require__(51)
	  , IE_PROTO    = __webpack_require__(45)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(18)
	  , core    = __webpack_require__(20)
	  , fails   = __webpack_require__(29);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(59);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(60), __esModule: true };

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(61);
	var $Object = __webpack_require__(20).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(18);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(28), 'Object', {defineProperty: __webpack_require__(24).f});

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(63);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(64);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(83);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(65), __esModule: true };

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(66);
	__webpack_require__(78);
	module.exports = __webpack_require__(82).f('iterator');

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(67)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(68)(String, 'String', function(iterated){
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

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(43)
	  , defined   = __webpack_require__(40);
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

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(69)
	  , $export        = __webpack_require__(18)
	  , redefine       = __webpack_require__(70)
	  , hide           = __webpack_require__(23)
	  , has            = __webpack_require__(36)
	  , Iterators      = __webpack_require__(71)
	  , $iterCreate    = __webpack_require__(72)
	  , setToStringTag = __webpack_require__(76)
	  , getPrototypeOf = __webpack_require__(55)
	  , ITERATOR       = __webpack_require__(77)('iterator')
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

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(23);

/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(73)
	  , descriptor     = __webpack_require__(32)
	  , setToStringTag = __webpack_require__(76)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(23)(IteratorPrototype, __webpack_require__(77)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(25)
	  , dPs         = __webpack_require__(74)
	  , enumBugKeys = __webpack_require__(48)
	  , IE_PROTO    = __webpack_require__(45)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(30)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(75).appendChild(iframe);
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


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(24)
	  , anObject = __webpack_require__(25)
	  , getKeys  = __webpack_require__(34);

	module.exports = __webpack_require__(28) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(19).document && document.documentElement;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(24).f
	  , has = __webpack_require__(36)
	  , TAG = __webpack_require__(77)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(46)('wks')
	  , uid        = __webpack_require__(47)
	  , Symbol     = __webpack_require__(19).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(79);
	var global        = __webpack_require__(19)
	  , hide          = __webpack_require__(23)
	  , Iterators     = __webpack_require__(71)
	  , TO_STRING_TAG = __webpack_require__(77)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(80)
	  , step             = __webpack_require__(81)
	  , Iterators        = __webpack_require__(71)
	  , toIObject        = __webpack_require__(37);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(68)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(77);

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(84), __esModule: true };

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(85);
	__webpack_require__(94);
	__webpack_require__(95);
	__webpack_require__(96);
	module.exports = __webpack_require__(20).Symbol;

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(19)
	  , has            = __webpack_require__(36)
	  , DESCRIPTORS    = __webpack_require__(28)
	  , $export        = __webpack_require__(18)
	  , redefine       = __webpack_require__(70)
	  , META           = __webpack_require__(86).KEY
	  , $fails         = __webpack_require__(29)
	  , shared         = __webpack_require__(46)
	  , setToStringTag = __webpack_require__(76)
	  , uid            = __webpack_require__(47)
	  , wks            = __webpack_require__(77)
	  , wksExt         = __webpack_require__(82)
	  , wksDefine      = __webpack_require__(87)
	  , keyOf          = __webpack_require__(88)
	  , enumKeys       = __webpack_require__(89)
	  , isArray        = __webpack_require__(90)
	  , anObject       = __webpack_require__(25)
	  , toIObject      = __webpack_require__(37)
	  , toPrimitive    = __webpack_require__(31)
	  , createDesc     = __webpack_require__(32)
	  , _create        = __webpack_require__(73)
	  , gOPNExt        = __webpack_require__(91)
	  , $GOPD          = __webpack_require__(93)
	  , $DP            = __webpack_require__(24)
	  , $keys          = __webpack_require__(34)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(92).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(50).f  = $propertyIsEnumerable;
	  __webpack_require__(49).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(69)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(23)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(47)('meta')
	  , isObject = __webpack_require__(26)
	  , has      = __webpack_require__(36)
	  , setDesc  = __webpack_require__(24).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(29)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(19)
	  , core           = __webpack_require__(20)
	  , LIBRARY        = __webpack_require__(69)
	  , wksExt         = __webpack_require__(82)
	  , defineProperty = __webpack_require__(24).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(34)
	  , toIObject = __webpack_require__(37);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(34)
	  , gOPS    = __webpack_require__(49)
	  , pIE     = __webpack_require__(50);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(39);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(37)
	  , gOPN      = __webpack_require__(92).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(35)
	  , hiddenKeys = __webpack_require__(48).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(50)
	  , createDesc     = __webpack_require__(32)
	  , toIObject      = __webpack_require__(37)
	  , toPrimitive    = __webpack_require__(31)
	  , has            = __webpack_require__(36)
	  , IE8_DOM_DEFINE = __webpack_require__(27)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(28) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 94 */
/***/ function(module, exports) {

	

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(87)('asyncIterator');

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(87)('observable');

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(98);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(102);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(63);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(99), __esModule: true };

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(100);
	module.exports = __webpack_require__(20).Object.setPrototypeOf;

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(18);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(101).set});

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(26)
	  , anObject = __webpack_require__(25);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(21)(Function.call, __webpack_require__(93).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(103), __esModule: true };

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(104);
	var $Object = __webpack_require__(20).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(18)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(73)});

/***/ },
/* 105 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends2 = __webpack_require__(14);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(52);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(57);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(58);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(62);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(97);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(105);

	var _react2 = _interopRequireDefault(_react);

	var _UserVideo = __webpack_require__(107);

	var _UserVideo2 = _interopRequireDefault(_UserVideo);

	var _Video = __webpack_require__(108);

	var _Video2 = _interopRequireDefault(_Video);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Layout for the VideoChat
	 * @renders UserVideo
	 *          RemoteVideos
	 */
	var VideoChatLayout = function (_React$Component) {
	  (0, _inherits3.default)(VideoChatLayout, _React$Component);

	  function VideoChatLayout(props) {
	    (0, _classCallCheck3.default)(this, VideoChatLayout);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (VideoChatLayout.__proto__ || (0, _getPrototypeOf2.default)(VideoChatLayout)).call(this, props));

	    _this.state = {
	      connected: false,
	      maximizedVideo: _this.props.localVideoId
	    };

	    _this.connect = _this.connect.bind(_this);

	    _this.changeMaximizedVideo = _this.changeMaximizedVideo.bind(_this);
	    return _this;
	  }

	  (0, _createClass3.default)(VideoChatLayout, [{
	    key: 'connect',
	    value: function connect() {
	      if (this.props.readyToCall) {
	        var board = DiamondAPI.getCurrentBoard();

	        this.props.webrtc.joinRoom(board._id);

	        this.setState({
	          connected: true
	        });
	      }
	    }
	  }, {
	    key: 'changeMaximizedVideo',
	    value: function changeMaximizedVideo(id) {
	      this.setState({
	        maximizedVideo: id
	      });
	    }
	  }, {
	    key: 'renderVideos',
	    value: function renderVideos() {
	      var _this2 = this;

	      return this.props.videos.map(function (video) {
	        return _react2.default.createElement(_Video2.default, (0, _extends3.default)({
	          key: video.id,
	          position: _this2.state.maximizedVideo === video.id ? 'maximized-video' : 'minimized-video',
	          onClick: _this2.changeMaximizedVideo,
	          webrtc: _this2.props.webrtc
	        }, video));
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var remoteVideos = this.renderVideos();
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_UserVideo2.default, {
	          id: this.props.localVideoId,
	          position: this.state.maximizedVideo === this.props.localVideoId || remoteVideos.length === 0 ? 'maximized-video' : 'minimized-video',
	          onClick: this.changeMaximizedVideo,
	          webrtc: this.props.webrtc,
	          connected: this.state.connected
	        }),
	        this.state.connected ? _react2.default.createElement(
	          'div',
	          null,
	          remoteVideos
	        ) : _react2.default.createElement(
	          'div',
	          { className: 'join-background' },
	          _react2.default.createElement('button', {
	            className: 'btn btn-primary join',
	            onClick: this.connect
	          })
	        )
	      );
	    }
	  }]);
	  return VideoChatLayout;
	}(_react2.default.Component);

	var _default = VideoChatLayout;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(VideoChatLayout, 'VideoChatLayout', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/videochat/VideoChatLayout.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/videochat/VideoChatLayout.jsx');
	}();

	;

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(52);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(57);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(58);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(62);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(97);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(105);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * UserVideo layout, renders the user video with
	 * 100% width and height.
	 */
	var UserVideo = function (_React$Component) {
	  (0, _inherits3.default)(UserVideo, _React$Component);

	  function UserVideo(props) {
	    (0, _classCallCheck3.default)(this, UserVideo);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (UserVideo.__proto__ || (0, _getPrototypeOf2.default)(UserVideo)).call(this, props));

	    _this.state = { video: 'playing', audio: 'unmuted' };

	    _this.pause = _this.pause.bind(_this);
	    _this.resume = _this.resume.bind(_this);
	    _this.mute = _this.mute.bind(_this);
	    _this.unmute = _this.unmute.bind(_this);
	    return _this;
	  }

	  (0, _createClass3.default)(UserVideo, [{
	    key: 'pause',
	    value: function pause() {
	      this.props.webrtc.pauseVideo();
	      this.setState({
	        video: 'paused'
	      });
	    }
	  }, {
	    key: 'resume',
	    value: function resume() {
	      this.props.webrtc.resumeVideo();
	      this.setState({
	        video: 'playing'
	      });
	    }
	  }, {
	    key: 'mute',
	    value: function mute() {
	      this.props.webrtc.mute();
	      this.setState({
	        audio: 'muted'
	      });
	    }
	  }, {
	    key: 'unmute',
	    value: function unmute() {
	      this.props.webrtc.unmute();
	      this.setState({
	        audio: 'unmuted'
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: this.props.position === 'maximized-video' ? 'user-video-container' : 'minimized-video-container' },
	        _react2.default.createElement('video', {
	          id: this.props.id,
	          className: this.props.position,
	          onClick: this.props.onClick.bind(null, this.props.id) }),
	        this.props.connected ? _react2.default.createElement(
	          'div',
	          { className: 'user-video-btn' },
	          this.state.video === 'playing' ? _react2.default.createElement('div', {
	            className: 'btn btn-danger pause',
	            title: 'Apagar video',

	            role: 'button',
	            onClick: this.pause
	          }) : _react2.default.createElement('div', {
	            className: 'btn btn-success play',
	            title: 'Prender video',

	            role: 'button',
	            onClick: this.resume
	          }),
	          this.state.audio === 'unmuted' ? _react2.default.createElement('div', {
	            className: 'btn btn-danger mute',
	            title: 'Silenciar',

	            role: 'button',
	            onClick: this.mute
	          }) : _react2.default.createElement('div', {
	            className: 'btn btn-success unmute',
	            title: 'Activar microfono',
	            role: 'button',
	            onClick: this.unmute
	          })
	        ) : null
	      );
	    }
	  }]);
	  return UserVideo;
	}(_react2.default.Component);

	var _default = UserVideo;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(UserVideo, 'UserVideo', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/user-video/UserVideo.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/user-video/UserVideo.jsx');
	}();

	;

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(52);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(57);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(58);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(62);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(97);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(105);

	var _react2 = _interopRequireDefault(_react);

	var _VideoStatus = __webpack_require__(109);

	var _VideoStatus2 = _interopRequireDefault(_VideoStatus);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Video layout, used for the rendering of remote
	 * videos.
	 */
	var Video = function (_React$Component) {
	  (0, _inherits3.default)(Video, _React$Component);

	  function Video(props) {
	    (0, _classCallCheck3.default)(this, Video);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (Video.__proto__ || (0, _getPrototypeOf2.default)(Video)).call(this, props));

	    _this.state = { startVolume: null };

	    _this.mute = _this.mute.bind(_this);
	    _this.unmute = _this.unmute.bind(_this);
	    return _this;
	  }

	  (0, _createClass3.default)(Video, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.setState({
	        startVolume: this.video.volume
	      });
	    }
	  }, {
	    key: 'mute',
	    value: function mute() {
	      this.video.volume = 0;
	    }
	  }, {
	    key: 'unmute',
	    value: function unmute() {
	      this.video.volume = this.state.startVolume;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return _react2.default.createElement(
	        'div',
	        { className: this.props.position === 'minimized-video' ? 'minimized-video-container' : null },
	        _react2.default.createElement(
	          'div',
	          { className: 'minimized-user-data' },
	          _react2.default.createElement(
	            'p',
	            { className: 'nick' },
	            this.props.peer.nick
	          ),
	          _react2.default.createElement(_VideoStatus2.default, {
	            peer: this.props.peer,
	            webrtc: this.props.webrtc })
	        ),
	        _react2.default.createElement('video', {
	          id: this.props.domId,
	          className: this.props.position,
	          onClick: this.props.onClick.bind(null, this.props.id),
	          src: URL.createObjectURL(this.props.peer.stream),
	          ref: function ref(e) {
	            return _this2.video = e;
	          },
	          onContextMenu: function onContextMenu() {
	            return false;
	          },
	          autoPlay: true })
	      );
	    }
	  }]);
	  return Video;
	}(_react2.default.Component);

	var _default = Video;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(Video, 'Video', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/video/Video.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/video/Video.jsx');
	}();

	;

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _defineProperty2 = __webpack_require__(110);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _getPrototypeOf = __webpack_require__(52);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(57);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(58);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(62);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(97);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(105);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Shows the status of a remote video.
	 * If the remote video is muted
	 * or paused, it shows icons.
	 *
	 * This is made in a separate component to prevent image
	 * flickering.
	 */
	var VideoStatus = function (_React$Component) {
	  (0, _inherits3.default)(VideoStatus, _React$Component);

	  function VideoStatus(props) {
	    (0, _classCallCheck3.default)(this, VideoStatus);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (VideoStatus.__proto__ || (0, _getPrototypeOf2.default)(VideoStatus)).call(this, props));

	    _this.state = { audio: 'unmuted', video: 'playing' };
	    return _this;
	  }

	  (0, _createClass3.default)(VideoStatus, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var self = this;

	      self.props.webrtc.on('mute', function (data) {
	        self.props.webrtc.getPeers(data.id).forEach(function (peer) {
	          if (peer.id === self.props.peer.id) {
	            self.setState((0, _defineProperty3.default)({}, data.name, data.name === 'audio' ? 'muted' : 'paused'));
	          }
	        });
	      });
	      self.props.webrtc.on('unmute', function (data) {
	        self.props.webrtc.getPeers(data.id).forEach(function (peer) {
	          if (peer.id === self.props.peer.id) {
	            self.setState((0, _defineProperty3.default)({}, data.name, data.name === 'audio' ? 'unmuted' : 'playing'));
	          }
	        });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        this.state.audio === 'muted' ? _react2.default.createElement(
	          'p',
	          null,
	          _react2.default.createElement(
	            'i',
	            { className: 'material-icons' },
	            'mic_off'
	          )
	        ) : null,
	        this.state.video === 'paused' ? _react2.default.createElement(
	          'p',
	          null,
	          _react2.default.createElement(
	            'i',
	            { className: 'material-icons' },
	            'videocam_off'
	          )
	        ) : null
	      );
	    }
	  }]);
	  return VideoStatus;
	}(_react2.default.Component);

	var _default = VideoStatus;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(VideoStatus, 'VideoStatus', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/video/VideoStatus.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/video/VideoStatus.jsx');
	}();

	;

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(59);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(52);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(57);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(58);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(62);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(97);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(105);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Renders error messages to tell user something
	 * is wrong with their inputs, etc.
	 */
	var ErrorMessage = function (_React$Component) {
	  (0, _inherits3.default)(ErrorMessage, _React$Component);

	  function ErrorMessage(props) {
	    (0, _classCallCheck3.default)(this, ErrorMessage);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (ErrorMessage.__proto__ || (0, _getPrototypeOf2.default)(ErrorMessage)).call(this, props));

	    _this.state = {};

	    _this.close = _this.close.bind(_this);
	    return _this;
	  }

	  (0, _createClass3.default)(ErrorMessage, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      setTimeout(this.close.bind(null), this.props.delay);
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      var self = this;

	      $('.error-message').removeClass('show-error');
	      $('.error-message').addClass('hide-error', function () {
	        setTimeout(self.props.error.bind(null, { type: 'hide' }), 700);
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: 'error-message show-error' },
	        _react2.default.createElement(
	          'div',
	          { className: 'error-body' },
	          this.props.body
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'error-close', onClick: this.close },
	          'Cerrar'
	        )
	      );
	    }
	  }]);
	  return ErrorMessage;
	}(_react2.default.Component);

	var _default = ErrorMessage;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(ErrorMessage, 'ErrorMessage', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/error-message/ErrorMessage.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/videocall/src/components/error-message/ErrorMessage.jsx');
	}();

	;

/***/ }
/******/ ]);