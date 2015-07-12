// Remove "use strict"; from transpiled module until
// https://bugs.webkit.org/show_bug.cgi?id=138038 is fixed
//
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.uuid = uuid;
exports.symbol = symbol;
exports.generateGuid = generateGuid;
exports.guidFor = guidFor;
exports.getMeta = getMeta;
exports.setMeta = setMeta;
exports.metaPath = metaPath;
exports.wrap = wrap;
exports.tryInvoke = tryInvoke;
exports.makeArray = makeArray;
exports.inspect = inspect;
exports.apply = apply;
exports.applyStr = applyStr;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

'REMOVE_USE_STRICT: true';

/**
@module ember-metal
*/

/**
  Previously we used `Ember.$.uuid`, however `$.uuid` has been removed from
  jQuery master. We'll just bootstrap our own uuid now.

  @private
  @return {Number} the uuid
*/
var _uuid = 0;

/**
  Generates a universally unique identifier. This method
  is used internally by Ember for assisting with
  the generation of GUID's and other unique identifiers
  such as `bind-attr` data attributes.

  @public
  @return {Number} [description]
 */

function uuid() {
  return ++_uuid;
}

/**
  Prefix used for guids through out Ember.
  @private
  @property GUID_PREFIX
  @for Ember
  @type String
  @final
*/
var GUID_PREFIX = 'ember';

// Used for guid generation...
var numberCache = [];
var stringCache = {};

/**
  Strongly hint runtimes to intern the provided string.

  When do I need to use this function?

  For the most part, never. Pre-mature optimization is bad, and often the
  runtime does exactly what you need it to, and more often the trade-off isn't
  worth it.

  Why?

  Runtimes store strings in at least 2 different representations:
  Ropes and Symbols (interned strings). The Rope provides a memory efficient
  data-structure for strings created from concatenation or some other string
  manipulation like splitting.

  Unfortunately checking equality of different ropes can be quite costly as
  runtimes must resort to clever string comparison algorithms. These
  algorithms typically cost in proportion to the length of the string.
  Luckily, this is where the Symbols (interned strings) shine. As Symbols are
  unique by their string content, equality checks can be done by pointer
  comparison.

  How do I know if my string is a rope or symbol?

  Typically (warning general sweeping statement, but truthy in runtimes at
  present) static strings created as part of the JS source are interned.
  Strings often used for comparisons can be interned at runtime if some
  criteria are met.  One of these criteria can be the size of the entire rope.
  For example, in chrome 38 a rope longer then 12 characters will not
  intern, nor will segments of that rope.

  Some numbers: http://jsperf.com/eval-vs-keys/8

  Known Trick™

  @private
  @return {String} interned version of the provided string
*/
function intern(str) {
  var obj = {};
  obj[str] = 1;
  for (var key in obj) {
    if (key === str) {
      return key;
    }
  }
  return str;
}

function symbol(debugName) {
  // TODO: Investigate using platform symbols, but we do not
  // want to require non-enumerability for this API, which
  // would introduce a large cost.

  return intern(debugName + ' [id=' + GUID_KEY + Math.floor(Math.random() * new Date()) + ']');
}

/**
  A unique key used to assign guids and other private metadata to objects.
  If you inspect an object in your browser debugger you will often see these.
  They can be safely ignored.

  On browsers that support it, these properties are added with enumeration
  disabled so they won't show up when you iterate over your properties.

  @private
  @property GUID_KEY
  @for Ember
  @type String
  @final
*/
var GUID_KEY = intern('__ember' + +new Date());

var GUID_DESC = {
  writable: true,
  configurable: true,
  enumerable: false,
  value: null
};

exports.GUID_DESC = GUID_DESC;
var undefinedDescriptor = {
  configurable: true,
  writable: true,
  enumerable: false,
  value: undefined
};

var nullDescriptor = {
  configurable: true,
  writable: true,
  enumerable: false,
  value: null
};

var META_DESC = {
  writable: true,
  configurable: true,
  enumerable: false,
  value: null
};

var EMBER_META_PROPERTY = {
  name: '__ember_meta__',
  descriptor: META_DESC
};

exports.EMBER_META_PROPERTY = EMBER_META_PROPERTY;
var GUID_KEY_PROPERTY = {
  name: GUID_KEY,
  descriptor: nullDescriptor
};

exports.GUID_KEY_PROPERTY = GUID_KEY_PROPERTY;
var NEXT_SUPER_PROPERTY = {
  name: '__nextSuper',
  descriptor: undefinedDescriptor
};

