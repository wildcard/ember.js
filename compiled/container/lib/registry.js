'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalDictionary = require('ember-metal/dictionary');

var _emberMetalDictionary2 = _interopRequireDefault(_emberMetalDictionary);

var _emberMetalMerge = require('ember-metal/merge');

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

var VALID_FULL_NAME_REGEXP = /^[^:]+.+:[^:]+$/;

var instanceInitializersFeatureEnabled;
if ((0, _emberMetalFeatures2['default'])('ember-application-instance-initializers')) {
  instanceInitializersFeatureEnabled = true;
}

/**
 A registry used to store factory and option information keyed
 by type.

 A `Registry` stores the factory and option information needed by a
 `Container` to instantiate and cache objects.

 The public API for `Registry` is still in flux and should not be considered
 stable.

 @private
 @class Registry
 @since 1.11.0
*/
function Registry(options) {
  this.fallback = options && options.fallback ? options.fallback : null;

  this.resolver = options && options.resolver ? options.resolver : function () {};

  this.registrations = (0, _emberMetalDictionary2['default'])(options && options.registrations ? options.registrations : null);

  this._typeInjections = (0, _emberMetalDictionary2['default'])(null);
  this._injections = (0, _emberMetalDictionary2['default'])(null);
  this._factoryTypeInjections = (0, _emberMetalDictionary2['default'])(null);
  this._factoryInjections = (0, _emberMetalDictionary2['default'])(null);

  this._normalizeCache = (0, _emberMetalDictionary2['default'])(null);
  this._resolveCache = (0, _emberMetalDictionary2['default'])(null);
  this._failCache = (0, _emberMetalDictionary2['default'])(null);

  this._options = (0, _emberMetalDictionary2['default'])(null);
  this._typeOptions = (0, _emberMetalDictionary2['default'])(null);
}

