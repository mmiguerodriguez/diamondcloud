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
	module.exports = __webpack_require__(14);


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
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _reactDom = __webpack_require__(15);

	var _reactRouter = __webpack_require__(16);

	var _routes = __webpack_require__(17);

	var _routes2 = _interopRequireDefault(_routes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _reactDom.render)((0, _routes2.default)(), document.querySelector('#render-target'));

	_reactRouter.browserHistory.push('/tasks/show');
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }
	}();

	;

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = ReactRouter;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _reactRouter = __webpack_require__(16);

	var _TaskManagerPage = __webpack_require__(18);

	var _TaskManagerPage2 = _interopRequireDefault(_TaskManagerPage);

	var _BoardsList = __webpack_require__(116);

	var _BoardsList2 = _interopRequireDefault(_BoardsList);

	var _CreateTaskLayout = __webpack_require__(130);

	var _CreateTaskLayout2 = _interopRequireDefault(_CreateTaskLayout);

	var _ArchivedTasksPage = __webpack_require__(135);

	var _ArchivedTasksPage2 = _interopRequireDefault(_ArchivedTasksPage);

	var _TaskInformationLayout = __webpack_require__(137);

	var _TaskInformationLayout2 = _interopRequireDefault(_TaskInformationLayout);

	var _BoardInformationLayout = __webpack_require__(139);

	var _BoardInformationLayout2 = _interopRequireDefault(_BoardInformationLayout);

	var _Panel = __webpack_require__(140);

	var _Panel2 = _interopRequireDefault(_Panel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var renderRoutes = function renderRoutes() {
	  return React.createElement(
	    _reactRouter.Router,
	    { history: _reactRouter.browserHistory },
	    React.createElement(
	      _reactRouter.Route,
	      { path: '/', component: _TaskManagerPage2.default },
	      React.createElement(_reactRouter.Route, { path: '/tasks/show', component: _BoardsList2.default }),
	      React.createElement(_reactRouter.Route, { path: '/tasks/create', component: _CreateTaskLayout2.default }),
	      React.createElement(_reactRouter.Route, { path: '/tasks/archived', component: _ArchivedTasksPage2.default }),
	      React.createElement(_reactRouter.Route, { path: '/tasks/:taskId', component: _TaskInformationLayout2.default }),
	      React.createElement(_reactRouter.Route, { path: '/board/:boardId', component: _BoardInformationLayout2.default }),
	      React.createElement(_reactRouter.Route, { path: '/panel', component: _Panel2.default })
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

	  __REACT_HOT_LOADER__.register(renderRoutes, 'renderRoutes', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/routes.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/routes.jsx');
	}();

	;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends2 = __webpack_require__(19);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	var _isCoordination = __webpack_require__(111);

	var _isCoordination2 = _interopRequireDefault(_isCoordination);

	var _TaskManagerLayout = __webpack_require__(112);

	var _TaskManagerLayout2 = _interopRequireDefault(_TaskManagerLayout);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Grabs all the data needed for the component to work
	 * and passes it to the layout.
	 */
	var TaskManagerPage = function (_React$Component) {
	  (0, _inherits3.default)(TaskManagerPage, _React$Component);

	  function TaskManagerPage() {
	    (0, _classCallCheck3.default)(this, TaskManagerPage);

	    /**
	     * States
	     *
	     * @param {Array} tasks
	     *  All the tasks we need to show
	     *  to the user.
	     * @param {Object} currentBoard
	     *  Current board object.
	     * @param {Object} currentUser
	     *  Current user object.
	     * @param {Boolean} coordination
	     *  A bool that says if the actual
	     *  board is or not a
	     *  coordination
	     *  board.
	     * @param {Boolean} loading
	     *  A bool to check if the subscription
	     *  is loading.
	     * @param {Array} users
	     *  An array of the team users.
	     * @param {Array} boards
	     *  An array of the team boards.
	     */
	    var _this = (0, _possibleConstructorReturn3.default)(this, (TaskManagerPage.__proto__ || (0, _getPrototypeOf2.default)(TaskManagerPage)).call(this));

	    _this.state = {
	      tasks: [],
	      currentBoard: {},
	      currentUser: {},
	      coordination: false,
	      loading: true,
	      users: [],
	      boards: []
	    };
	    return _this;
	  }

	  (0, _createClass3.default)(TaskManagerPage, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var self = this;

	      $('[data-toggle="tooltip"]').tooltip({
	        container: 'body'
	      });

	      var currentBoard = DiamondAPI.getCurrentBoard();
	      var currentUser = DiamondAPI.getCurrentUser();
	      var coordination = (0, _isCoordination2.default)(currentBoard);

	      /**
	       * Set currentBoard, user and if it's a
	       * coordination board type, a boolean.
	       */
	      self.setState({
	        currentBoard: currentBoard,
	        currentUser: currentUser,
	        coordination: coordination
	      }, function () {
	        /**
	         * If it's a cordination board type then fetch all tasks,
	         * even finished ones, except archived.
	         * If not, fetch the ones that are from the
	         * currentBoard and that are not finished
	         * or queued.
	         */
	        var filter = coordination ? {} : {
	          archived: false,
	          status: {
	            $in: ['queued', 'not_finished']
	          },
	          boardId: currentBoard._id
	        };

	        /**
	         * After grabbing all the data we needed, subscribe
	         * to the tasks collection with the filter, and
	         * setting the state on the callback.
	         */
	        var taskManagerHandle = DiamondAPI.subscribe({
	          collection: 'tasks',
	          filter: filter,
	          callback: function callback(error, _result) {
	            if (error) {
	              console.error(error);
	            } else {
	              var result = _result;

	              result.sort(function (a, b) {
	                return new Date(a.startDate) - new Date(b.startDate);
	              });

	              self.setState({
	                tasks: result || [],
	                loading: false
	              });
	            }
	          }
	        });

	        self.setState({
	          boards: DiamondAPI.getBoards().fetch(),
	          users: DiamondAPI.getUsers()
	        });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.state.loading || this.state.loading === undefined) {
	        return _react2.default.createElement(
	          'div',
	          { className: 'loading' },
	          _react2.default.createElement('div', { className: 'loader' })
	        );
	      }

	      return _react2.default.createElement(_TaskManagerLayout2.default, (0, _extends3.default)({}, this.state, this.props));
	    }
	  }]);
	  return TaskManagerPage;
	}(_react2.default.Component);

	var _default = TaskManagerPage;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(TaskManagerPage, 'TaskManagerPage', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/task-manager/TaskManagerPage.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/task-manager/TaskManagerPage.jsx');
	}();

	;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(20);

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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(21), __esModule: true };

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(22);
	module.exports = __webpack_require__(25).Object.assign;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(23);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(38)});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(24)
	  , core      = __webpack_require__(25)
	  , ctx       = __webpack_require__(26)
	  , hide      = __webpack_require__(28)
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
/* 24 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 25 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(27);
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
/* 27 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(29)
	  , createDesc = __webpack_require__(37);
	module.exports = __webpack_require__(33) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(30)
	  , IE8_DOM_DEFINE = __webpack_require__(32)
	  , toPrimitive    = __webpack_require__(36)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(33) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(31);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(33) && !__webpack_require__(34)(function(){
	  return Object.defineProperty(__webpack_require__(35)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(34)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(31)
	  , document = __webpack_require__(24).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(31);
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
/* 37 */
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(39)
	  , gOPS     = __webpack_require__(54)
	  , pIE      = __webpack_require__(55)
	  , toObject = __webpack_require__(56)
	  , IObject  = __webpack_require__(43)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(34)(function(){
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
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(40)
	  , enumBugKeys = __webpack_require__(53);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(41)
	  , toIObject    = __webpack_require__(42)
	  , arrayIndexOf = __webpack_require__(46)(false)
	  , IE_PROTO     = __webpack_require__(50)('IE_PROTO');

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
/* 41 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(43)
	  , defined = __webpack_require__(45);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(44);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(42)
	  , toLength  = __webpack_require__(47)
	  , toIndex   = __webpack_require__(49);
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
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(48)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(48)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(51)('keys')
	  , uid    = __webpack_require__(52);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(24)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 54 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 55 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(45);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(58), __esModule: true };

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(59);
	module.exports = __webpack_require__(25).Object.getPrototypeOf;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(56)
	  , $getPrototypeOf = __webpack_require__(60);

	__webpack_require__(61)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(41)
	  , toObject    = __webpack_require__(56)
	  , IE_PROTO    = __webpack_require__(50)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(23)
	  , core    = __webpack_require__(25)
	  , fails   = __webpack_require__(34);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(64);

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
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(65), __esModule: true };

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(66);
	var $Object = __webpack_require__(25).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(23);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(33), 'Object', {defineProperty: __webpack_require__(29).f});

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(68);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(69);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(88);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(70), __esModule: true };

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(71);
	__webpack_require__(83);
	module.exports = __webpack_require__(87).f('iterator');

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(72)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(73)(String, 'String', function(iterated){
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
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(48)
	  , defined   = __webpack_require__(45);
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
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(74)
	  , $export        = __webpack_require__(23)
	  , redefine       = __webpack_require__(75)
	  , hide           = __webpack_require__(28)
	  , has            = __webpack_require__(41)
	  , Iterators      = __webpack_require__(76)
	  , $iterCreate    = __webpack_require__(77)
	  , setToStringTag = __webpack_require__(81)
	  , getPrototypeOf = __webpack_require__(60)
	  , ITERATOR       = __webpack_require__(82)('iterator')
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
/* 74 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(28);

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(78)
	  , descriptor     = __webpack_require__(37)
	  , setToStringTag = __webpack_require__(81)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(28)(IteratorPrototype, __webpack_require__(82)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(30)
	  , dPs         = __webpack_require__(79)
	  , enumBugKeys = __webpack_require__(53)
	  , IE_PROTO    = __webpack_require__(50)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(35)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(80).appendChild(iframe);
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
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(29)
	  , anObject = __webpack_require__(30)
	  , getKeys  = __webpack_require__(39);

	module.exports = __webpack_require__(33) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(24).document && document.documentElement;

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(29).f
	  , has = __webpack_require__(41)
	  , TAG = __webpack_require__(82)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(51)('wks')
	  , uid        = __webpack_require__(52)
	  , Symbol     = __webpack_require__(24).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(84);
	var global        = __webpack_require__(24)
	  , hide          = __webpack_require__(28)
	  , Iterators     = __webpack_require__(76)
	  , TO_STRING_TAG = __webpack_require__(82)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(85)
	  , step             = __webpack_require__(86)
	  , Iterators        = __webpack_require__(76)
	  , toIObject        = __webpack_require__(42);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(73)(Array, 'Array', function(iterated, kind){
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
/* 85 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(82);

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(89), __esModule: true };

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(90);
	__webpack_require__(99);
	__webpack_require__(100);
	__webpack_require__(101);
	module.exports = __webpack_require__(25).Symbol;

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(24)
	  , has            = __webpack_require__(41)
	  , DESCRIPTORS    = __webpack_require__(33)
	  , $export        = __webpack_require__(23)
	  , redefine       = __webpack_require__(75)
	  , META           = __webpack_require__(91).KEY
	  , $fails         = __webpack_require__(34)
	  , shared         = __webpack_require__(51)
	  , setToStringTag = __webpack_require__(81)
	  , uid            = __webpack_require__(52)
	  , wks            = __webpack_require__(82)
	  , wksExt         = __webpack_require__(87)
	  , wksDefine      = __webpack_require__(92)
	  , keyOf          = __webpack_require__(93)
	  , enumKeys       = __webpack_require__(94)
	  , isArray        = __webpack_require__(95)
	  , anObject       = __webpack_require__(30)
	  , toIObject      = __webpack_require__(42)
	  , toPrimitive    = __webpack_require__(36)
	  , createDesc     = __webpack_require__(37)
	  , _create        = __webpack_require__(78)
	  , gOPNExt        = __webpack_require__(96)
	  , $GOPD          = __webpack_require__(98)
	  , $DP            = __webpack_require__(29)
	  , $keys          = __webpack_require__(39)
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
	  __webpack_require__(97).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(55).f  = $propertyIsEnumerable;
	  __webpack_require__(54).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(74)){
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(28)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(52)('meta')
	  , isObject = __webpack_require__(31)
	  , has      = __webpack_require__(41)
	  , setDesc  = __webpack_require__(29).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(34)(function(){
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
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(24)
	  , core           = __webpack_require__(25)
	  , LIBRARY        = __webpack_require__(74)
	  , wksExt         = __webpack_require__(87)
	  , defineProperty = __webpack_require__(29).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(39)
	  , toIObject = __webpack_require__(42);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(39)
	  , gOPS    = __webpack_require__(54)
	  , pIE     = __webpack_require__(55);
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
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(44);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(42)
	  , gOPN      = __webpack_require__(97).f
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
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(40)
	  , hiddenKeys = __webpack_require__(53).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(55)
	  , createDesc     = __webpack_require__(37)
	  , toIObject      = __webpack_require__(42)
	  , toPrimitive    = __webpack_require__(36)
	  , has            = __webpack_require__(41)
	  , IE8_DOM_DEFINE = __webpack_require__(32)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(33) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 99 */
/***/ function(module, exports) {

	

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(92)('asyncIterator');

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(92)('observable');

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(103);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(107);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(68);

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
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(104), __esModule: true };

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(105);
	module.exports = __webpack_require__(25).Object.setPrototypeOf;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(23);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(106).set});

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(31)
	  , anObject = __webpack_require__(30);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(26)(Function.call, __webpack_require__(98).f(Object.prototype, '__proto__').set, 2);
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
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(108), __esModule: true };

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(109);
	var $Object = __webpack_require__(25).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(23)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(78)});