exports.NEXT_SUPER_PROPERTY = NEXT_SUPER_PROPERTY;
/**
  Generates a new guid, optionally saving the guid to the object that you
  pass in. You will rarely need to use this method. Instead you should
  call `Ember.guidFor(obj)`, which return an existing guid if available.

  @private
  @method generateGuid
  @for Ember
  @param {Object} [obj] Object the guid will be used for. If passed in, the guid will
    be saved on the object and reused whenever you pass the same object
    again.

    If no object is passed, just generate a new guid.
  @param {String} [prefix] Prefix to place in front of the guid. Useful when you want to
    separate the guid into separate namespaces.
  @return {String} the guid
*/

function generateGuid(obj, prefix) {
  if (!prefix) {
    prefix = GUID_PREFIX;
  }

  var ret = prefix + uuid();
  if (obj) {
    if (obj[GUID_KEY] === null) {
      obj[GUID_KEY] = ret;
    } else {
      GUID_DESC.value = ret;
      if (obj.__defineNonEnumerable) {
        obj.__defineNonEnumerable(GUID_KEY_PROPERTY);
      } else {
        Object.defineProperty(obj, GUID_KEY, GUID_DESC);
      }
    }
  }
  return ret;
}

/**
  Returns a unique id for the object. If the object does not yet have a guid,
  one will be assigned to it. You can call this on any object,
  `Ember.Object`-based or not, but be aware that it will add a `_guid`
  property.

  You can also use this method on DOM Element objects.

  @private
  @method guidFor
  @for Ember
  @param {Object} obj any object, string, number, Element, or primitive
  @return {String} the unique guid for this instance.
*/

function guidFor(obj) {

  // special cases where we don't want to add a key to object
  if (obj === undefined) {
    return '(undefined)';
  }

  if (obj === null) {
    return '(null)';
  }

  var ret;
  var type = typeof obj;

  // Don't allow prototype changes to String etc. to change the guidFor
  switch (type) {
    case 'number':
      ret = numberCache[obj];

      if (!ret) {
        ret = numberCache[obj] = 'nu' + obj;
      }

      return ret;

    case 'string':
      ret = stringCache[obj];

      if (!ret) {
        ret = stringCache[obj] = 'st' + uuid();
      }

      return ret;

    case 'boolean':
      return obj ? '(true)' : '(false)';

    default:
      if (obj[GUID_KEY]) {
        return obj[GUID_KEY];
      }

      if (obj === Object) {
        return '(Object)';
      }

      if (obj === Array) {
        return '(Array)';
      }

      ret = GUID_PREFIX + uuid();

      if (obj[GUID_KEY] === null) {
        obj[GUID_KEY] = ret;
      } else {
        GUID_DESC.value = ret;

        if (obj.__defineNonEnumerable) {
          obj.__defineNonEnumerable(GUID_KEY_PROPERTY);
        } else {
          Object.defineProperty(obj, GUID_KEY, GUID_DESC);
        }
      }
      return ret;
  }
}

// ..........................................................
// META
//
function Meta(obj) {
  this.watching = {};
  this.cache = undefined;
  this.cacheMeta = undefined;
  this.source = obj;
  this.deps = undefined;
  this.listeners = undefined;
  this.mixins = undefined;
  this.bindings = undefined;
  this.chains = undefined;
  this.values = undefined;
  this.proto = undefined;
}

Meta.prototype = {
  chainWatchers: null // FIXME
};

// Placeholder for non-writable metas.
var EMPTY_META = new Meta(null);

if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
  EMPTY_META.values = {};
}

/**
  Retrieves the meta hash for an object. If `writable` is true ensures the
  hash is writable for this object as well.

  The meta object contains information about computed property descriptors as
  well as any watched properties and other information. You generally will
  not access this information directly but instead work with higher level
  methods that manipulate this hash indirectly.

  @method meta
  @for Ember
  @private

  @param {Object} obj The object to retrieve meta for
  @param {Boolean} [writable=true] Pass `false` if you do not intend to modify
    the meta hash, allowing the method to avoid making an unnecessary copy.
  @return {Object} the meta hash for an object
*/
function meta(obj, writable) {
  var ret = obj.__ember_meta__;
  if (writable === false) {
    return ret || EMPTY_META;
  }

  if (!ret) {
    if (obj.__defineNonEnumerable) {
      obj.__defineNonEnumerable(EMBER_META_PROPERTY);
    } else {
      Object.defineProperty(obj, '__ember_meta__', META_DESC);
    }

    ret = new Meta(obj);

    if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
      ret.values = {};
    }

    obj.__ember_meta__ = ret;
  } else if (ret.source !== obj) {
    if (obj.__defineNonEnumerable) {
      obj.__defineNonEnumerable(EMBER_META_PROPERTY);
    } else {
      Object.defineProperty(obj, '__ember_meta__', META_DESC);
    }

    ret = Object.create(ret);
    ret.watching = Object.create(ret.watching);
    ret.cache = undefined;
    ret.cacheMeta = undefined;
    ret.source = obj;

    if ((0, _emberMetalFeatures2['default'])('mandatory-setter')) {
      ret.values = Object.create(ret.values);
    }

    obj['__ember_meta__'] = ret;
  }
  return ret;
}