Registry.prototype = {
  /**
   A backup registry for resolving registrations when no matches can be found.
     @private
   @property fallback
   @type Registry
   */
  fallback: null,

  /**
   @private
   @property resolver
   @type function
   */
  resolver: null,

  /**
   @private
   @property registrations
   @type InheritingDict
   */
  registrations: null,

  /**
   @private
     @property _typeInjections
   @type InheritingDict
   */
  _typeInjections: null,

  /**
   @private
     @property _injections
   @type InheritingDict
   */
  _injections: null,

  /**
   @private
     @property _factoryTypeInjections
   @type InheritingDict
   */
  _factoryTypeInjections: null,

  /**
   @private
     @property _factoryInjections
   @type InheritingDict
   */
  _factoryInjections: null,

  /**
   @private
     @property _normalizeCache
   @type InheritingDict
   */
  _normalizeCache: null,

  /**
   @private
     @property _resolveCache
   @type InheritingDict
   */
  _resolveCache: null,

  /**
   @private
     @property _options
   @type InheritingDict
   */
  _options: null,

  /**
   @private
     @property _typeOptions
   @type InheritingDict
   */
  _typeOptions: null,

  /**
   The first container created for this registry.
     This allows deprecated access to `lookup` and `lookupFactory` to avoid
   breaking compatibility for Ember 1.x initializers.
     @private
   @property _defaultContainer
   @type Container
   */
  _defaultContainer: null,

  /**
   Creates a container based on this registry.
     @private
   @method container
   @param {Object} options
   @return {Container} created container
   */
  container: function container(options) {
    var container = new _container2['default'](this, options);

    // 2.0TODO - remove `registerContainer`
    this.registerContainer(container);

    return container;
  },

  /**
   Register the first container created for a registery to allow deprecated
   access to its `lookup` and `lookupFactory` methods to avoid breaking
   compatibility for Ember 1.x initializers.
     2.0TODO: Remove this method. The bookkeeping is only needed to support
            deprecated behavior.
     @private
   @param {Container} newly created container
   */
  registerContainer: function registerContainer(container) {
    if (!this._defaultContainer) {
      this._defaultContainer = container;
    }
    if (this.fallback) {
      this.fallback.registerContainer(container);
    }
  },

  lookup: function lookup(fullName, options) {
    _emberMetalCore2['default'].assert('Create a container on the registry (with `registry.container()`) before calling `lookup`.', this._defaultContainer);

    if (instanceInitializersFeatureEnabled) {
      _emberMetalCore2['default'].deprecate('`lookup` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container.', false, { url: 'http://emberjs.com/guides/deprecations#toc_deprecate-access-to-instances-in-initializers' });
    }

    return this._defaultContainer.lookup(fullName, options);
  },

  lookupFactory: function lookupFactory(fullName) {
    _emberMetalCore2['default'].assert('Create a container on the registry (with `registry.container()`) before calling `lookupFactory`.', this._defaultContainer);

    if (instanceInitializersFeatureEnabled) {
      _emberMetalCore2['default'].deprecate('`lookupFactory` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container.', false, { url: 'http://emberjs.com/guides/deprecations#toc_deprecate-access-to-instances-in-initializers' });
    }

    return this._defaultContainer.lookupFactory(fullName);
  },

  /**
   Registers a factory for later injection.
     Example:
     ```javascript
   var registry = new Registry();
     registry.register('model:user', Person, {singleton: false });
   registry.register('fruit:favorite', Orange);
   registry.register('communication:main', Email, {singleton: false});
   ```
     @private
   @method register
   @param {String} fullName
   @param {Function} factory
   @param {Object} options
   */
  register: function register(fullName, factory, options) {
    _emberMetalCore2['default'].assert('fullName must be a proper full name', this.validateFullName(fullName));

    if (factory === undefined) {
      throw new TypeError('Attempting to register an unknown factory: `' + fullName + '`');
    }

    var normalizedName = this.normalize(fullName);

    if (this._resolveCache[normalizedName]) {
      throw new Error('Cannot re-register: `' + fullName + '`, as it has already been resolved.');
    }

    delete this._failCache[normalizedName];
    this.registrations[normalizedName] = factory;
    this._options[normalizedName] = options || {};
  },

  /**
   Unregister a fullName
     ```javascript
   var registry = new Registry();
   registry.register('model:user', User);
     registry.resolve('model:user').create() instanceof User //=> true
     registry.unregister('model:user')
   registry.resolve('model:user') === undefined //=> true
   ```
     @private
   @method unregister
   @param {String} fullName
   */
  unregister: function unregister(fullName) {
    _emberMetalCore2['default'].assert('fullName must be a proper full name', this.validateFullName(fullName));

    var normalizedName = this.normalize(fullName);

    delete this.registrations[normalizedName];
    delete this._resolveCache[normalizedName];
    delete this._failCache[normalizedName];
    delete this._options[normalizedName];
  },

  /**
   Given a fullName return the corresponding factory.
     By default `resolve` will retrieve the factory from
   the registry.
     ```javascript
   var registry = new Registry();
   registry.register('api:twitter', Twitter);
     registry.resolve('api:twitter') // => Twitter
   ```
     Optionally the registry can be provided with a custom resolver.
   If provided, `resolve` will first provide the custom resolver
   the opportunity to resolve the fullName, otherwise it will fallback
   to the registry.
     ```javascript
   var registry = new Registry();
   registry.resolver = function(fullName) {
      // lookup via the module system of choice
    };
     // the twitter factory is added to the module system
   registry.resolve('api:twitter') // => Twitter
   ```
     @private
   @method resolve
   @param {String} fullName
   @return {Function} fullName's factory
   */
  resolve: (function (_resolve) {
    function resolve(_x) {
      return _resolve.apply(this, arguments);
    }

    resolve.toString = function () {
      return _resolve.toString();
    };

    return resolve;
  })(function (fullName) {
    _emberMetalCore2['default'].assert('fullName must be a proper full name', this.validateFullName(fullName));
    var factory = resolve(this, this.normalize(fullName));
    if (factory === undefined && this.fallback) {
      factory = this.fallback.resolve(fullName);
    }
    return factory;
  }),

  /**
   A hook that can be used to describe how the resolver will
   attempt to find the factory.
     For example, the default Ember `.describe` returns the full
   class name (including namespace) where Ember's resolver expects
   to find the `fullName`.
     @private
   @method describe
   @param {String} fullName
   @return {string} described fullName
   */
  describe: function describe(fullName) {
    return fullName;
  },

  /**
   A hook to enable custom fullName normalization behaviour
     @private
   @method normalizeFullName
   @param {String} fullName
   @return {string} normalized fullName
   */
  normalizeFullName: function normalizeFullName(fullName) {
    return fullName;
  },

  /**
   normalize a fullName based on the applications conventions
     @private
   @method normalize
   @param {String} fullName
   @return {string} normalized fullName
   */
  normalize: function normalize(fullName) {
    return this._normalizeCache[fullName] || (this._normalizeCache[fullName] = this.normalizeFullName(fullName));
  },

  /**
   @method makeToString
     @private
   @param {any} factory
   @param {string} fullName
   @return {function} toString function
   */
  makeToString: function makeToString(factory, fullName) {
    return factory.toString();
  },

  /**
   Given a fullName check if the container is aware of its factory
   or singleton instance.
     @private
   @method has
   @param {String} fullName
   @return {Boolean}
   */
  has: (function (_has) {
    function has(_x2) {
      return _has.apply(this, arguments);
    }

    has.toString = function () {
      return _has.toString();
    };

    return has;
  })(function (fullName) {
    _emberMetalCore2['default'].assert('fullName must be a proper full name', this.validateFullName(fullName));
    return has(this, this.normalize(fullName));
  }),

  /**
   Allow registering options for all factories of a type.
     ```javascript
   var registry = new Registry();
   var container = registry.container();
     // if all of type `connection` must not be singletons
   registry.optionsForType('connection', { singleton: false });
     registry.register('connection:twitter', TwitterConnection);
   registry.register('connection:facebook', FacebookConnection);
     var twitter = container.lookup('connection:twitter');
   var twitter2 = container.lookup('connection:twitter');
     twitter === twitter2; // => false
     var facebook = container.lookup('connection:facebook');
   var facebook2 = container.lookup('connection:facebook');
     facebook === facebook2; // => false
   ```
     @private
   @method optionsForType
   @param {String} type
   @param {Object} options
   */
  optionsForType: function optionsForType(type, options) {
    this._typeOptions[type] = options;
  },

  getOptionsForType: function getOptionsForType(type) {
    var optionsForType = this._typeOptions[type];
    if (optionsForType === undefined && this.fallback) {
      optionsForType = this.fallback.getOptionsForType(type);
    }
    return optionsForType;
  },

  /**
   @private
   @method options
   @param {String} fullName
   @param {Object} options
   */
  options: function options(fullName, _options) {
    _options = _options || {};
    var normalizedName = this.normalize(fullName);
    this._options[normalizedName] = _options;
  },

  getOptions: function getOptions(fullName) {
    var normalizedName = this.normalize(fullName);
    var options = this._options[normalizedName];
    if (options === undefined && this.fallback) {
      options = this.fallback.getOptions(fullName);
    }
    return options;
  },

  getOption: function getOption(fullName, optionName) {
    var options = this._options[fullName];

    if (options && options[optionName] !== undefined) {
      return options[optionName];
    }

    var type = fullName.split(':')[0];
    options = this._typeOptions[type];

    if (options && options[optionName] !== undefined) {
      return options[optionName];
    } else if (this.fallback) {
      return this.fallback.getOption(fullName, optionName);
    }
  },

  option: function option(fullName, optionName) {
    _emberMetalCore2['default'].deprecate('`Registry.option()` has been deprecated. Call `Registry.getOption()` instead.');
    return this.getOption(fullName, optionName);
  },

  /**
   Used only via `injection`.
     Provides a specialized form of injection, specifically enabling
   all objects of one type to be injected with a reference to another
   object.
     For example, provided each object of type `controller` needed a `router`.
   one would do the following:
     ```javascript
   var registry = new Registry();
   var container = registry.container();
     registry.register('router:main', Router);
   registry.register('controller:user', UserController);
   registry.register('controller:post', PostController);
     registry.typeInjection('controller', 'router', 'router:main');
     var user = container.lookup('controller:user');
   var post = container.lookup('controller:post');
     user.router instanceof Router; //=> true
   post.router instanceof Router; //=> true
     // both controllers share the same router
   user.router === post.router; //=> true
   ```
     @private
   @method typeInjection
   @param {String} type
   @param {String} property
   @param {String} fullName
   */
  typeInjection: function typeInjection(type, property, fullName) {
    _emberMetalCore2['default'].assert('fullName must be a proper full name', this.validateFullName(fullName));

    var fullNameType = fullName.split(':')[0];
    if (fullNameType === type) {
      throw new Error('Cannot inject a `' + fullName + '` on other ' + type + '(s).');
    }

    var injections = this._typeInjections[type] || (this._typeInjections[type] = []);

    injections.push({
      property: property,
      fullName: fullName
    });
  },

  /**
   Defines injection rules.
     These rules are used to inject dependencies onto objects when they
   are instantiated.
     Two forms of injections are possible:
     * Injecting one fullName on another fullName
   * Injecting one fullName on a type
     Example:
     ```javascript
   var registry = new Registry();
   var container = registry.container();
     registry.register('source:main', Source);
   registry.register('model:user', User);
   registry.register('model:post', Post);
     // injecting one fullName on another fullName
   // eg. each user model gets a post model
   registry.injection('model:user', 'post', 'model:post');
     // injecting one fullName on another type
   registry.injection('model', 'source', 'source:main');
     var user = container.lookup('model:user');
   var post = container.lookup('model:post');
     user.source instanceof Source; //=> true
   post.source instanceof Source; //=> true
     user.post instanceof Post; //=> true
     // and both models share the same source
   user.source === post.source; //=> true
   ```
     @private
   @method injection
   @param {String} factoryName
   @param {String} property
   @param {String} injectionName
   */
  injection: function injection(fullName, property, injectionName) {
    this.validateFullName(injectionName);
    var normalizedInjectionName = this.normalize(injectionName);

    if (fullName.indexOf(':') === -1) {
      return this.typeInjection(fullName, property, normalizedInjectionName);
    }

    _emberMetalCore2['default'].assert('fullName must be a proper full name', this.validateFullName(fullName));
    var normalizedName = this.normalize(fullName);

    var injections = this._injections[normalizedName] || (this._injections[normalizedName] = []);

    injections.push({
      property: property,
      fullName: normalizedInjectionName
    });
  },

  /**
   Used only via `factoryInjection`.
     Provides a specialized form of injection, specifically enabling
   all factory of one type to be injected with a reference to another
   object.
     For example, provided each factory of type `model` needed a `store`.
   one would do the following:
     ```javascript
   var registry = new Registry();
     registry.register('store:main', SomeStore);
     registry.factoryTypeInjection('model', 'store', 'store:main');
     var store = registry.lookup('store:main');
   var UserFactory = registry.lookupFactory('model:user');
     UserFactory.store instanceof SomeStore; //=> true
   ```
     @private
   @method factoryTypeInjection
   @param {String} type
   @param {String} property
   @param {String} fullName
   */
  factoryTypeInjection: function factoryTypeInjection(type, property, fullName) {
    var injections = this._factoryTypeInjections[type] || (this._factoryTypeInjections[type] = []);

    injections.push({
      property: property,
      fullName: this.normalize(fullName)
    });
  },

  /**
   Defines factory injection rules.
     Similar to regular injection rules, but are run against factories, via
   `Registry#lookupFactory`.
     These rules are used to inject objects onto factories when they
   are looked up.
     Two forms of injections are possible:
     * Injecting one fullName on another fullName
   * Injecting one fullName on a type
     Example:
     ```javascript
   var registry = new Registry();
   var container = registry.container();
     registry.register('store:main', Store);
   registry.register('store:secondary', OtherStore);
   registry.register('model:user', User);
   registry.register('model:post', Post);
     // injecting one fullName on another type
   registry.factoryInjection('model', 'store', 'store:main');
     // injecting one fullName on another fullName
   registry.factoryInjection('model:post', 'secondaryStore', 'store:secondary');
     var UserFactory = container.lookupFactory('model:user');
   var PostFactory = container.lookupFactory('model:post');
   var store = container.lookup('store:main');
     UserFactory.store instanceof Store; //=> true
   UserFactory.secondaryStore instanceof OtherStore; //=> false
     PostFactory.store instanceof Store; //=> true
   PostFactory.secondaryStore instanceof OtherStore; //=> true
     // and both models share the same source instance
   UserFactory.store === PostFactory.store; //=> true
   ```
     @private
   @method factoryInjection
   @param {String} factoryName
   @param {String} property
   @param {String} injectionName
   */
  factoryInjection: function factoryInjection(fullName, property, injectionName) {
    var normalizedName = this.normalize(fullName);
    var normalizedInjectionName = this.normalize(injectionName);

    this.validateFullName(injectionName);

    if (fullName.indexOf(':') === -1) {
      return this.factoryTypeInjection(normalizedName, property, normalizedInjectionName);
    }

    var injections = this._factoryInjections[normalizedName] || (this._factoryInjections[normalizedName] = []);

    injections.push({
      property: property,
      fullName: normalizedInjectionName
    });
  },

  /**
   @method knownForType
   @param {String} type the type to iterate over
   @private
  */
  knownForType: function knownForType(type) {
    var fallbackKnown = undefined,
        resolverKnown = undefined;

    var localKnown = (0, _emberMetalDictionary2['default'])(null);
    var registeredNames = Object.keys(this.registrations);
    for (var index = 0, _length = registeredNames.length; index < _length; index++) {
      var fullName = registeredNames[index];
      var itemType = fullName.split(':')[0];

      if (itemType === type) {
        localKnown[fullName] = true;
      }
    }

    if (this.fallback) {
      fallbackKnown = this.fallback.knownForType(type);
    }

    if (this.resolver.knownForType) {
      resolverKnown = this.resolver.knownForType(type);
    }

    return (0, _emberMetalMerge.assign)({}, fallbackKnown, localKnown, resolverKnown);
  },

  validateFullName: function validateFullName(fullName) {
    if (!VALID_FULL_NAME_REGEXP.test(fullName)) {
      throw new TypeError('Invalid Fullname, expected: `type:name` got: ' + fullName);
    }
    return true;
  },

  validateInjections: function validateInjections(injections) {
    if (!injections) {
      return;
    }

    var fullName;

    for (var i = 0, length = injections.length; i < length; i++) {
      fullName = injections[i].fullName;

      if (!this.has(fullName)) {
        throw new Error('Attempting to inject an unknown injection: `' + fullName + '`');
      }
    }
  },

  normalizeInjectionsHash: function normalizeInjectionsHash(hash) {
    var injections = [];

    for (var key in hash) {
      if (hash.hasOwnProperty(key)) {
        _emberMetalCore2['default'].assert('Expected a proper full name, given \'' + hash[key] + '\'', this.validateFullName(hash[key]));

        injections.push({
          property: key,
          fullName: hash[key]
        });
      }
    }

    return injections;
  },

  getInjections: function getInjections(fullName) {
    var injections = this._injections[fullName] || [];
    if (this.fallback) {
      injections = injections.concat(this.fallback.getInjections(fullName));
    }
    return injections;
  },

  getTypeInjections: function getTypeInjections(type) {
    var injections = this._typeInjections[type] || [];
    if (this.fallback) {
      injections = injections.concat(this.fallback.getTypeInjections(type));
    }
    return injections;
  },

  getFactoryInjections: function getFactoryInjections(fullName) {
    var injections = this._factoryInjections[fullName] || [];
    if (this.fallback) {
      injections = injections.concat(this.fallback.getFactoryInjections(fullName));
    }
    return injections;
  },

  getFactoryTypeInjections: function getFactoryTypeInjections(type) {
    var injections = this._factoryTypeInjections[type] || [];
    if (this.fallback) {
      injections = injections.concat(this.fallback.getFactoryTypeInjections(type));
    }
    return injections;
  }
};

function resolve(registry, normalizedName) {
  var cached = registry._resolveCache[normalizedName];
  if (cached) {
    return cached;
  }
  if (registry._failCache[normalizedName]) {
    return;
  }

  var resolved = registry.resolver(normalizedName) || registry.registrations[normalizedName];

  if (resolved) {
    registry._resolveCache[normalizedName] = resolved;
  } else {
    registry._failCache[normalizedName] = true;
  }

  return resolved;
}

function has(registry, fullName) {
  return registry.resolve(fullName) !== undefined;
}

exports['default'] = Registry;
module.exports = exports['default'];