/***/ },
/* 110 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 111 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var isCoordination = function isCoordination(board) {
	  var coordinationTypes = ['coordinadores', 'directores creativos', 'directores de cuentas'];

	  return coordinationTypes.indexOf(board.type) > -1;
	};

	var _default = isCoordination;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(isCoordination, 'isCoordination', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/helpers/isCoordination.js');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/helpers/isCoordination.js');
	}();

	;

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends2 = __webpack_require__(19);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _defineProperty2 = __webpack_require__(113);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(16);

	var _classNames = __webpack_require__(114);

	var _classNames2 = _interopRequireDefault(_classNames);

	var _ErrorMessage = __webpack_require__(115);

	var _ErrorMessage2 = _interopRequireDefault(_ErrorMessage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ERROR_DELAY = 5000;

	/**
	 * Clones the actual route element (this.props.children)
	 * to pass props to it and renders the routes.
	 */

	var TaskManagerLayout = function (_React$Component) {
	  (0, _inherits3.default)(TaskManagerLayout, _React$Component);
	  (0, _createClass3.default)(TaskManagerLayout, [{
	    key: 'showError',

	    /**
	     * Sets the error state so we can show an error
	     * correctly.
	     * @param {Object} object
	     *  @param {String} body
	     *   Error message.
	     *  @param {Number} delay
	     *   The delay until the message is closed
	     *  @param {Boolean} showing.
	     *   State to check if the message is being
	     *   shown or not.
	     */
	    value: function showError(_ref) {
	      var body = _ref.body,
	          delay = _ref.delay;

	      this.setState({
	        error: {
	          body: body,
	          delay: delay || ERROR_DELAY,
	          showing: true
	        }
	      });
	    }
	    /**
	     * Resets the error state to the default.
	     */

	  }, {
	    key: 'hideError',
	    value: function hideError() {
	      this.setState({
	        error: {
	          body: '',
	          delay: ERROR_DELAY,
	          showing: false
	        }
	      });
	    }
	  }, {
	    key: 'setLocation',
	    value: function setLocation(location) {
	      _reactRouter.browserHistory.push(location);
	    }
	  }, {
	    key: 'handleChange',
	    value: function handleChange(index, boardId, event) {
	      var _setState;

	      this.setState((_setState = {}, (0, _defineProperty3.default)(_setState, index, event.target.value), (0, _defineProperty3.default)(_setState, 'selectedBoardId', boardId), _setState));
	    }
	  }]);

	  function TaskManagerLayout(props) {
	    (0, _classCallCheck3.default)(this, TaskManagerLayout);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (TaskManagerLayout.__proto__ || (0, _getPrototypeOf2.default)(TaskManagerLayout)).call(this, props));

	    _this.state = {
	      taskTitle: '',
	      selectedBoardId: undefined,
	      error: {
	        body: '',
	        delay: ERROR_DELAY,
	        showing: false
	      }
	    };

	    _this.showError = _this.showError.bind(_this);
	    _this.hideError = _this.hideError.bind(_this);
	    _this.setLocation = _this.setLocation.bind(_this);
	    _this.handleChange = _this.handleChange.bind(_this);
	    return _this;
	  }

	  (0, _createClass3.default)(TaskManagerLayout, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var isCoordination = this.props.coordination;
	      var isUnarchiving = this.props.location.pathname.indexOf('archived') > -1;
	      var isPanel = this.props.location.pathname.indexOf('panel') > -1;
	      var hasArchivedTasks = this.props.tasks.filter(function (_task) {
	        return _task.archived;
	      }).length > 0;

	      var classes = (0, _classNames2.default)({
	        fixed: isPanel
	      }, 'view-archived-tasks');

	      return _react2.default.createElement(
	        'div',
	        { className: 'col-xs-12 task-manager' },
	        _react2.default.createElement(
	          'div',
	          { className: 'row board-list-title' },

	          // Show back button for panel
	          isPanel || isUnarchiving ? _react2.default.createElement('div', {
	            className: 'go-back go-back-task',
	            onClick: function onClick() {
	              return _this2.setLocation('tasks/show');
	            }
	          }) : null,
	          _react2.default.createElement(
	            'div',
	            {
	              role: 'button',
	              className: 'col-xs-12 text-center',
	              onClick: function onClick() {
	                return _this2.setLocation('tasks/show');
	              }
	            },
	            _react2.default.createElement(
	              'b',
	              null,
	              'Lista de tareas'
	            )
	          ),

	          // Show archived tasks button
	          isCoordination && !isUnarchiving && hasArchivedTasks ? _react2.default.createElement('div', {
	            id: 'view-archived-tasks',
	            className: classes,
	            title: 'Ver tareas archivadas',
	            'data-toggle': 'tooltip',
	            'data-placement': 'bottom',
	            role: 'button',
	            onClick: function onClick(e) {
	              $('#' + e.target.id).tooltip('hide');
	              _this2.setLocation('tasks/archived');
	            }
	          }) : null,

	          // Show show-panel button
	          isCoordination && !isPanel ? _react2.default.createElement('div', {
	            id: 'show-panel',
	            className: 'text-center panel-btn',
	            title: 'Configurar tipos de tareas',
	            'data-toggle': 'tooltip',
	            'data-placement': 'bottom',
	            role: 'button',
	            onClick: function onClick(e) {
	              $('#' + e.target.id).tooltip('hide');
	              _this2.setLocation('panel');
	            }
	          }) : null
	        ),
	        _react2.default.createElement('hr', { className: 'hr-fix' }),
	        _react2.default.cloneElement(this.props.children, (0, _extends3.default)({}, this.props, this.state, {
	          setLocation: this.setLocation,
	          handleChange: this.handleChange,
	          showError: this.showError,
	          hideError: this.hideError
	        })),
	        this.state.error.showing ? _react2.default.createElement(_ErrorMessage2.default, (0, _extends3.default)({
	          hideError: this.hideError
	        }, this.state.error)) : null
	      );
	    }
	  }]);
	  return TaskManagerLayout;
	}(_react2.default.Component);

	var _default = TaskManagerLayout;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(ERROR_DELAY, 'ERROR_DELAY', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/task-manager/TaskManagerLayout.jsx');

	  __REACT_HOT_LOADER__.register(TaskManagerLayout, 'TaskManagerLayout', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/task-manager/TaskManagerLayout.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/task-manager/TaskManagerLayout.jsx');
	}();

	;

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(64);

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
/* 114 */
/***/ function(module, exports) {

	module.exports = classNames;

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Renders error messages to tell user something
	 * is wrong with their inputs, etc.
	 */
	var ErrorMessage = function (_React$Component) {
	  (0, _inherits3.default)(ErrorMessage, _React$Component);
	  (0, _createClass3.default)(ErrorMessage, [{
	    key: 'close',
	    value: function close() {
	      var self = this;

	      $('.error-message').removeClass('show-error');
	      $('.error-message').addClass('hide-error', function () {
	        setTimeout(self.props.hideError.bind(null), 700);
	      });
	    }
	  }]);

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

	  __REACT_HOT_LOADER__.register(ErrorMessage, 'ErrorMessage', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/error-message/ErrorMessage.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/error-message/ErrorMessage.jsx');
	}();

	;

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	var _isCoordination = __webpack_require__(111);

	var _isCoordination2 = _interopRequireDefault(_isCoordination);

	var _Board = __webpack_require__(117);

	var _Board2 = _interopRequireDefault(_Board);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Renders all the boards the team has.
	 */
	var BoardsList = function (_React$Component) {
	  (0, _inherits3.default)(BoardsList, _React$Component);

	  function BoardsList() {
	    (0, _classCallCheck3.default)(this, BoardsList);
	    return (0, _possibleConstructorReturn3.default)(this, (BoardsList.__proto__ || (0, _getPrototypeOf2.default)(BoardsList)).apply(this, arguments));
	  }

	  (0, _createClass3.default)(BoardsList, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      $('[data-toggle="tooltip"]').tooltip({
	        container: 'body'
	      });
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      $('[data-toggle="tooltip"]').tooltip({
	        container: 'body'
	      });
	    }
	  }, {
	    key: 'renderBoards',
	    value: function renderBoards() {
	      var _this2 = this;

	      return this.props.boards.map(function (board) {
	        var tasks = [];

	        /**
	         * If there are tasks then push task to array
	         * if it is from the actual board.
	         */
	        if (_this2.props.tasks !== undefined) {
	          _this2.props.tasks.forEach(function (task) {
	            if (task.boardId === board._id) {
	              tasks.push(task);
	            }
	          });
	        }

	        /**
	         * If it isn't a coordination board then we
	         * render only one board tasks.
	         */
	        if (!_this2.props.coordination) {
	          if (board._id === _this2.props.currentBoard._id) {
	            return _react2.default.createElement(_Board2.default, {
	              key: board._id,
	              board: board,
	              tasks: tasks,
	              coordination: _this2.props.coordination,
	              setLocation: _this2.props.setLocation,
	              currentUser: _this2.props.currentUser,
	              showError: _this2.props.showError,
	              hideError: _this2.props.hideError,
	              location: _this2.props.location
	            });
	          } else {
	            return;
	          }
	        }

	        /**
	         * If it is a coordination board then it will
	         * return all the boards except for the
	         * coordination one.
	         */
	        if (!(0, _isCoordination2.default)(board)) {
	          return _react2.default.createElement(_Board2.default, {
	            key: board._id,
	            board: board,
	            tasks: tasks,
	            coordination: _this2.props.coordination,
	            setLocation: _this2.props.setLocation,
	            currentUser: _this2.props.currentUser,
	            handleChange: _this2.props.handleChange,
	            showError: _this2.props.showError,
	            hideError: _this2.props.hideError,
	            location: _this2.props.location
	          });
	        } else {
	          return;
	        }
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: 'col-xs-12 board-list' },
	        this.renderBoards()
	      );
	    }
	  }]);
	  return BoardsList;
	}(_react2.default.Component);

	var _default = BoardsList;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(BoardsList, 'BoardsList', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/boards/BoardsList.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/boards/BoardsList.jsx');
	}();

	;

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	var _classNames = __webpack_require__(114);

	var _classNames2 = _interopRequireDefault(_classNames);

	var _TasksList = __webpack_require__(118);

	var _TasksList2 = _interopRequireDefault(_TasksList);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Renders an unique board with its tasks.
	 */
	var Board = function (_React$Component) {
	  (0, _inherits3.default)(Board, _React$Component);

	  function Board() {
	    (0, _classCallCheck3.default)(this, Board);
	    return (0, _possibleConstructorReturn3.default)(this, (Board.__proto__ || (0, _getPrototypeOf2.default)(Board)).apply(this, arguments));
	  }

	  (0, _createClass3.default)(Board, [{
	    key: 'render',
	    value: function render() {
	      var classes = (0, _classNames2.default)({
	        'no-coordination-board': !this.props.coordination,
	        'board-fixed': this.props.coordination
	      });

	      var tasks = this.props.tasks.filter(function (task) {
	        return !task.archived;
	      });
	      tasks = this.props.coordination ? tasks : tasks.filter(function (task) {
	        return task.status === 'not_finished' || task.status === 'queued';
	      });

	      return _react2.default.createElement(
	        'div',
	        { className: classes },
	        _react2.default.createElement(_TasksList2.default, {
	          tasks: tasks,
	          board: this.props.board,
	          coordination: this.props.coordination,
	          setLocation: this.props.setLocation,
	          currentUser: this.props.currentUser,
	          handleChange: this.props.handleChange,
	          showError: this.props.showError,
	          hideError: this.props.hideError,
	          location: this.props.location
	        })
	      );
	    }
	  }]);
	  return Board;
	}(_react2.default.Component);

	var _default = Board;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(Board, 'Board', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/boards/board/Board.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/boards/board/Board.jsx');
	}();

	;

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	var _Task = __webpack_require__(119);

	var _Task2 = _interopRequireDefault(_Task);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Renders the task list from a board.
	 */
	var TasksList = function (_React$Component) {
	  (0, _inherits3.default)(TasksList, _React$Component);
	  (0, _createClass3.default)(TasksList, [{
	    key: 'renderTasks',
	    value: function renderTasks() {
	      var _this2 = this;

	      if (this.props.tasks.length === 0) {
	        if (this.props.location.pathname.indexOf('archived') > -1) {
	          return _react2.default.createElement(
	            'div',
	            { className: 'text-center no-task' },
	            'No hay tareas archivadas'
	          );
	        }

	        return _react2.default.createElement(
	          'div',
	          { className: 'text-center no-task' },
	          'No hay tareas asignadas a este pizarr\xF3n'
	        );
	      }

	      return this.props.tasks.map(function (task) {
	        var doing = false;

	        task.durations.forEach(function (duration) {
	          if (duration.userId === _this2.props.currentUser._id) {
	            if (!duration.endTime) {
	              doing = true;
	            }
	          }
	        });

	        return _react2.default.createElement(_Task2.default, {
	          key: task._id,
	          task: task,
	          doing: doing,
	          board: _this2.props.board,
	          coordination: _this2.props.coordination,
	          currentUser: _this2.props.currentUser,
	          showError: _this2.props.showError,
	          hideError: _this2.props.hideError
	        });
	      });
	    }
	  }, {
	    key: 'handleKeyDown',
	    value: function handleKeyDown(event) {
	      if (event.which === 13) {
	        this.props.setLocation('tasks/create');
	      }
	    }
	  }]);

	  function TasksList(props) {
	    (0, _classCallCheck3.default)(this, TasksList);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (TasksList.__proto__ || (0, _getPrototypeOf2.default)(TasksList)).call(this, props));

	    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
	    return _this;
	  }

	  (0, _createClass3.default)(TasksList, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var self = this;

	      $('.tasks-list').droppable({
	        accept: '.task',
	        drop: function drop(event, ui) {
	          var $board = $(this);
	          var $drag = $(ui.draggable);
	          var taskId = $drag.data('task-id');
	          var taskBoardId = $drag.data('task-board-id');
	          var boardId = $board.data('board-id');

	          if (taskBoardId === boardId) {
	            return;
	          }

	          DiamondAPI.update({
	            collection: 'tasks',
	            filter: {
	              _id: taskId
	            },
	            updateQuery: {
	              $set: {
	                boardId: boardId,
	                status: 'queued',
	                rejectMessage: ''
	              }
	            },
	            callback: function callback(error, result) {
	              if (error) {
	                self.props.showError({
	                  body: 'Hubo un error al cambiar la tarea de pizarrón'
	                });
	              }
	            }
	          });
	        }
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      var hasTasks = this.props.tasks.filter(function (_task) {
	        return _task.boardId === _this3.props.board._id && !_task.archived && _task.status !== 'rejected';
	      }).length > 0;

	      return _react2.default.createElement(
	        'div',
	        { className: 'col-xs-12 tasks-list', 'data-board-id': this.props.board._id },
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'p',
	            { className: 'text-center' },
	            _react2.default.createElement(
	              'b',
	              null,
	              this.props.board.name
	            ),
	            this.props.coordination && !this.props.archivedView && hasTasks ? _react2.default.createElement('img', {
	              src: '/modules/task-manager/img/timeline.svg',
	              id: 'timeline-btn' + this.props.board._id,
	              className: 'timeline-btn',
	              title: 'Ver l\xEDnea de tiempo del pizarr\xF3n',
	              'data-toggle': 'tooltip',
	              'data-placement': 'bottom',
	              role: 'button',
	              onClick: function onClick(e) {
	                $('#' + e.target.id).tooltip('hide');
	                _this3.props.setLocation('/board/' + _this3.props.board._id);
	              }
	            }) : null
	          )
	        ),
	        this.renderTasks(),
	        this.props.coordination && !this.props.archivedView ? _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement('input', {
	            id: 'task_title',
	            className: 'form-control',
	            onChange: this.props.handleChange.bind(null, 'taskTitle', this.props.board._id),
	            onKeyDown: this.handleKeyDown,
	            placeholder: 'Agregue una nueva tarea',
	            type: 'text'
	          })
	        ) : null
	      );
	    }
	  }]);
	  return TasksList;
	}(_react2.default.Component);

	var _default = TasksList;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(TasksList, 'TasksList', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/tasks-list/TasksList.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/tasks-list/TasksList.jsx');
	}();

	;

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _toConsumableArray2 = __webpack_require__(120);

	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

	var _defineProperty2 = __webpack_require__(113);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(16);

	var _classNames = __webpack_require__(114);

	var _classNames2 = _interopRequireDefault(_classNames);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Renders an unique task.
	 */
	var Task = function (_React$Component) {
	  (0, _inherits3.default)(Task, _React$Component);
	  (0, _createClass3.default)(Task, [{
	    key: 'openTask',

	    /**
	     * Opens a task information.
	     * Routes to -> /task/taskId.
	     */
	    value: function openTask() {
	      if (this.props.coordination) {
	        _reactRouter.browserHistory.push('/tasks/' + this.props.task._id);
	      }
	    }
	    /**
	     * Starts a task, inserts the userId and startTime
	     * to the durations array and starts the timer
	     * interval.
	     */

	  }, {
	    key: 'startTask',
	    value: function startTask() {
	      var self = this;

	      $('#play-task-' + this.props.task._id).tooltip('hide');

	      self.startTimer(function () {
	        DiamondAPI.update({
	          collection: 'tasks',
	          filter: {
	            _id: self.props.task._id
	          },
	          updateQuery: {
	            $push: {
	              durations: {
	                userId: self.props.currentUser._id,
	                startTime: new Date().getTime(),
	                endTime: undefined
	              }
	            }
	          },
	          callback: function callback(error, result) {
	            if (error) {
	              self.props.showError({
	                body: 'Ocurrió un error interno al iniciar la tarea'
	              });

	              self.stopTimer();
	            } else {
	              self.props.showError({
	                body: 'Tarea iniciada'
	              });
	            }
	          }
	        });
	      });
	    }
	    /**
	     * Stops the task for the user setting his last
	     * task endTime to the actual date and stops
	     * the timer.
	     */

	  }, {
	    key: 'stopTask',
	    value: function stopTask() {
	      var self = this;

	      $('#pause-task-' + this.props.task._id).tooltip('hide');

	      self.stopTimer(function () {
	        var index = self.getLastTaskEndTimeIndex();

	        if (index === undefined) {
	          self.startTimer();
	          return;
	        }

	        DiamondAPI.update({
	          collection: 'tasks',
	          filter: {
	            _id: self.props.task._id
	          },
	          updateQuery: {
	            $set: (0, _defineProperty3.default)({}, 'durations.' + index + '.endTime', new Date().getTime())
	          },
	          callback: function callback(error, result) {
	            if (error) {
	              self.props.showError({
	                body: 'Error al pausar una tarea'
	              });

	              self.startTimer();
	            } else {
	              self.props.showError({
	                body: 'Tarea pausada'
	              });
	            }
	          }
	        });
	      });
	    }
	    /**
	     * Archives the tasks, sets archived: true.
	     * This command can be used only from the
	     * coordination board.
	     */

	  }, {
	    key: 'archiveTask',
	    value: function archiveTask() {
	      var self = this;

	      if (self.props.coordination) {
	        $('#archive-task-' + self.props.task._id).tooltip('destroy');

	        DiamondAPI.update({
	          collection: 'tasks',
	          filter: {
	            _id: self.props.task._id
	          },
	          updateQuery: {
	            $set: {
	              archived: true
	            }
	          },
	          callback: function callback(error, result) {
	            if (error) {
	              console.error(error);

	              self.props.showError({
	                body: 'Error al archivar una tarea'
	              });
	            } else {
	              self.props.showError({
	                body: 'Tarea archivada'
	              });
	            }
	          }
	        });
	      }
	    }
	    /**
	     * Dearchives the task, sets archived: false.
	     * This command can be used only from the
	     * coordination board.
	     */

	  }, {
	    key: 'dearchiveTask',
	    value: function dearchiveTask() {
	      var self = this;

	      if (self.props.coordination) {
	        $('#dearchive-task-' + self.props.task._id).tooltip('hide');

	        DiamondAPI.update({
	          collection: 'tasks',
	          filter: {
	            _id: self.props.task._id
	          },
	          updateQuery: {
	            $set: {
	              archived: false
	            }
	          },
	          callback: function callback(error, result) {
	            if (error) {
	              console.error(error);

	              self.props.showError({
	                body: 'Error al desarchivar una tarea'
	              });
	            } else {
	              self.props.showError({
	                body: 'Tarea desarchivada'
	              });
	            }
	          }
	        });
	      }
	    }
	    /**
	     * Sets the task status as the passed parameter.
	     * @param {String} status
	     */

	  }, {
	    key: 'setTaskStatus',
	    value: function setTaskStatus(status) {
	      var _this2 = this;

	      var self = this;
	      /**
	       * Used to stop all the durations from the users
	       * that have started the task.
	       * TODO: Fix issue when there is an error
	       * updating and set the durations as
	       * undefined again.
	       */
	      var updateQuery = void 0;

	      if (status === 'finished') {
	        (function () {
	          var durations = [];
	          var date = new Date().getTime();

	          _this2.props.task.durations.forEach(function (duration) {
	            var _duration = duration;
	            if (!_duration.endTime) {
	              _duration.endTime = date;
	            }

	            durations.push(_duration);
	          });

	          updateQuery = {
	            $set: {
	              durations: durations,
	              status: status
	            }
	          };

	          $('#finish-task-' + self.props.task._id).tooltip('destroy');
	        })();
	      } else if (status === 'not_finished') {
	        if (this.state.rejecting) {
	          this.setState({
	            rejecting: false
	          });
	        }

	        updateQuery = {
	          $set: {
	            status: status
	          }
	        };

	        $('#accept-task-' + self.props.task._id).tooltip('destroy');
	        $('#reject-task-' + self.props.task._id).tooltip('destroy');
	      } else if (status === 'rejected') {
	        updateQuery = {
	          $set: {
	            status: status,
	            rejectMessage: self.state.rejectDescription
	          }
	        };

	        $('#accept-task-' + self.props.task._id).tooltip('destroy');
	        $('#reject-task-' + self.props.task._id).tooltip('destroy');
	      } else if (status === 'queued') {
	        updateQuery = {
	          $set: {
	            status: status,
	            rejectMessage: ''
	          }
	        };

	        $('#restore-task-' + self.props.task._id).tooltip('destroy');
	      }

	      DiamondAPI.update({
	        collection: 'tasks',
	        filter: {
	          _id: self.props.task._id
	        },
	        updateQuery: updateQuery,
	        callback: function callback(error, result) {
	          if (error) {
	            self.props.showError({
	              body: 'Error al actualizar el estado de la tarea'
	            });
	          } else {
	            self.props.showError({
	              body: 'Estado de la tarea actualizado'
	            });
	          }
	        }
	      });
	    }
	    /**
	     * Sets the task title according to the task_title
	     * state variable.
	     */

	  }, {
	    key: 'setTaskTitle',
	    value: function setTaskTitle() {
	      var self = this;

	      if (self.props.coordination) {
	        if (self.state.task_title !== '') {
	          self.stopEditing(function () {
	            DiamondAPI.update({
	              collection: 'tasks',
	              filter: {
	                _id: self.props.task._id
	              },
	              updateQuery: {
	                $set: {
	                  title: self.state.task_title
	                }
	              },
	              callback: function callback(error, result) {
	                if (error) {
	                  self.props.showError({
	                    body: 'Error al actualizar el título de la tarea'
	                  });

	                  self.setState({
	                    task_title: self.props.task.title
	                  });
	                }
	              }
	            });
	          });
	        } else {
	          this.props.showError({
	            body: 'El título de la tarea es inválido'
	          });
	        }
	      }
	    }
	    /**
	     * Gets the last task update for the user.
	     * The duration in which user startTime
	     * exists and endTime is undefined.
	     *
	     * If the task was never started by the
	     * user, it returns a 'never_started'
	     * flag.
	     *
	     * @returns {Number} Date
	     */

	  }, {
	    key: 'getLastTaskUpdate',
	    value: function getLastTaskUpdate() {
	      var _this3 = this;

	      var startTimes = this.props.task.durations.map(function (duration) {
	        if (duration.userId === _this3.props.currentUser._id) {
	          if (duration.endTime === undefined || typeof duration.endTime === 'undefined') {
	            return duration.startTime;
	          } else {
	            return 0;
	          }
	        } else {
	          return 0;
	        }
	      });

	      if (startTimes.length > 0) {
	        return Math.max.apply(Math, (0, _toConsumableArray3.default)(startTimes));
	      } else {
	        return 'never_started';
	      }
	    }
	    /**
	     * Gets the last endTime index of the user from the
	     * durations array.
	     *
	     * It searches through all the durations from the
	     * taks and gives the index of the duration of
	     * the user that has endTime: undefined.
	     *
	     * @returns {Number} Date
	     * TODO: Deprecate this.
	     */

	  }, {
	    key: 'getLastTaskEndTimeIndex',
	    value: function getLastTaskEndTimeIndex() {
	      var _this4 = this;

	      var i = void 0;

	      this.props.task.durations.forEach(function (duration, index) {
	        if (!duration.endTime && duration.userId === _this4.props.currentUser._id) {
	          i = index;
	        }
	      });

	      return i;
	    }
	    /**
	     * Starts the timer and sets the interval and
	     * doing state.
	     *
	     * @param {Function} callback
	     *  Function to be called after the state
	     *  is set, usually to start the task.
	     */

	  }, {
	    key: 'startTimer',
	    value: function startTimer(callback) {
	      var intervalId = setInterval(this.prettyDate.bind(this), 1000);

	      this.setState({
	        intervalId: intervalId,
	        doing: true
	      }, function () {
	        if (typeof callback === 'function') {
	          callback();
	        }
	      });
	    }
	    /**
	     * Stops the timer, clears the interval
	     * and sets the state as not doing,
	     * no interval and count.
	     *
	     * @param {Function} callback
	     *  Function to be called after the state
	     *  is set, usually to stop the task.
	     */

	  }, {
	    key: 'stopTimer',
	    value: function stopTimer(callback) {
	      clearInterval(this.state.intervalId);

	      this.setState({
	        intervalId: false,
	        count: '00:00:00',
	        doing: false
	      }, function () {
	        if (typeof callback === 'function') {
	          callback();
	        }
	      });
	    }
	    /**
	     * Creates a nice format for the time the user has
	     * been doing a task.
	     *
	     * @returns {String} count
	     */

	  }, {
	    key: 'prettyDate',
	    value: function prettyDate() {
	      var start = this.getLastTaskUpdate();
	      var end = new Date().getTime();

	      var count = '';
	      var seconds = 0;
	      var minutes = 0;
	      var hours = 0;
	      var days = 0;

	      if (start !== 'never_started' && start !== 0) {
	        var difference_ms = end - start;
	        difference_ms = difference_ms / 1000;

	        seconds = Math.floor(difference_ms % 60);
	        difference_ms = difference_ms / 60;

	        minutes = Math.floor(difference_ms % 60);
	        difference_ms = difference_ms / 60;

	        hours = Math.floor(difference_ms % 24);
	        days = Math.floor(difference_ms / 24);
	      }

	      seconds = seconds > 9 ? "" + seconds : "0" + seconds;
	      minutes = minutes > 9 ? "" + minutes : "0" + minutes;
	      hours = hours > 9 ? "" + hours : "0" + hours;

	      count = hours + ':' + minutes + ':' + seconds;

	      this.setState({
	        count: count
	      });
	    }
	    /**
	     * Changes state so the coordinator can start editing
	     * the task title.
	     */

	  }, {
	    key: 'startEditing',
	    value: function startEditing() {
	      var _this5 = this;

	      $('#edit-task-' + this.props.task._id).tooltip('hide');

	      this.setState({
	        editing: true
	      }, function () {
	        $('#edit-task-input-' + _this5.props.task._id).focus();
	      });
	    }
	    /**
	     * Changes state so the coordination stops editing
	     * the task title.
	     * @param {Function} callback
	     *   Sets the title of the task in the db as
	     *   the way the coordinator wanted.
	     */

	  }, {
	    key: 'stopEditing',
	    value: function stopEditing(callback) {
	      this.setState({
	        editing: false
	      }, function () {
	        callback();
	      });
	    }
	    /**
	     * Creates a draggable for the task element
	     */

	  }, {
	    key: 'createDraggable',
	    value: function createDraggable() {
	      $(this.task).draggable({
	        revert: function revert(event, ui) {
	          var $drag = $(this);
	          var $board = $drag.parent();
	          var $dragStartBoard = $drag.data().parent;

	          return $board.is($dragStartBoard);
	        },
	        start: function start(event, ui) {
	          $(this).css('z-index', '1').data('parent', $(this).parent());
	        }
	      });
	    }
	  }, {
	    key: 'handleChange',
	    value: function handleChange(index, event) {
	      if (index === 'edit_task') {
	        if (this.props.coordination) {
	          this.setState((0, _defineProperty3.default)({}, index, event.target.value));
	        }
	      } else {
	        this.setState((0, _defineProperty3.default)({}, index, event.target.value));
	      }
	    }
	  }, {
	    key: 'handleKeyDown',
	    value: function handleKeyDown(index, event) {
	      if (event.which === 13) {
	        if (index === 'edit_task') {
	          if (this.props.coordination) {
	            this.setTaskTitle();
	          }
	        } else if (index === 'reject_task') {
	          this.setTaskStatus('rejected');
	        }
	      } else if (event.which === 27) {
	        if (index === 'reject_task') {
	          this.setState({
	            rejecting: false
	          }, function () {
	            $('[data-toggle="tooltip"]').tooltip({
	              container: 'body'
	            });
	          });
	        }
	      }
	    }
	  }]);

	  function Task(props) {
	    (0, _classCallCheck3.default)(this, Task);

	    /**
	     * States
	     *
	     * @param {String} count
	     *  The time in hh:mm:ss the user has been doing the task,
	     *  defaults '00:00:00'.
	     * @param {Any} intervalId
	     *  The intervalId the setInterval uses. Used for
	     *  internal work with the user timer.
	     * @param {Boolean} doing
	     *  Double-check if user is actually doing task for
	     *  faster rendering.
	     * @param {String} task_title
	     *  Used for editing a task title.
	     * @param {Boolean} editing
	     *  Used to check if user is editing the task title.
	     */
	    var _this = (0, _possibleConstructorReturn3.default)(this, (Task.__proto__ || (0, _getPrototypeOf2.default)(Task)).call(this, props));

	    _this.state = {
	      doing: _this.props.doing,
	      task_title: _this.props.task.title,

	      task_types: [],

	      editing: false,
	      rejecting: false,
	      rejectDescription: '',
	      showRejection: false,
	      showDescription: true,

	      intervalId: false,
	      count: '00:00:00'
	    };

	    _this.startTask = _this.startTask.bind(_this);
	    _this.stopTask = _this.stopTask.bind(_this);
	    _this.startEditing = _this.startEditing.bind(_this);
	    _this.stopEditing = _this.stopEditing.bind(_this);
	    _this.archiveTask = _this.archiveTask.bind(_this);
	    _this.dearchiveTask = _this.dearchiveTask.bind(_this);
	    _this.setTaskStatus = _this.setTaskStatus.bind(_this);
	    _this.handleChange = _this.handleChange.bind(_this);
	    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
	    _this.openTask = _this.openTask.bind(_this);
	    return _this;
	  }

	  (0, _createClass3.default)(Task, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      if (!this.props.coordination) {
	        if (this.props.doing) {
	          this.startTimer();
	        }
	      }
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      if (this.props.coordination) {
	        if (this.props.task.status === 'rejected' && !this.props.task.archived) {
	          this.createDraggable();
	        }
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (nextProps.task.title !== this.state.task_title) {
	        this.setState({
	          task_title: nextProps.task.title
	        });
	      }

	      if (this.props.coordination) {
	        if (nextProps.task.status !== this.props.task.status) {
	          if (nextProps.task.status === 'rejected' && !nextProps.task.archived) {
	            this.createDraggable();
	          }
	        }
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      if (this.props.coordination) {
	        $('#archive-task-' + this.props.task._id).tooltip('destroy');
	        $('#edit-task-' + this.props.task._id).tooltip('destroy');
	        $('#accept-task-' + this.props.task._id).tooltip('destroy');
	        $('#reject-task-' + this.props.task._id).tooltip('destroy');
	        $('#restore-task-' + this.props.task._id).tooltip('destroy');
	      } else {
	        $('#play-task-' + this.props.task._id).tooltip('destroy');
	        $('#pause-task-' + this.props.task._id).tooltip('destroy');
	        $('#finish-task-' + this.props.task._id).tooltip('destroy');
	      }

	      if (this.state.intervalId) {
	        this.stopTimer();
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this6 = this;

	      var self = this;

	      var isCoordination = this.props.coordination;
	      var isDoing = this.state.doing;
	      var isEditing = this.state.editing;
	      var isQueued = this.props.task.status === 'queued';
	      var isFinished = this.props.task.status === 'finished';
	      var isRejected = this.props.task.status === 'rejected';
	      var isRejecting = this.state.rejecting;
	      var isArchived = this.props.task.archived === true;
	      var showDescription = this.state.showDescription;

	      var role = (0, _classNames2.default)('button');
	      var containerClass = (0, _classNames2.default)({
	        'col-xs-12': isEditing || !isCoordination && !isFinished,
	        'col-xs-8': !isEditing && isCoordination,
	        'fixed-title': !isCoordination || !isEditing
	      });
	      var archiveClass = (0, _classNames2.default)({
	        'col-xs-2': isCoordination && !isEditing,
	        'col-xs-2 icon-fixed': isCoordination && !isEditing && !isFinished && !isRejected
	      }, 'archive-task');
	      var dearchiveClass = (0, _classNames2.default)({
	        'col-xs-2 icon-fixed': this.props.coordination && this.props.task.archived
	      }, 'unarchive-task');
	      var editClass = (0, _classNames2.default)({
	        'col-xs-2': isCoordination && !isEditing && isFinished,
	        'col-xs-2 icon-fixed': isCoordination && !isEditing && !isFinished
	      }, 'edit-task');
	      var descriptionClass = (0, _classNames2.default)({
	        'open-description': showDescription,
	        'hide-description': !showDescription
	      }, 'col-xs-10 description');
	      var clickHandle = isCoordination ? this.openTask : function () {
	        self.setState({
	          showDescription: !_this6.state.showDescription
	        });
	      };

	      return _react2.default.createElement(
	        'div',
	        {
	          ref: function ref(c) {
	            return _this6.task = c;
	          },
	          className: 'col-xs-12 task',
	          'data-task-id': this.props.task._id,
	          'data-task-board-id': this.props.board._id
	        },
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'div',
	            { className: containerClass },

	            /**
	             * Input or task information depending if user is
	             * editing or not a task
	             */
	            isEditing ? _react2.default.createElement('input', {
	              id: 'edit-task-input-' + this.props.task._id,
	              className: 'form-control edit-task-input',
	              type: 'text',
	              value: this.state.task_title,
	              onChange: function onChange(e) {
	                return _this6.handleChange('task_title', e);
	              },
	              onKeyDown: function onKeyDown(e) {
	                return _this6.handleKeyDown('edit_task', e);
	              }
	            }) : _react2.default.createElement(
	              'div',
	              null,
	              _react2.default.createElement(
	                'h5',
	                {
	                  role: role,
	                  onClick: clickHandle,
	                  className: 'task-title col-xs-12' },
	                this.state.task_title
	              ),

	              /**
	               * Task description
	               */
	              !isCoordination ? _react2.default.createElement(
	                'p',
	                { className: descriptionClass },
	                _react2.default.createElement(
	                  'b',
	                  null,
	                  'Descripci\xF3n:'
	                ),
	                ' ',
	                this.props.task.description
	              ) : null,

	              /**
	               * User task count
	               */
	              !isCoordination && isDoing ? _react2.default.createElement(
	                'p',
	                { className: 'col-xs-12 time-active' },
	                _react2.default.createElement(
	                  'b',
	                  null,
	                  'Tiempo activo:'
	                ),
	                ' ',
	                this.state.count
	              ) : null
	            )
	          ),

	          /**
	           * Edit task button
	           */
	          isCoordination && !isEditing && !isFinished && !isRejected && !isArchived ? _react2.default.createElement('div', {
	            id: 'edit-task-' + this.props.task._id,
	            className: editClass,
	            title: 'Editar tarea',
	            'data-toggle': 'tooltip',
	            'data-placement': 'bottom',
	            role: 'button',
	            onClick: this.startEditing
	          }) : null,

	          /**
	           * Archive a task button
	           */
	          isCoordination && !isEditing && !isArchived ? _react2.default.createElement('div', {
	            id: 'archive-task-' + this.props.task._id,
	            className: archiveClass,
	            title: 'Archivar tarea',
	            'data-toggle': 'tooltip',
	            'data-placement': 'bottom',
	            role: 'button',
	            onClick: this.archiveTask
	          }) : null,

	          /**
	           * Restore a task button
	           */
	          isCoordination && !isEditing && (isFinished || isRejected) && !isArchived ? _react2.default.createElement('div', {
	            id: 'restore-task-' + this.props.task._id,
	            className: 'col-xs-2 restore-task',
	            title: 'Restaurar tarea',
	            'data-toggle': 'tooltip',
	            'data-placement': 'bottom',
	            role: 'button',
	            onClick: function onClick() {
	              return _this6.setTaskStatus('queued');
	            }
	          }) : null,

	          /**
	           * Dearchive task button
	           */
	          isCoordination && isArchived ? _react2.default.createElement('div', {
	            id: 'dearchive-task-' + this.props.task._id,
	            className: dearchiveClass,
	            title: 'Desarchivar tarea',
	            'data-toggle': 'tooltip',
	            'data-placement': 'bottom',
	            role: 'button',
	            onClick: this.dearchiveTask
	          }) : null,

	          /**
	           * Task finished icon
	           */
	          isCoordination && !isEditing && isFinished ? _react2.default.createElement('div', { className: 'finished-task' }) : null,

	          /**
	           * Task rejected icon
	           */
	          isCoordination && !isEditing && isRejected ? _react2.default.createElement('div', { className: 'rejected-task' }) : null,

	          /**
	           * Rejected task message for coordinators
	           */
	          isCoordination && isRejected ? _react2.default.createElement(
	            'div',
	            { className: 'col-xs-12' },
	            _react2.default.createElement(
	              'p',
	              { className: 'rejected-message' },
	              _react2.default.createElement(
	                'b',
	                null,
	                'Mensaje de rechazo:'
	              ),
	              ' ',
	              this.props.task.rejectMessage
	            )
	          ) : null,

	          /**
	           * Pause button when a task is being done by a
	           * normal user
	           */
	          !isCoordination && isDoing && !isQueued ? _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	              'div',
	              { className: 'record' },
	              _react2.default.createElement('img', {
	                src: '/modules/task-manager/img/record.svg',
	                width: '25px'
	              })
	            ),
	            _react2.default.createElement(
	              'div',
	              {
	                id: 'pause-task-' + this.props.task._id,
	                className: 'pause',
	                'data-toggle': 'tooltip',
	                'data-placement': 'bottom',
	                title: 'Marcar como pausado',
	                role: 'button',
	                onClick: this.stopTask
	              },
	              _react2.default.createElement('img', {
	                src: '/modules/task-manager/img/pause-button.svg',
	                width: '15px'
	              })
	            )
	          ) : null,

	          /**
	           * Start button when a task isn't being done
	           * by a normal user and wants to start it
	           */
	          !isCoordination && !isDoing && !isQueued ? _react2.default.createElement(
	            'div',
	            {
	              id: 'play-task-' + this.props.task._id,
	              className: 'play',
	              'data-toggle': 'tooltip',
	              'data-placement': 'bottom',
	              title: 'Marcar como haciendo',
	              role: 'button',
	              onClick: this.startTask
	            },
	            _react2.default.createElement('img', {
	              src: '/modules/task-manager/img/play-arrow.svg',
	              width: '15px'
	            })
	          ) : null,

	          /**
	           * Finish a task button
	           */
	          !isCoordination && !isFinished && !isQueued ? _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	              'div',
	              {
	                id: 'finish-task-' + this.props.task._id,
	                className: 'done',
	                title: 'Marcar como finalizado',
	                'data-toggle': 'tooltip',
	                'data-placement': 'bottom',
	                role: 'button',
	                onClick: function onClick() {
	                  return _this6.setTaskStatus('finished');
	                }
	              },
	              _react2.default.createElement('img', {
	                src: '/modules/task-manager/img/finished-task.svg',
	                width: '20px'
	              })
	            )
	          ) : null,

	          /**
	           * Accept and reject task buttons for users
	           * to decide or not if they want to do
	           * that task
	           */
	          !isCoordination && isQueued && !isRejecting ? _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	              'div',
	              {
	                id: 'accept-task-' + this.props.task._id,
	                className: 'accept',
	                'data-toggle': 'tooltip',
	                'data-placement': 'bottom',
	                title: 'Aceptar tarea',
	                role: 'button',
	                onClick: function onClick() {
	                  return _this6.setTaskStatus('not_finished');
	                }
	              },
	              _react2.default.createElement('img', {
	                src: '/modules/task-manager/img/accept-task.svg',
	                width: '15px'
	              })
	            ),
	            _react2.default.createElement(
	              'div',
	              {
	                id: 'reject-task-' + this.props.task._id,
	                className: 'reject',
	                title: 'Rechazar tarea',
	                'data-toggle': 'tooltip',
	                'data-placement': 'bottom',
	                role: 'button',
	                onClick: function onClick() {
	                  var self = _this6;

	                  $('#reject-task-' + _this6.props.task._id).tooltip('hide');

	                  setTimeout(function () {
	                    self.setState({
	                      rejecting: !isRejecting
	                    }, function () {
	                      $('#reject-task-reason-' + self.props.task._id).focus();
	                    });
	                  }, 200);
	                }
	              },
	              _react2.default.createElement('img', {
	                src: '/modules/task-manager/img/reject-task.svg',
	                width: '15px'
	              })
	            )
	          ) : null,

	          /**
	           * Rejection message
	           */
	          !isCoordination && isRejecting ? _react2.default.createElement(
	            'div',
	            { className: 'col-xs-12 reject-message' },
	            _react2.default.createElement(
	              'b',
	              null,
	              'Raz\xF3n de rechazo:'
	            ),
	            _react2.default.createElement('input', {
	              id: 'reject-task-reason-' + this.props.task._id,
	              className: 'form-control',
	              type: 'text',
	              value: this.state.rejectDescription,
	              onChange: function onChange(e) {
	                return _this6.handleChange('rejectDescription', e);
	              },
	              onKeyDown: function onKeyDown(e) {
	                return _this6.handleKeyDown('reject_task', e);
	              }
	            })
	          ) : null,

	          /**
	           * Task term dates
	           */
	          !isEditing && !isRejecting ? _react2.default.createElement(
	            'div',
	            { className: 'col-xs-12' },
	            _react2.default.createElement(
	              'p',
	              { className: 'col-xs-12 expiration-date' },
	              _react2.default.createElement(
	                'b',
	                null,
	                'Plazo: '
	              ),
	              $.format.date(new Date(this.props.task.startDate), 'dd/MM/yy') + ' - ' + $.format.date(new Date(this.props.task.dueDate), 'dd/MM/yy')
	            )
	          ) : null
	        )
	      );
	    }
	  }]);
	  return Task;
	}(_react2.default.Component);

	var _default = Task;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(Task, 'Task', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/tasks-list/task/Task.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/tasks-list/task/Task.jsx');
	}();

	;

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _from = __webpack_require__(121);

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

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(122), __esModule: true };

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(71);
	__webpack_require__(123);
	module.exports = __webpack_require__(25).Array.from;

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(26)
	  , $export        = __webpack_require__(23)
	  , toObject       = __webpack_require__(56)
	  , call           = __webpack_require__(124)
	  , isArrayIter    = __webpack_require__(125)
	  , toLength       = __webpack_require__(47)
	  , createProperty = __webpack_require__(126)
	  , getIterFn      = __webpack_require__(127);

	$export($export.S + $export.F * !__webpack_require__(129)(function(iter){ Array.from(iter); }), 'Array', {
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


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(30);
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

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(76)
	  , ITERATOR   = __webpack_require__(82)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(29)
	  , createDesc      = __webpack_require__(37);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(128)
	  , ITERATOR  = __webpack_require__(82)('iterator')
	  , Iterators = __webpack_require__(76);
	module.exports = __webpack_require__(25).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(44)
	  , TAG = __webpack_require__(82)('toStringTag')
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

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(82)('iterator')
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

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _defineProperty2 = __webpack_require__(113);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _isInteger = __webpack_require__(131);

	var _isInteger2 = _interopRequireDefault(_isInteger);

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(16);

	var _isCoordination = __webpack_require__(111);

	var _isCoordination2 = _interopRequireDefault(_isCoordination);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Renders the layout to create a task.
	 */
	var CreateTaskLayout = function (_React$Component) {
	  (0, _inherits3.default)(CreateTaskLayout, _React$Component);

	  function CreateTaskLayout(props) {
	    (0, _classCallCheck3.default)(this, CreateTaskLayout);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (CreateTaskLayout.__proto__ || (0, _getPrototypeOf2.default)(CreateTaskLayout)).call(this, props));

	    _this.state = {
	      title: _this.props.taskTitle,
	      boardId: _this.props.selectedBoardId || _this.props.boards[0]._id,
	      description: '',
	      type: '',
	      startDate: new Date().getTime() + 1000 * 60 * 60,

	      task_types: []
	    };

	    _this.createTask = _this.createTask.bind(_this);
	    _this.handleChange = _this.handleChange.bind(_this);
	    return _this;
	  }
	  /**
	   * Creates a task checking before if the input data is
	   * correct.
	   */


	  (0, _createClass3.default)(CreateTaskLayout, [{
	    key: 'createTask',
	    value: function createTask() {
	      var self = this;

	      var position = self.getBiggestTaskPosition();

	      var type = Number(self.state.type);
	      var miliseconds = type * 24 * 60 * 60 * 1000;
	      var startDate = Number(self.state.startDate);
	      var dueDate = Number(startDate + miliseconds);

	      if (self.state.title.length <= 0 || self.state.title === '') {
	        self.props.showError({
	          body: 'El título de la tarea es inválido'
	        });
	        return;
	      }

	      if (self.state.type === '' || !(0, _isInteger2.default)(type)) {
	        self.props.showError({
	          body: 'El tipo de tarea es inválido'
	        });
	        return;
	      }

	      if (self.state.boardId === '') {
	        self.props.showError({
	          body: 'El pizarrón asociado a la tarea es inválido'
	        });
	        return;
	      }

	      if (!(0, _isInteger2.default)(startDate) || startDate === 0 || startDate < new Date().getTime()) {
	        self.props.showError({
	          body: 'La fecha de inicio de la tarea es inválida'
	        });
	        return;
	      }

	      if (startDate > dueDate) {
	        self.props.showError({
	          body: 'La fecha de inicio de la tarea es antes que la de finalización'
	        });
	        return;
	      }

	      if (position < 0) {
	        self.props.showError({
	          body: 'La posición de la tarea es inválida'
	        });
	        return;
	      }

	      DiamondAPI.insert({
	        collection: 'tasks',
	        object: {
	          title: self.state.title,
	          description: self.state.description || 'No hay descripción',
	          durations: [],
	          startDate: startDate,
	          dueDate: dueDate,
	          position: position,
	          status: 'queued',
	          archived: false,
	          boardId: self.state.boardId
	        },
	        isGlobal: true,
	        callback: function callback(error, result) {
	          if (error) {
	            console.error(error);
	          } else {
	            _reactRouter.browserHistory.push('/tasks/show');
	          }
	        }
	      });
	    }
	    /**
	     * Gets the biggest task position so it inserts the task
	     * position as the biggest + 1.
	     *
	     * @returns {Number} biggestTaskPosition
	     */

	  }, {
	    key: 'getBiggestTaskPosition',
	    value: function getBiggestTaskPosition() {
	      var _this2 = this;

	      var positions = [];

	      this.props.tasks.forEach(function (task) {
	        if (task.boardId === _this2.state.boardId) {
	          positions.push(task.position);
	        }
	      });

	      if (positions.length > 0) {
	        return Math.max.apply(Math, positions) + 1;
	      }

	      return 0;
	    }
	    /**
	     * Renders the <option> elements of the boards, except
	     * for the coordination board.
	     */

	  }, {
	    key: 'renderOptions',
	    value: function renderOptions() {
	      return this.props.boards.map(function (board) {
	        if (!(0, _isCoordination2.default)(board)) {
	          return _react2.default.createElement(
	            'option',
	            {
	              key: board._id,
	              value: board._id },
	            board.name
	          );
	        }

	        return null;
	      });
	    }
	  }, {
	    key: 'handleChange',
	    value: function handleChange(index, event) {
	      var value = event.target.value;

	      if (index === 'startDate') {
	        value = new Date(value).getTime();
	      }

	      this.setState((0, _defineProperty3.default)({}, index, value));
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var self = this;

	      DiamondAPI.get({
	        collection: 'task_types',
	        callback: function callback(error, result) {
	          if (error) {
	            self.props.showError({
	              body: 'Ocurrió un error interno al agarrar los tipos de tareas'
	            });
	          } else {
	            self.setState({
	              type: result.length ? result[0].time : '',
	              task_types: result
	            });
	          }
	        }
	      });

	      $('#create-task-title').focus();
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (nextProps.taskTitle !== this.props.taskTitle) {
	        this.setState({
	          title: nextProps.taskTitle
	        });
	      }
	    }
	  }, {
	    key: 'renderTaskTypes',
	    value: function renderTaskTypes() {
	      return this.state.task_types.map(function (type) {
	        return _react2.default.createElement(
	          'option',
	          { value: type.time },
	          type.name
	        );
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      return _react2.default.createElement(
	        'div',
	        { className: 'row create-task-form' },
	        _react2.default.createElement('div', {
	          className: 'go-back go-back-task',
	          onClick: function onClick() {
	            return _this3.props.setLocation('tasks/show');
	          }
	        }),
	        _react2.default.createElement(
	          'div',
	          { className: 'col-xs-12 create-task-inputs' },
	          _react2.default.createElement(
	            'div',
	            { className: 'form-group' },
	            _react2.default.createElement(
	              'label',
	              { className: 'control-label', htmlFor: 'create-task-title' },
	              'T\xEDtulo'
	            ),
	            _react2.default.createElement('input', {
	              id: 'create-task-title',
	              className: 'form-control',
	              value: this.state.title,
	              onChange: this.props.handleChange.bind(null, 'taskTitle', undefined),
	              type: 'text',
	              placeholder: 'Ingres\xE1 el t\xEDtulo'
	            })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'form-group' },
	            _react2.default.createElement(
	              'label',
	              { className: 'control-label', htmlFor: 'create-task-description' },
	              'Descripci\xF3n'
	            ),
	            _react2.default.createElement('textarea', {
	              id: 'create-task-description',
	              className: 'form-control',
	              placeholder: 'Ingres\xE1 la la descripci\xF3n de la tarea',
	              onChange: function onChange(e) {
	                return _this3.handleChange('description', e);
	              }
	            })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'form-group' },
	            _react2.default.createElement(
	              'label',
	              { className: 'control-label', htmlFor: 'create-task-board' },
	              'Pizarr\xF3n'
	            ),
	            _react2.default.createElement(
	              'select',
	              {
	                id: 'create-task-board',
	                className: 'form-control',
	                value: this.state.boardId,
	                onChange: function onChange(e) {
	                  return _this3.handleChange('boardId', e);
	                }
	              },
	              this.renderOptions()
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'form-group' },
	            _react2.default.createElement(
	              'label',
	              { className: 'control-label', htmlFor: 'create-task-board' },
	              'Tipo'
	            ),
	            _react2.default.createElement(
	              'select',
	              {
	                id: 'create-task-type',
	                className: 'form-control',
	                value: this.state.type,
	                onChange: function onChange(e) {
	                  return _this3.handleChange('type', e);
	                }
	              },
	              this.renderTaskTypes()
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'form-group' },
	            _react2.default.createElement(
	              'label',
	              { className: 'control-label', htmlFor: 'create-task-startdate' },
	              'Fecha de inicio'
	            ),
	            _react2.default.createElement('input', {
	              id: 'create-task-startdate',
	              className: 'form-control',
	              type: 'datetime-local',
	              placeholder: 'Ingres\xE1 la fecha de inicio',
	              onChange: function onChange(e) {
	                return _this3.handleChange('startDate', e);
	              },
	              defaultValue: $.format.date(this.state.startDate, 'yyyy-MM-ddThh:mm')
	            })
	          ),
	          _react2.default.createElement(
	            'button',
	            {
	              onClick: this.createTask,
	              type: 'submit',
	              className: 'btn btn-primary'
	            },
	            'Crear tarea'
	          )
	        )
	      );
	    }
	  }]);
	  return CreateTaskLayout;
	}(_react2.default.Component);

	var _default = CreateTaskLayout;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(CreateTaskLayout, 'CreateTaskLayout', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/create-task/CreateTaskLayout.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/create-task/CreateTaskLayout.jsx');
	}();

	;

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(132), __esModule: true };

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(133);
	module.exports = __webpack_require__(25).Number.isInteger;

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(23);

	$export($export.S, 'Number', {isInteger: __webpack_require__(134)});

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(31)
	  , floor    = Math.floor;
	module.exports = function isInteger(it){
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	var _ArchivedTasksLayout = __webpack_require__(136);

	var _ArchivedTasksLayout2 = _interopRequireDefault(_ArchivedTasksLayout);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Gets a list of archived tasks.
	 * If the board is coordination or directors, shows all archived tasks
	 * Otherwise, it shows archived tasks of the current board only.
	 */
	var ArchivedTasksPage = function (_React$Component) {
	  (0, _inherits3.default)(ArchivedTasksPage, _React$Component);

	  function ArchivedTasksPage() {
	    (0, _classCallCheck3.default)(this, ArchivedTasksPage);

	    /**
	     * States
	     *
	     * @param {Array} tasks
	     *  The archived tasks that are shown to the user.
	     */
	    var _this = (0, _possibleConstructorReturn3.default)(this, (ArchivedTasksPage.__proto__ || (0, _getPrototypeOf2.default)(ArchivedTasksPage)).call(this));

	    _this.state = {
	      tasks: [],
	      loading: true
	    };
	    return _this;
	  }

	  (0, _createClass3.default)(ArchivedTasksPage, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      //show only archived tasks
	      var tasks = this.props.tasks.filter(function (task) {
	        return task.archived;
	      });
	      this.setState({
	        tasks: tasks,
	        loading: false
	      });
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var tasks = nextProps.tasks.filter(function (task) {
	        return task.archived;
	      });
	      this.setState({
	        tasks: tasks,
	        loading: false
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.state.loading || this.state.loading === undefined) {
	        return _react2.default.createElement(
	          'div',
	          { className: 'loading' },
	          _react2.default.createElement('div', { className: 'loader' })
	        );
	      }

	      return _react2.default.createElement(_ArchivedTasksLayout2.default, {
	        tasks: this.state.tasks,
	        setLocation: this.props.setLocation,
	        showError: this.props.showError,
	        location: this.props.location
	      });
	    }
	  }]);
	  return ArchivedTasksPage;
	}(_react2.default.Component);

	var _default = ArchivedTasksPage;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(ArchivedTasksPage, 'ArchivedTasksPage', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/archived-tasks/ArchivedTasksPage.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/archived-tasks/ArchivedTasksPage.jsx');
	}();

	;

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	var _isCoordination = __webpack_require__(111);

	var _isCoordination2 = _interopRequireDefault(_isCoordination);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ArchivedTasksLayout = function (_React$Component) {
	  (0, _inherits3.default)(ArchivedTasksLayout, _React$Component);

	  function ArchivedTasksLayout() {
	    (0, _classCallCheck3.default)(this, ArchivedTasksLayout);
	    return (0, _possibleConstructorReturn3.default)(this, (ArchivedTasksLayout.__proto__ || (0, _getPrototypeOf2.default)(ArchivedTasksLayout)).apply(this, arguments));
	  }

	  (0, _createClass3.default)(ArchivedTasksLayout, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(TasksList, {
	        board: { name: 'Tareas archivadas' },
	        tasks: this.props.tasks,
	        coordination: (0, _isCoordination2.default)(DiamondAPI.getCurrentBoard()),
	        archivedView: true,
	        currentUser: DiamondAPI.getCurrentUser(),
	        handleChange: function handleChange() {
	          return true;
	        },
	        showError: this.props.showError,
	        hideError: this.props.hideError,
	        location: this.props.location
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      $('[data-toggle="tooltip"]').tooltip({
	        container: 'body'
	      });
	    }
	  }]);
	  return ArchivedTasksLayout;
	}(_react2.default.Component);

	ArchivedTasksLayout.propTypes = {
	  tasks: _react2.default.PropTypes.array.isRequired
	};

	var _default = ArchivedTasksLayout;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(ArchivedTasksLayout, 'ArchivedTasksLayout', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/archived-tasks/ArchivedTasksLayout.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/archived-tasks/ArchivedTasksLayout.jsx');
	}();

	;

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	var _UserTaskInformation = __webpack_require__(138);

	var _UserTaskInformation2 = _interopRequireDefault(_UserTaskInformation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Renders information from the task.
	 */
	var TaskInformationLayout = function (_React$Component) {
	  (0, _inherits3.default)(TaskInformationLayout, _React$Component);

	  function TaskInformationLayout() {
	    (0, _classCallCheck3.default)(this, TaskInformationLayout);
	    return (0, _possibleConstructorReturn3.default)(this, (TaskInformationLayout.__proto__ || (0, _getPrototypeOf2.default)(TaskInformationLayout)).apply(this, arguments));
	  }

	  (0, _createClass3.default)(TaskInformationLayout, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var task = void 0;
	      var board = void 0;
	      var status = void 0;

	      task = this.props.tasks.find(function (_task) {
	        return _task._id === _this2.props.params.taskId;
	      });
	      board = this.props.boards.find(function (_board) {
	        return _board._id === task.boardId;
	      });

	      if (task.status === 'finished') {
	        status = 'Finalizada';
	      } else if (task.status === 'not_finished') {
	        status = 'No finalizada';
	      } else if (task.status === 'queued') {
	        status = 'En espera';
	      } else if (task.status === 'rejected') {
	        status = 'Rechazada';
	      }

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement('div', {
	          className: 'go-back go-back-task',
	          onClick: task.archived ? function () {
	            return _this2.props.setLocation('tasks/archived');
	          } : function () {
	            return _this2.props.setLocation('tasks/show');
	          } }),
	        _react2.default.createElement(
	          'div',
	          { className: 'task-info col-xs-12' },
	          _react2.default.createElement(
	            'h4',
	            { className: 'task-info-title' },
	            'Informaci\xF3n de la tarea'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'item' },
	            _react2.default.createElement(
	              'p',
	              null,
	              _react2.default.createElement(
	                'b',
	                null,
	                'Tarea:'
	              ),
	              ' ',
	              task.title
	            ),
	            _react2.default.createElement(
	              'p',
	              null,
	              _react2.default.createElement(
	                'b',
	                null,
	                'Descripci\xF3n:'
	              ),
	              ' ',
	              task.description
	            ),
	            _react2.default.createElement(
	              'p',
	              null,
	              _react2.default.createElement(
	                'b',
	                null,
	                'Pizarr\xF3n:'
	              ),
	              ' ',
	              board.name
	            ),
	            _react2.default.createElement(
	              'p',
	              null,
	              _react2.default.createElement(
	                'b',
	                null,
	                'Plazo:'
	              ),
	              ' ' + $.format.date(new Date(task.startDate), 'dd/MM/yy') + ' - ' + $.format.date(new Date(task.dueDate), 'dd/MM/yy')
	            ),
	            _react2.default.createElement(
	              'p',
	              null,
	              _react2.default.createElement(
	                'b',
	                null,
	                'Estado:'
	              ),
	              ' ',
	              status
	            ),
	            _react2.default.createElement(_UserTaskInformation2.default, {
	              durations: task.durations,
	              users: this.props.users
	            })
	          )
	        )
	      );
	    }
	  }]);
	  return TaskInformationLayout;
	}(_react2.default.Component);

	var _default = TaskInformationLayout;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(TaskInformationLayout, 'TaskInformationLayout', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/task-information/TaskInformationLayout.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/task-information/TaskInformationLayout.jsx');
	}();

	;

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Renders users information from the task.
	 */
	var UserTaskInformation = function (_React$Component) {
	  (0, _inherits3.default)(UserTaskInformation, _React$Component);

	  function UserTaskInformation() {
	    (0, _classCallCheck3.default)(this, UserTaskInformation);
	    return (0, _possibleConstructorReturn3.default)(this, (UserTaskInformation.__proto__ || (0, _getPrototypeOf2.default)(UserTaskInformation)).apply(this, arguments));
	  }

	  (0, _createClass3.default)(UserTaskInformation, [{
	    key: "prettyDate",
	    value: function prettyDate(date) {
	      var difference_ms = date;
	      difference_ms = difference_ms / 1000;

	      var seconds = Math.floor(difference_ms % 60);
	      difference_ms = difference_ms / 60;

	      var minutes = Math.floor(difference_ms % 60);
	      difference_ms = difference_ms / 60;

	      var hours = Math.floor(difference_ms % 24);

	      seconds = seconds > 9 ? "" + seconds : "0" + seconds;
	      minutes = minutes > 9 ? "" + minutes : "0" + minutes;
	      hours = hours > 9 ? "" + hours : "0" + hours;

	      return hours + ':' + minutes + ':' + seconds;
	    }
	  }, {
	    key: "renderUsers",
	    value: function renderUsers() {
	      var _this2 = this;

	      return this.props.users.map(function (user) {
	        var time = 0;
	        var working = false;

	        _this2.props.durations.forEach(function (duration) {
	          if (duration.userId === user._id) {
	            if (duration.endTime) {
	              time += duration.endTime - duration.startTime;
	            } else {
	              working = true;
	            }
	          }
	        });

	        time = time !== 0 ? _this2.prettyDate(time) + ' hrs.' : 'No trabajó';

	        return _react2.default.createElement(
	          "div",
	          { className: "col-xs-12 col-sm-6 col-md-4 col-lg-3 user-time-info" },
	          _react2.default.createElement(
	            "p",
	            null,
	            _react2.default.createElement(
	              "b",
	              null,
	              user.profile.name
	            )
	          ),
	          _react2.default.createElement(
	            "p",
	            null,
	            working ? 'Trabajando actualmente' : "Tiempo trabajado:  " + time
	          )
	        );
	      });
	    }
	  }, {
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      $('.collapse').collapse();
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2.default.createElement(
	        "div",
	        null,
	        this.renderUsers()
	      );
	    }
	  }]);
	  return UserTaskInformation;
	}(_react2.default.Component);

	var _default = UserTaskInformation;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(UserTaskInformation, "UserTaskInformation", "/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/task-information/user-task-information/UserTaskInformation.jsx");

	  __REACT_HOT_LOADER__.register(_default, "default", "/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/task-information/user-task-information/UserTaskInformation.jsx");
	}();

	;

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Renders information of tasks within a board
	 */
	var BoardInformationLayout = function (_React$Component) {
	  (0, _inherits3.default)(BoardInformationLayout, _React$Component);

	  function BoardInformationLayout(props) {
	    (0, _classCallCheck3.default)(this, BoardInformationLayout);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (BoardInformationLayout.__proto__ || (0, _getPrototypeOf2.default)(BoardInformationLayout)).call(this, props));

	    var board = _this.props.boards.find(function (_board) {
	      return _board._id === _this.props.params.boardId;
	    });
	    var tasks = _this.props.tasks.filter(function (_task) {
	      return _task.boardId === board._id && !_task.archived && _task.status !== 'rejected';
	    });

	    _this.state = {
	      board: board,
	      tasks: tasks
	    };
	    return _this;
	  }

	  (0, _createClass3.default)(BoardInformationLayout, [{
	    key: 'drawChart',
	    value: function drawChart(data) {
	      var container = this.timeline;
	      var chart = new google.visualization.Timeline(container);
	      var dataTable = new google.visualization.DataTable();

	      dataTable.addColumn({ type: 'string', id: 'Tarea' });
	      dataTable.addColumn({ type: 'date', id: 'Inicio' });
	      dataTable.addColumn({ type: 'date', id: 'Fin' });

	      dataTable.addRows(data);
	      chart.draw(dataTable);
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var self = this;
	      var data = [];

	      this.state.tasks.forEach(function (task) {
	        data.push([task.title, new Date(task.startDate), new Date(task.dueDate)]);
	      });

	      if (this.state.tasks.length > 0) {
	        this.drawChart(data);
	        $(window).resize(self.drawChart.bind(this, data));
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      $(window).off('resize');
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return _react2.default.createElement(
	        'div',
	        { className: 'timeline-container' },
	        _react2.default.createElement('div', {
	          className: 'go-back go-back-task',
	          onClick: function onClick() {
	            return _this2.props.setLocation('tasks/show');
	          }
	        }),
	        _react2.default.createElement(
	          'div',
	          { className: 'text-center' },
	          _react2.default.createElement(
	            'b',
	            null,
	            this.state.board.name
	          )
	        ),
	        _react2.default.createElement('div', { className: 'timeline', ref: function ref(c) {
	            return _this2.timeline = c;
	          } }),
	        this.state.tasks.length === 0 ? _react2.default.createElement(
	          'div',
	          null,
	          'No hay tareas de las que mostrar informacion'
	        ) : null
	      );
	    }
	  }]);
	  return BoardInformationLayout;
	}(_react2.default.Component);

	var _default = BoardInformationLayout;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(BoardInformationLayout, 'BoardInformationLayout', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/board-information/BoardInformationLayout.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/board-information/BoardInformationLayout.jsx');
	}();

	;

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _defineProperty2 = __webpack_require__(113);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _isInteger = __webpack_require__(131);

	var _isInteger2 = _interopRequireDefault(_isInteger);

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(62);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(63);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(67);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(102);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(110);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Panel to add task-types
	 * Renders only to coordinators
	 */
	var Panel = function (_React$Component) {
	  (0, _inherits3.default)(Panel, _React$Component);

	  function Panel(props) {
	    (0, _classCallCheck3.default)(this, Panel);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (Panel.__proto__ || (0, _getPrototypeOf2.default)(Panel)).call(this, props));

	    _this.state = {
	      name: '',
	      time: '',

	      types: [],
	      subscription: {}
	    };

	    _this.handleChange = _this.handleChange.bind(_this);
	    _this.insertTaskType = _this.insertTaskType.bind(_this);
	    _this.removeTaskType = _this.removeTaskType.bind(_this);
	    return _this;
	  }

	  (0, _createClass3.default)(Panel, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var self = this;

	      $('[data-toggle="tooltip"]').tooltip({
	        container: 'body'
	      });

	      var subscription = DiamondAPI.subscribe({
	        collection: 'task_types',
	        callback: function callback(error, result) {
	          if (error) {
	            self.props.showError({
	              body: 'Ocurrió un error interno al agarrar los tipos de tareas'
	            });
	          } else {
	            self.setState({
	              types: result
	            });
	          }
	        }
	      });

	      self.setState({
	        subscription: subscription
	      });
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      $('[data-toggle="tooltip"]').tooltip({
	        container: 'body'
	      });
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.state.subscription.stop();
	    }
	  }, {
	    key: 'insertTaskType',
	    value: function insertTaskType() {
	      var self = this;
	      var _state = this.state,
	          name = _state.name,
	          time = _state.time;


	      time = Number(time);

	      this.setState({
	        name: '',
	        time: ''
	      });

	      if (name === '') {
	        this.props.showError({
	          body: 'Ingresá un nombre válido'
	        });
	        return;
	      }

	      if (name.length < 3) {
	        this.props.showError({
	          body: 'Ingresá un nombre con más de 3 caracteres'
	        });
	        return;
	      }

	      if (!(0, _isInteger2.default)(time) || Number(time) <= 0) {
	        this.props.showError({
	          body: 'El tiempo ingresado es inválido'
	        });
	        return;
	      }

	      DiamondAPI.insert({
	        collection: 'task_types',
	        object: {
	          name: name,
	          time: time
	        },
	        isGlobal: true,
	        callback: function callback(error, result) {
	          if (error) {
	            self.props.showError({
	              body: 'Hubo un error interno al insertar el tipo de tarea'
	            });
	          }
	        }
	      });
	    }
	  }, {
	    key: 'removeTaskType',
	    value: function removeTaskType(typeId) {
	      var self = this;

	      $('#task-type' + typeId).tooltip('destroy');

	      DiamondAPI.remove({
	        collection: 'task_types',
	        filter: {
	          _id: typeId
	        },
	        callback: function callback(error, result) {
	          if (error) {
	            self.props.showError({
	              body: 'Hubo un error interno al eliminar el tipo de tarea'
	            });
	          }
	        }
	      });
	    }
	  }, {
	    key: 'handleChange',
	    value: function handleChange(index, e) {
	      var value = e.target.value;

	      this.setState((0, _defineProperty3.default)({}, index, value));
	    }
	  }, {
	    key: 'renderTypes',
	    value: function renderTypes() {
	      var _this2 = this;

	      return this.state.types.map(function (type) {
	        return _react2.default.createElement(
	          'ul',
	          { className: 'task-type-item' },
	          _react2.default.createElement('div', {
	            id: 'task-type' + type._id,
	            className: 'remove-task',
	            title: 'Borrar tipo de tarea',
	            'data-toggle': 'tooltip',
	            'data-placement': 'bottom',
	            onClick: function onClick() {
	              return _this2.removeTaskType(type._id);
	            }
	          }),
	          _react2.default.createElement(
	            'p',
	            { className: 'task-type-item-name' },
	            'Tipo: ',
	            type.name
	          ),
	          _react2.default.createElement(
	            'p',
	            null,
	            'Duraci\xF3n: ',
	            type.time,
	            ' d\xEDas'
	          )
	        );
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      return _react2.default.createElement(
	        'div',
	        { className: 'task-type' },
	        _react2.default.createElement(
	          'h4',
	          { className: 'task-type-title' },
	          'Tipos de tareas'
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            { className: 'control-label', htmlFor: 'panel-task-type-name' },
	            'Nombre'
	          ),
	          _react2.default.createElement('input', {
	            id: 'panel-task-type-name',
	            className: 'form-control',
	            value: this.state.name,
	            onChange: function onChange(e) {
	              return _this3.handleChange('name', e);
	            },
	            type: 'text',
	            placeholder: 'Ingres\xE1 el nombre de la tarea'
	          })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            { className: 'control-label', htmlFor: 'panel-task-type-time' },
	            'Tiempo (d\xEDas)'
	          ),
	          _react2.default.createElement('input', {
	            id: 'panel-task-type-time',
	            className: 'form-control',
	            value: this.state.time,
	            onChange: function onChange(e) {
	              return _this3.handleChange('time', e);
	            },
	            type: 'number',
	            placeholder: 'Duraci\xF3n'
	          })
	        ),
	        _react2.default.createElement(
	          'button',
	          {
	            onClick: this.insertTaskType,
	            type: 'submit',
	            className: 'btn btn-primary'
	          },
	          'Crear tipo de tarea'
	        ),
	        _react2.default.createElement(
	          'ol',
	          { className: 'col-xs-12 task-type-list' },
	          this.renderTypes()
	        )
	      );
	    }
	  }]);
	  return Panel;
	}(_react2.default.Component);

	var _default = Panel;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(Panel, 'Panel', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/panel/Panel.jsx');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/ubuntu/workspace/cloud/public/modules/task-manager/src/components/panel/Panel.jsx');
	}();

	;

/***/ }
/******/ ]);