function getMeta(obj, property) {
  var _meta = meta(obj, false);
  return _meta[property];
}

function setMeta(obj, property, value) {
  var _meta = meta(obj, true);
  _meta[property] = value;
  return value;
}

/**
  @deprecated
  @private

  In order to store defaults for a class, a prototype may need to create
  a default meta object, which will be inherited by any objects instantiated
  from the class's constructor.

  However, the properties of that meta object are only shallow-cloned,
  so if a property is a hash (like the event system's `listeners` hash),
  it will by default be shared across all instances of that class.

  This method allows extensions to deeply clone a series of nested hashes or
  other complex objects. For instance, the event system might pass
  `['listeners', 'foo:change', 'ember157']` to `prepareMetaPath`, which will
  walk down the keys provided.

  For each key, if the key does not exist, it is created. If it already
  exists and it was inherited from its constructor, the constructor's
  key is cloned.

  You can also pass false for `writable`, which will simply return
  undefined if `prepareMetaPath` discovers any part of the path that
  shared or undefined.

  @method metaPath
  @for Ember
  @param {Object} obj The object whose meta we are examining
  @param {Array} path An array of keys to walk down
  @param {Boolean} writable whether or not to create a new meta
    (or meta property) if one does not already exist or if it's
    shared with its constructor
*/

function metaPath(obj, path, writable) {
  _emberMetalCore2['default'].deprecate('Ember.metaPath is deprecated and will be removed from future releases.');
  var _meta = meta(obj, writable);
  var keyName, value;

  for (var i = 0, l = path.length; i < l; i++) {
    keyName = path[i];
    value = _meta[keyName];

    if (!value) {
      if (!writable) {
        return undefined;
      }
      value = _meta[keyName] = { __ember_source__: obj };
    } else if (value.__ember_source__ !== obj) {
      if (!writable) {
        return undefined;
      }
      value = _meta[keyName] = Object.create(value);
      value.__ember_source__ = obj;
    }

    _meta = value;
  }

  return value;
}

/**
  Wraps the passed function so that `this._super` will point to the superFunc
  when the function is invoked. This is the primitive we use to implement
  calls to super.

  @private
  @method wrap
  @for Ember
  @param {Function} func The function to call
  @param {Function} superFunc The super function.
  @return {Function} wrapped function.
*/

function wrap(func, superFunc) {
  function superWrapper() {
    var ret;
    var sup = this && this.__nextSuper;
    var length = arguments.length;

    if (this) {
      this.__nextSuper = superFunc;
    }

    if (length === 0) {
      ret = func.call(this);
    } else if (length === 1) {
      ret = func.call(this, arguments[0]);
    } else if (length === 2) {
      ret = func.call(this, arguments[0], arguments[1]);
    } else {
      var args = new Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = arguments[i];
      }
      ret = apply(this, func, args);
    }

    if (this) {
      this.__nextSuper = sup;
    }

    return ret;
  }

  superWrapper.wrappedFunction = func;
  superWrapper.__ember_observes__ = func.__ember_observes__;
  superWrapper.__ember_observesBefore__ = func.__ember_observesBefore__;
  superWrapper.__ember_listens__ = func.__ember_listens__;

  return superWrapper;
}

/**
  Checks to see if the `methodName` exists on the `obj`.

  ```javascript
  var foo = { bar: function() { return 'bar'; }, baz: null };

  Ember.canInvoke(foo, 'bar'); // true
  Ember.canInvoke(foo, 'baz'); // false
  Ember.canInvoke(foo, 'bat'); // false
  ```

  @method canInvoke
  @for Ember
  @param {Object} obj The object to check for the method
  @param {String} methodName The method name to check for
  @return {Boolean}
  @private
*/
function canInvoke(obj, methodName) {
  return !!(obj && typeof obj[methodName] === 'function');
}

/**
  Checks to see if the `methodName` exists on the `obj`,
  and if it does, invokes it with the arguments passed.

  ```javascript
  var d = new Date('03/15/2013');

  Ember.tryInvoke(d, 'getTime');              // 1363320000000
  Ember.tryInvoke(d, 'setFullYear', [2014]);  // 1394856000000
  Ember.tryInvoke(d, 'noSuchMethod', [2014]); // undefined
  ```

  @method tryInvoke
  @for Ember
  @param {Object} obj The object to check for the method
  @param {String} methodName The method name to check for
  @param {Array} [args] The arguments to pass to the method
  @return {*} the return value of the invoked method or undefined if it cannot be invoked
  @public
*/

function tryInvoke(obj, methodName, args) {
  if (canInvoke(obj, methodName)) {
    return args ? applyStr(obj, methodName, args) : applyStr(obj, methodName);
  }
}

// ........................................
// TYPING & ARRAY MESSAGING
//

var toString = Object.prototype.toString;

/**
  Forces the passed object to be part of an array. If the object is already
  an array, it will return the object. Otherwise, it will add the object to
  an array. If obj is `null` or `undefined`, it will return an empty array.

  ```javascript
  Ember.makeArray();            // []
  Ember.makeArray(null);        // []
  Ember.makeArray(undefined);   // []
  Ember.makeArray('lindsay');   // ['lindsay']
  Ember.makeArray([1, 2, 42]);  // [1, 2, 42]

  var controller = Ember.ArrayProxy.create({ content: [] });

  Ember.makeArray(controller) === controller;  // true
  ```

  @method makeArray
  @for Ember
  @param {Object} obj the object
  @return {Array}
  @private
*/

function makeArray(obj) {
  if (obj === null || obj === undefined) {
    return [];
  }
  return Array.isArray(obj) ? obj : [obj];
}

/**
  Convenience method to inspect an object. This method will attempt to
  convert the object into a useful string description.

  It is a pretty simple implementation. If you want something more robust,
  use something like JSDump: https://github.com/NV/jsDump

  @method inspect
  @for Ember
  @param {Object} obj The object you want to inspect.
  @return {String} A description of the object
  @since 1.4.0
  @private
*/

function inspect(obj) {
  if (obj === null) {
    return 'null';
  }
  if (obj === undefined) {
    return 'undefined';
  }
  if (Array.isArray(obj)) {
    return '[' + obj + ']';
  }
  // for non objects
  var type = typeof obj;
  if (type !== 'object' && type !== 'symbol') {
    return '' + obj;
  }
  // overridden toString
  if (typeof obj.toString === 'function' && obj.toString !== toString) {
    return obj.toString();
  }

  // Object.prototype.toString === {}.toString
  var v;
  var ret = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      v = obj[key];
      if (v === 'toString') {
        continue;
      } // ignore useless items
      if (typeof v === 'function') {
        v = 'function() { ... }';
      }

      if (v && typeof v.toString !== 'function') {
        ret.push(key + ': ' + toString.call(v));
      } else {
        ret.push(key + ': ' + v);
      }
    }
  }
  return '{' + ret.join(', ') + '}';
}

// The following functions are intentionally minified to keep the functions
// below Chrome's function body size inlining limit of 600 chars.
/**
  @param {Object} t target
  @param {Function} m method
  @param {Array} a args
  @private
*/

function apply(t, m, a) {
  var l = a && a.length;
  if (!a || !l) {
    return m.call(t);
  }
  switch (l) {
    case 1:
      return m.call(t, a[0]);
    case 2:
      return m.call(t, a[0], a[1]);
    case 3:
      return m.call(t, a[0], a[1], a[2]);
    case 4:
      return m.call(t, a[0], a[1], a[2], a[3]);
    case 5:
      return m.call(t, a[0], a[1], a[2], a[3], a[4]);
    default:
      return m.apply(t, a);
  }
}

/**
  @param {Object} t target
  @param {String} m method
  @param {Array} a args
  @private
*/

function applyStr(t, m, a) {
  var l = a && a.length;
  if (!a || !l) {
    return t[m]();
  }
  switch (l) {
    case 1:
      return t[m](a[0]);
    case 2:
      return t[m](a[0], a[1]);
    case 3:
      return t[m](a[0], a[1], a[2]);
    case 4:
      return t[m](a[0], a[1], a[2], a[3]);
    case 5:
      return t[m](a[0], a[1], a[2], a[3], a[4]);
    default:
      return t[m].apply(t, a);
  }
}

exports.GUID_KEY = GUID_KEY;
exports.META_DESC = META_DESC;
exports.EMPTY_META = EMPTY_META;
exports.meta = meta;
exports.makeArray = makeArray;
exports.canInvoke = canInvoke;