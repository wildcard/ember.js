/**
@module ember
@submodule ember-application
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dagMap = require('dag-map');

var _dagMap2 = _interopRequireDefault(_dagMap);

var _containerRegistry = require('container/registry');

var _containerRegistry2 = _interopRequireDefault(_containerRegistry);

var _emberMetal = require('ember-metal');

var _emberMetal2 = _interopRequireDefault(_emberMetal);

// Ember.deprecate, Ember.assert, Ember.libraries, LOG_VERSION, Namespace, BOOTED

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberMetalProperty_set = require('ember-metal/property_set');

var _emberRuntimeSystemLazy_load = require('ember-runtime/system/lazy_load');

var _emberRuntimeSystemNamespace = require('ember-runtime/system/namespace');

var _emberRuntimeSystemNamespace2 = _interopRequireDefault(_emberRuntimeSystemNamespace);

var _emberApplicationSystemResolver = require('ember-application/system/resolver');

var _emberApplicationSystemResolver2 = _interopRequireDefault(_emberApplicationSystemResolver);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberMetalUtils = require('ember-metal/utils');

var _emberRuntimeControllersController = require('ember-runtime/controllers/controller');

var _emberRuntimeControllersController2 = _interopRequireDefault(_emberRuntimeControllersController);

var _emberRuntimeControllersObject_controller = require('ember-runtime/controllers/object_controller');

var _emberRuntimeControllersObject_controller2 = _interopRequireDefault(_emberRuntimeControllersObject_controller);

var _emberRuntimeControllersArray_controller = require('ember-runtime/controllers/array_controller');

var _emberRuntimeControllersArray_controller2 = _interopRequireDefault(_emberRuntimeControllersArray_controller);

var _emberMetalViewsRenderer = require('ember-metal-views/renderer');

var _emberMetalViewsRenderer2 = _interopRequireDefault(_emberMetalViewsRenderer);

var _emberHtmlbarsSystemDomHelper = require('ember-htmlbars/system/dom-helper');

var _emberHtmlbarsSystemDomHelper2 = _interopRequireDefault(_emberHtmlbarsSystemDomHelper);

var _emberViewsViewsSelect = require('ember-views/views/select');

var _emberViewsViewsSelect2 = _interopRequireDefault(_emberViewsViewsSelect);

var _emberRoutingViewsViewsOutlet = require('ember-routing-views/views/outlet');

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsSystemEvent_dispatcher = require('ember-views/system/event_dispatcher');

var _emberViewsSystemEvent_dispatcher2 = _interopRequireDefault(_emberViewsSystemEvent_dispatcher);

var _emberViewsSystemJquery = require('ember-views/system/jquery');

var _emberViewsSystemJquery2 = _interopRequireDefault(_emberViewsSystemJquery);

var _emberRoutingSystemRoute = require('ember-routing/system/route');

var _emberRoutingSystemRoute2 = _interopRequireDefault(_emberRoutingSystemRoute);

var _emberRoutingSystemRouter = require('ember-routing/system/router');

var _emberRoutingSystemRouter2 = _interopRequireDefault(_emberRoutingSystemRouter);

var _emberRoutingLocationHash_location = require('ember-routing/location/hash_location');

var _emberRoutingLocationHash_location2 = _interopRequireDefault(_emberRoutingLocationHash_location);

var _emberRoutingLocationHistory_location = require('ember-routing/location/history_location');

var _emberRoutingLocationHistory_location2 = _interopRequireDefault(_emberRoutingLocationHistory_location);

var _emberRoutingLocationAuto_location = require('ember-routing/location/auto_location');

var _emberRoutingLocationAuto_location2 = _interopRequireDefault(_emberRoutingLocationAuto_location);

var _emberRoutingLocationNone_location = require('ember-routing/location/none_location');

var _emberRoutingLocationNone_location2 = _interopRequireDefault(_emberRoutingLocationNone_location);

var _emberRoutingSystemCache = require('ember-routing/system/cache');

var _emberRoutingSystemCache2 = _interopRequireDefault(_emberRoutingSystemCache);

var _emberApplicationSystemApplicationInstance = require('ember-application/system/application-instance');

var _emberApplicationSystemApplicationInstance2 = _interopRequireDefault(_emberApplicationSystemApplicationInstance);

var _emberViewsViewsText_field = require('ember-views/views/text_field');

var _emberViewsViewsText_field2 = _interopRequireDefault(_emberViewsViewsText_field);

var _emberViewsViewsText_area = require('ember-views/views/text_area');

var _emberViewsViewsText_area2 = _interopRequireDefault(_emberViewsViewsText_area);

var _emberViewsViewsCheckbox = require('ember-views/views/checkbox');

var _emberViewsViewsCheckbox2 = _interopRequireDefault(_emberViewsViewsCheckbox);

var _emberViewsViewsLegacy_each_view = require('ember-views/views/legacy_each_view');

var _emberViewsViewsLegacy_each_view2 = _interopRequireDefault(_emberViewsViewsLegacy_each_view);

var _emberRoutingViewsViewsLink = require('ember-routing-views/views/link');

var _emberRoutingViewsViewsLink2 = _interopRequireDefault(_emberRoutingViewsViewsLink);

var _emberRoutingServicesRouting = require('ember-routing/services/routing');

var _emberRoutingServicesRouting2 = _interopRequireDefault(_emberRoutingServicesRouting);

var _emberExtensionSupportContainer_debug_adapter = require('ember-extension-support/container_debug_adapter');

var _emberExtensionSupportContainer_debug_adapter2 = _interopRequireDefault(_emberExtensionSupportContainer_debug_adapter);

var _emberMetalEnvironment = require('ember-metal/environment');

var _emberMetalEnvironment2 = _interopRequireDefault(_emberMetalEnvironment);

function props(obj) {
  var properties = [];

  for (var key in obj) {
    properties.push(key);
  }

  return properties;
}

var librariesRegistered = false;

/**
  An instance of `Ember.Application` is the starting point for every Ember
  application. It helps to instantiate, initialize and coordinate the many
  objects that make up your app.

  Each Ember app has one and only one `Ember.Application` object. In fact, the
  very first thing you should do in your application is create the instance:

  ```javascript
  window.App = Ember.Application.create();
  ```

  Typically, the application object is the only global variable. All other
  classes in your app should be properties on the `Ember.Application` instance,
  which highlights its first role: a global namespace.

  For example, if you define a view class, it might look like this:

  ```javascript
  App.MyView = Ember.View.extend();
  ```

  By default, calling `Ember.Application.create()` will automatically initialize
  your application by calling the `Ember.Application.initialize()` method. If
  you need to delay initialization, you can call your app's `deferReadiness()`
  method. When you are ready for your app to be initialized, call its
  `advanceReadiness()` method.

  You can define a `ready` method on the `Ember.Application` instance, which
  will be run by Ember when the application is initialized.

  Because `Ember.Application` inherits from `Ember.Namespace`, any classes
  you create will have useful string representations when calling `toString()`.
  See the `Ember.Namespace` documentation for more information.

  While you can think of your `Ember.Application` as a container that holds the
  other classes in your application, there are several other responsibilities
  going on under-the-hood that you may want to understand.

  ### Event Delegation

  Ember uses a technique called _event delegation_. This allows the framework
  to set up a global, shared event listener instead of requiring each view to
  do it manually. For example, instead of each view registering its own
  `mousedown` listener on its associated element, Ember sets up a `mousedown`
  listener on the `body`.

  If a `mousedown` event occurs, Ember will look at the target of the event and
  start walking up the DOM node tree, finding corresponding views and invoking
  their `mouseDown` method as it goes.

  `Ember.Application` has a number of default events that it listens for, as
  well as a mapping from lowercase events to camel-cased view method names. For
  example, the `keypress` event causes the `keyPress` method on the view to be
  called, the `dblclick` event causes `doubleClick` to be called, and so on.

  If there is a bubbling browser event that Ember does not listen for by
  default, you can specify custom events and their corresponding view method
  names by setting the application's `customEvents` property:

  ```javascript
  var App = Ember.Application.create({
    customEvents: {
      // add support for the paste event
      paste: 'paste'
    }
  });
  ```

  By default, the application sets up these event listeners on the document
  body. However, in cases where you are embedding an Ember application inside
  an existing page, you may want it to set up the listeners on an element
  inside the body.

  For example, if only events inside a DOM element with the ID of `ember-app`
  should be delegated, set your application's `rootElement` property:

  ```javascript
  var App = Ember.Application.create({
    rootElement: '#ember-app'
  });
  ```

  The `rootElement` can be either a DOM element or a jQuery-compatible selector
  string. Note that *views appended to the DOM outside the root element will
  not receive events.* If you specify a custom root element, make sure you only
  append views inside it!

  To learn more about the advantages of event delegation and the Ember view
  layer, and a list of the event listeners that are setup by default, visit the
  [Ember View Layer guide](http://emberjs.com/guides/understanding-ember/the-view-layer/#toc_event-delegation).

  ### Initializers

  Libraries on top of Ember can add initializers, like so:

  ```javascript
  Ember.Application.initializer({
    name: 'api-adapter',

    initialize: function(container, application) {
      application.register('api-adapter:main', ApiAdapter);
    }
  });
  ```

  Initializers provide an opportunity to access the container, which
  organizes the different components of an Ember application. Additionally
  they provide a chance to access the instantiated application. Beyond
  being used for libraries, initializers are also a great way to organize
  dependency injection or setup in your own application.

  ### Routing

  In addition to creating your application's router, `Ember.Application` is
  also responsible for telling the router when to start routing. Transitions
  between routes can be logged with the `LOG_TRANSITIONS` flag, and more
  detailed intra-transition logging can be logged with
  the `LOG_TRANSITIONS_INTERNAL` flag:

  ```javascript
  var App = Ember.Application.create({
    LOG_TRANSITIONS: true, // basic logging of successful transitions
    LOG_TRANSITIONS_INTERNAL: true // detailed logging of all routing steps
  });
  ```

  By default, the router will begin trying to translate the current URL into
  application state once the browser emits the `DOMContentReady` event. If you
  need to defer routing, you can call the application's `deferReadiness()`
  method. Once routing can begin, call the `advanceReadiness()` method.

  If there is any setup required before routing begins, you can implement a
  `ready()` method on your app that will be invoked immediately before routing
  begins.

  @class Application
  @namespace Ember
  @extends Ember.Namespace
  @public
*/

var Application = _emberRuntimeSystemNamespace2['default'].extend({
  _suppressDeferredDeprecation: true,

  /**
    The root DOM element of the Application. This can be specified as an
    element or a
    [jQuery-compatible selector string](http://api.jquery.com/category/selectors/).
      This is the element that will be passed to the Application's,
    `eventDispatcher`, which sets up the listeners for event delegation. Every
    view in your application should be a child of the element you specify here.
      @property rootElement
    @type DOMElement
    @default 'body'
    @public
  */
  rootElement: 'body',

  /**
    The `Ember.EventDispatcher` responsible for delegating events to this
    application's views.
      The event dispatcher is created by the application at initialization time
    and sets up event listeners on the DOM element described by the
    application's `rootElement` property.
      See the documentation for `Ember.EventDispatcher` for more information.
      @property eventDispatcher
    @type Ember.EventDispatcher
    @default null
    @public
  */
  eventDispatcher: null,

  /**
    The DOM events for which the event dispatcher should listen.
      By default, the application's `Ember.EventDispatcher` listens
    for a set of standard DOM events, such as `mousedown` and
    `keyup`, and delegates them to your application's `Ember.View`
    instances.
      If you would like additional bubbling events to be delegated to your
    views, set your `Ember.Application`'s `customEvents` property
    to a hash containing the DOM event name as the key and the
    corresponding view method name as the value. For example:
      ```javascript
    var App = Ember.Application.create({
      customEvents: {
        // add support for the paste event
        paste: 'paste'
      }
    });
    ```
      @property customEvents
    @type Object
    @default null
    @public
  */
  customEvents: null,

  /**
    Whether the application should automatically start routing and render
    templates to the `rootElement` on DOM ready. While default by true,
    other environments such as FastBoot or a testing harness can set this
    property to `false` and control the precise timing and behavior of the boot
    process.
      @property autoboot
    @type Boolean
    @default true
    @private
  */
  autoboot: true,

  init: function init() {
    this._super.apply(this, arguments);

    if (!this.$) {
      this.$ = _emberViewsSystemJquery2['default'];
    }

    this.buildRegistry();

    registerLibraries();
    logLibraryVersions();

    // Start off the number of deferrals at 1. This will be
    // decremented by the Application's own `initialize` method.
    this._readinessDeferrals = 1;

    if ((0, _emberMetalFeatures2['default'])('ember-application-visit')) {
      if (this.autoboot) {
        // Create subclass of Ember.Router for this Application instance.
        // This is to ensure that someone reopening `App.Router` does not
        // tamper with the default `Ember.Router`.
        // 2.0TODO: Can we move this into a globals-mode-only library?
        this.Router = (this.Router || _emberRoutingSystemRouter2['default']).extend();
        this.buildDefaultInstance();
        this.waitForDOMReady();
      }
    } else {
      this.Router = (this.Router || _emberRoutingSystemRouter2['default']).extend();
      this.buildDefaultInstance();
      this.waitForDOMReady();
    }
  },

  /**
    Build and configure the registry for the current application.
      @private
    @method buildRegistry
    @return {Ember.Registry} the configured registry
  */
  buildRegistry: function buildRegistry() {
    var registry = this.registry = Application.buildRegistry(this);

    return registry;
  },

  /**
    Create a container for the current application's registry.
      @private
    @method buildInstance
    @return {Ember.Container} the configured container
  */
  buildInstance: function buildInstance() {
    return _emberApplicationSystemApplicationInstance2['default'].create({
      customEvents: (0, _emberMetalProperty_get.get)(this, 'customEvents'),
      rootElement: (0, _emberMetalProperty_get.get)(this, 'rootElement'),
      applicationRegistry: this.registry
    });
  },

  buildDefaultInstance: function buildDefaultInstance() {
    var instance = this.buildInstance();

    // For the default instance only, set the view registry to the global
    // Ember.View.views hash for backwards-compatibility.
    _emberViewsViewsView2['default'].views = instance.container.lookup('-view-registry:main');

    // TODO2.0: Legacy support for App.__container__
    // and global methods on App that rely on a single,
    // default instance.
    this.__deprecatedInstance__ = instance;
    this.__container__ = instance.container;

    return instance;
  },

  /**
    Automatically initialize the application once the DOM has
    become ready.
      The initialization itself is scheduled on the actions queue
    which ensures that application loading finishes before
    booting.
      If you are asynchronously loading code, you should call
    `deferReadiness()` to defer booting, and then call
    `advanceReadiness()` once all of your code has finished
    loading.
      @private
    @method waitForDOMReady
  */
  waitForDOMReady: function waitForDOMReady() {
    if (!this.$ || this.$.isReady) {
      _emberMetalRun_loop2['default'].schedule('actions', this, 'domReady');
    } else {
      this.$().ready(_emberMetalRun_loop2['default'].bind(this, 'domReady'));
    }
  },

  /**
    Use this to defer readiness until some condition is true.
      Example:
      ```javascript
    var App = Ember.Application.create();
      App.deferReadiness();
      // Ember.$ is a reference to the jQuery object/function
    Ember.$.getJSON('/auth-token', function(token) {
      App.token = token;
      App.advanceReadiness();
    });
    ```
      This allows you to perform asynchronous setup logic and defer
    booting your application until the setup has finished.
      However, if the setup requires a loading UI, it might be better
    to use the router for this purpose.
      @method deferReadiness
    @public
  */
  deferReadiness: function deferReadiness() {
    _emberMetal2['default'].assert('You must call deferReadiness on an instance of Ember.Application', this instanceof Application);
    _emberMetal2['default'].assert('You cannot defer readiness since the `ready()` hook has already been called.', this._readinessDeferrals > 0);
    this._readinessDeferrals++;
  },

  /**
    Call `advanceReadiness` after any asynchronous setup logic has completed.
    Each call to `deferReadiness` must be matched by a call to `advanceReadiness`
    or the application will never become ready and routing will not begin.
      @method advanceReadiness
    @see {Ember.Application#deferReadiness}
    @public
  */
  advanceReadiness: function advanceReadiness() {
    _emberMetal2['default'].assert('You must call advanceReadiness on an instance of Ember.Application', this instanceof Application);
    this._readinessDeferrals--;

    if (this._readinessDeferrals === 0) {
      _emberMetalRun_loop2['default'].once(this, this.didBecomeReady);
    }
  },

  /**
    Registers a factory that can be used for dependency injection (with
    `App.inject`) or for service lookup. Each factory is registered with
    a full name including two parts: `type:name`.
      A simple example:
      ```javascript
    var App = Ember.Application.create();
      App.Orange = Ember.Object.extend();
    App.register('fruit:favorite', App.Orange);
    ```
      Ember will resolve factories from the `App` namespace automatically.
    For example `App.CarsController` will be discovered and returned if
    an application requests `controller:cars`.
      An example of registering a controller with a non-standard name:
      ```javascript
    var App = Ember.Application.create();
    var Session = Ember.Controller.extend();
      App.register('controller:session', Session);
      // The Session controller can now be treated like a normal controller,
    // despite its non-standard name.
    App.ApplicationController = Ember.Controller.extend({
      needs: ['session']
    });
    ```
      Registered factories are **instantiated** by having `create`
    called on them. Additionally they are **singletons**, each time
    they are looked up they return the same instance.
      Some examples modifying that default behavior:
      ```javascript
    var App = Ember.Application.create();
      App.Person = Ember.Object.extend();
    App.Orange = Ember.Object.extend();
    App.Email = Ember.Object.extend();
    App.session = Ember.Object.create();
      App.register('model:user', App.Person, { singleton: false });
    App.register('fruit:favorite', App.Orange);
    App.register('communication:main', App.Email, { singleton: false });
    App.register('session', App.session, { instantiate: false });
    ```
      @method register
    @param  fullName {String} type:name (e.g., 'model:user')
    @param  factory {Function} (e.g., App.Person)
    @param  options {Object} (optional) disable instantiation or singleton usage
    @public
  **/
  register: function register() {
    var _registry;

    (_registry = this.registry).register.apply(_registry, arguments);
  },

  /**
    Define a dependency injection onto a specific factory or all factories
    of a type.
      When Ember instantiates a controller, view, or other framework component
    it can attach a dependency to that component. This is often used to
    provide services to a set of framework components.
      An example of providing a session object to all controllers:
      ```javascript
    var App = Ember.Application.create();
    var Session = Ember.Object.extend({ isAuthenticated: false });
      // A factory must be registered before it can be injected
    App.register('session:main', Session);
      // Inject 'session:main' onto all factories of the type 'controller'
    // with the name 'session'
    App.inject('controller', 'session', 'session:main');
      App.IndexController = Ember.Controller.extend({
      isLoggedIn: Ember.computed.alias('session.isAuthenticated')
    });
    ```
      Injections can also be performed on specific factories.
      ```javascript
    App.inject(<full_name or type>, <property name>, <full_name>)
    App.inject('route', 'source', 'source:main')
    App.inject('route:application', 'email', 'model:email')
    ```
      It is important to note that injections can only be performed on
    classes that are instantiated by Ember itself. Instantiating a class
    directly (via `create` or `new`) bypasses the dependency injection
    system.
      **Note:** Ember-Data instantiates its models in a unique manner, and consequently
    injections onto models (or all models) will not work as expected. Injections
    on models can be enabled by setting `Ember.MODEL_FACTORY_INJECTIONS`
    to `true`.
      @method inject
    @param  factoryNameOrType {String}
    @param  property {String}
    @param  injectionName {String}
    @public
  **/
  inject: function inject() {
    var _registry2;

    (_registry2 = this.registry).injection.apply(_registry2, arguments);
  },

  /**
    Calling initialize manually is not supported.
      Please see Ember.Application#advanceReadiness and
    Ember.Application#deferReadiness.
      @private
    @deprecated
    @method initialize
   **/
  initialize: function initialize() {
    _emberMetal2['default'].deprecate('Calling initialize manually is not supported. Please see Ember.Application#advanceReadiness and Ember.Application#deferReadiness');
  },

  /**
    Initialize the application. This happens automatically.
      Run any initializers and run the application load hook. These hooks may
    choose to defer readiness. For example, an authentication hook might want
    to defer readiness until the auth token has been retrieved.
      @private
    @method domReady
  */
  domReady: function domReady() {
    if (this.isDestroyed) {
      return;
    }

    this.boot();

    return this;
  },

  boot: function boot() {
    if (this._bootPromise) {
      return this._bootPromise;
    }

    var defer = new _emberMetal2['default'].RSVP.defer();
    this._bootPromise = defer.promise;
    this._bootResolver = defer;

    this.runInitializers(this.registry);
    (0, _emberRuntimeSystemLazy_load.runLoadHooks)('application', this);

    this.advanceReadiness();

    return this._bootPromise;
  },

  /**
    Reset the application. This is typically used only in tests. It cleans up
    the application in the following order:
      1. Deactivate existing routes
    2. Destroy all objects in the container
    3. Create a new application container
    4. Re-route to the existing url
      Typical Example:
      ```javascript
    var App;
      run(function() {
      App = Ember.Application.create();
    });
      module('acceptance test', {
      setup: function() {
        App.reset();
      }
    });
      test('first test', function() {
      // App is freshly reset
    });
      test('second test', function() {
      // App is again freshly reset
    });
    ```
      Advanced Example:
      Occasionally you may want to prevent the app from initializing during
    setup. This could enable extra configuration, or enable asserting prior
    to the app becoming ready.
      ```javascript
    var App;
      run(function() {
      App = Ember.Application.create();
    });
      module('acceptance test', {
      setup: function() {
        run(function() {
          App.reset();
          App.deferReadiness();
        });
      }
    });
      test('first test', function() {
      ok(true, 'something before app is initialized');
        run(function() {
        App.advanceReadiness();
      });
        ok(true, 'something after app is initialized');
    });
    ```
      @method reset
    @public
  **/
  reset: function reset() {
    var instance = this.__deprecatedInstance__;

    this._readinessDeferrals = 1;
    this._bootPromise = null;
    this._bootResolver = null;

    function handleReset() {
      (0, _emberMetalRun_loop2['default'])(instance, 'destroy');

      _emberMetalRun_loop2['default'].schedule('actions', this, 'domReady', this.buildDefaultInstance());
    }

    _emberMetalRun_loop2['default'].join(this, handleReset);
  },

  /**
    @private
    @method runInitializers
  */
  runInitializers: function runInitializers(registry) {
    var App = this;
    this._runInitializer('initializers', function (name, initializer) {
      _emberMetal2['default'].assert('No application initializer named \'' + name + '\'', !!initializer);

      if ((0, _emberMetalFeatures2['default'])('ember-application-initializer-context')) {
        initializer.initialize(registry, App);
      } else {
        var ref = initializer.initialize;
        ref(registry, App);
      }
    });
  },

  runInstanceInitializers: function runInstanceInitializers(instance) {
    this._runInitializer('instanceInitializers', function (name, initializer) {
      _emberMetal2['default'].assert('No instance initializer named \'' + name + '\'', !!initializer);
      initializer.initialize(instance);
    });
  },

  _runInitializer: function _runInitializer(bucketName, cb) {
    var initializersByName = (0, _emberMetalProperty_get.get)(this.constructor, bucketName);
    var initializers = props(initializersByName);
    var graph = new _dagMap2['default']();
    var initializer;

    for (var i = 0; i < initializers.length; i++) {
      initializer = initializersByName[initializers[i]];
      graph.addEdges(initializer.name, initializer, initializer.before, initializer.after);
    }

    graph.topsort(function (vertex) {
      cb(vertex.name, vertex.value);
    });
  },

  /**
    @private
    @method didBecomeReady
  */
  didBecomeReady: function didBecomeReady() {
    if (this.autoboot) {
      if (_emberMetalEnvironment2['default'].hasDOM) {
        this.__deprecatedInstance__.setupEventDispatcher();
      }

      this.runInstanceInitializers(this.__deprecatedInstance__);
      this.ready(); // user hook
      this.__deprecatedInstance__.startRouting();

      if (!_emberMetal2['default'].testing) {
        // Eagerly name all classes that are already loaded
        _emberMetal2['default'].Namespace.processAll();
        _emberMetal2['default'].BOOTED = true;
      }
    }

    this._bootResolver.resolve();
  },

  /**
    Called when the Application has become ready, immediately before routing
    begins. The call will be delayed until the DOM has become ready.
      @event ready
    @public
  */
  ready: function ready() {
    return this;
  },

  /**
    Set this to provide an alternate class to `Ember.DefaultResolver`
  
    @deprecated Use 'Resolver' instead
    @property resolver
    @public
  */
  resolver: null,

  /**
    Set this to provide an alternate class to `Ember.DefaultResolver`
      @property resolver
    @public
  */
  Resolver: null,

  // This method must be moved to the application instance object
  willDestroy: function willDestroy() {
    this._super.apply(this, arguments);
    _emberMetal2['default'].BOOTED = false;
    this._bootPromise = null;
    this._bootResolver = null;

    if (this.__deprecatedInstance__) {
      this.__deprecatedInstance__.destroy();
    }
  },

  initializer: function initializer(options) {
    this.constructor.initializer(options);
  },

  /**
    @method then
    @private
    @deprecated
  */
  then: function then() {
    _emberMetal2['default'].deprecate('Do not use `.then` on an instance of Ember.Application.  Please use the `.ready` hook instead.', false, { url: 'http://emberjs.com/guides/deprecations/#toc_deprecate-code-then-code-on-ember-application' });

    this._super.apply(this, arguments);
  }
});

if ((0, _emberMetalFeatures2['default'])('ember-application-instance-initializers')) {
  Application.reopen({
    instanceInitializer: function instanceInitializer(options) {
      this.constructor.instanceInitializer(options);
    }
  });

  Application.reopenClass({
    instanceInitializer: buildInitializerMethod('instanceInitializers', 'instance initializer')
  });
}

if ((0, _emberMetalFeatures2['default'])('ember-application-visit')) {
  Application.reopen({
    /**
      Creates a new instance of the application and instructs it to route to the
      specified initial URL. This method returns a promise that will be resolved
      once rendering is complete. That promise is resolved with the instance.
        ```js
      App.visit('/users').then(function(instance) {
        var view = instance.view;
        view.appendTo('#qunit-test-fixtures');
      });
     ```
        @method visit
      @private
    */
    visit: function visit(url) {
      var instance = this.buildInstance();
      this.runInstanceInitializers(instance);

      var renderPromise = new _emberMetal2['default'].RSVP.Promise(function (res, rej) {
        instance.didCreateRootView = function (view) {
          instance.view = view;
          res(instance);
        };
      });

      instance.overrideRouterLocation({ location: 'none' });

      return instance.handleURL(url).then(function () {
        return renderPromise;
      });
    }
  });
}

Application.reopenClass({
  initializers: Object.create(null),
  instanceInitializers: Object.create(null),

  /**
    Initializer receives an object which has the following attributes:
    `name`, `before`, `after`, `initialize`. The only required attribute is
    `initialize`, all others are optional.
      * `name` allows you to specify under which name the initializer is registered.
    This must be a unique name, as trying to register two initializers with the
    same name will result in an error.
      ```javascript
    Ember.Application.initializer({
      name: 'namedInitializer',
        initialize: function(container, application) {
        Ember.debug('Running namedInitializer!');
      }
    });
    ```
      * `before` and `after` are used to ensure that this initializer is ran prior
    or after the one identified by the value. This value can be a single string
    or an array of strings, referencing the `name` of other initializers.
      An example of ordering initializers, we create an initializer named `first`:
      ```javascript
    Ember.Application.initializer({
      name: 'first',
        initialize: function(container, application) {
        Ember.debug('First initializer!');
      }
    });
      // DEBUG: First initializer!
    ```
      We add another initializer named `second`, specifying that it should run
    after the initializer named `first`:
      ```javascript
    Ember.Application.initializer({
      name: 'second',
      after: 'first',
        initialize: function(container, application) {
        Ember.debug('Second initializer!');
      }
    });
      // DEBUG: First initializer!
    // DEBUG: Second initializer!
    ```
      Afterwards we add a further initializer named `pre`, this time specifying
    that it should run before the initializer named `first`:
      ```javascript
    Ember.Application.initializer({
      name: 'pre',
      before: 'first',
        initialize: function(container, application) {
        Ember.debug('Pre initializer!');
      }
    });
      // DEBUG: Pre initializer!
    // DEBUG: First initializer!
    // DEBUG: Second initializer!
    ```
      Finally we add an initializer named `post`, specifying it should run after
    both the `first` and the `second` initializers:
      ```javascript
    Ember.Application.initializer({
      name: 'post',
      after: ['first', 'second'],
        initialize: function(container, application) {
        Ember.debug('Post initializer!');
      }
    });
      // DEBUG: Pre initializer!
    // DEBUG: First initializer!
    // DEBUG: Second initializer!
    // DEBUG: Post initializer!
    ```
      * `initialize` is a callback function that receives two arguments, `container`
    and `application` on which you can operate.
      Example of using `container` to preload data into the store:
      ```javascript
    Ember.Application.initializer({
      name: 'preload-data',
        initialize: function(container, application) {
        var store = container.lookup('store:main');
          store.pushPayload(preloadedData);
      }
    });
    ```
      Example of using `application` to register an adapter:
      ```javascript
    Ember.Application.initializer({
      name: 'api-adapter',
        initialize: function(container, application) {
        application.register('api-adapter:main', ApiAdapter);
      }
    });
    ```
      @method initializer
    @param initializer {Object}
    @public
   */
  initializer: buildInitializerMethod('initializers', 'initializer'),

  /**
    This creates a registry with the default Ember naming conventions.
      It also configures the registry:
      * registered views are created every time they are looked up (they are
      not singletons)
    * registered templates are not factories; the registered value is
      returned directly.
    * the router receives the application as its `namespace` property
    * all controllers receive the router as their `target` and `controllers`
      properties
    * all controllers receive the application as their `namespace` property
    * the application view receives the application controller as its
      `controller` property
    * the application view receives the application template as its
      `defaultTemplate` property
      @private
    @method buildRegistry
    @static
    @param {Ember.Application} namespace the application for which to
      build the registry
    @return {Ember.Registry} the built registry
    @public
  */
  buildRegistry: function buildRegistry(namespace) {
    var registry = new _containerRegistry2['default']();

    registry.set = _emberMetalProperty_set.set;
    registry.resolver = resolverFor(namespace);
    registry.normalizeFullName = registry.resolver.normalize;
    registry.describe = registry.resolver.describe;
    registry.makeToString = registry.resolver.makeToString;

    registry.optionsForType('component', { singleton: false });
    registry.optionsForType('view', { singleton: false });
    registry.optionsForType('template', { instantiate: false });

    registry.register('application:main', namespace, { instantiate: false });

    registry.register('controller:basic', _emberRuntimeControllersController2['default'], { instantiate: false });
    registry.register('controller:object', _emberRuntimeControllersObject_controller2['default'], { instantiate: false });
    registry.register('controller:array', _emberRuntimeControllersArray_controller2['default'], { instantiate: false });

    registry.register('renderer:-dom', { create: function create() {
        return new _emberMetalViewsRenderer2['default'](new _emberHtmlbarsSystemDomHelper2['default']());
      } });

    registry.injection('view', 'renderer', 'renderer:-dom');
    registry.register('view:select', _emberViewsViewsSelect2['default']);
    registry.register('view:-outlet', _emberRoutingViewsViewsOutlet.OutletView);

    registry.register('-view-registry:main', { create: function create() {
        return {};
      } });

    registry.injection('view', '_viewRegistry', '-view-registry:main');

    registry.register('view:toplevel', _emberViewsViewsView2['default'].extend());

    registry.register('route:basic', _emberRoutingSystemRoute2['default'], { instantiate: false });
    registry.register('event_dispatcher:main', _emberViewsSystemEvent_dispatcher2['default']);

    registry.injection('router:main', 'namespace', 'application:main');
    registry.injection('view:-outlet', 'namespace', 'application:main');

    registry.register('location:auto', _emberRoutingLocationAuto_location2['default']);
    registry.register('location:hash', _emberRoutingLocationHash_location2['default']);
    registry.register('location:history', _emberRoutingLocationHistory_location2['default']);
    registry.register('location:none', _emberRoutingLocationNone_location2['default']);

    registry.injection('controller', 'target', 'router:main');
    registry.injection('controller', 'namespace', 'application:main');

    registry.register('-bucket-cache:main', _emberRoutingSystemCache2['default']);
    registry.injection('router', '_bucketCache', '-bucket-cache:main');
    registry.injection('route', '_bucketCache', '-bucket-cache:main');
    registry.injection('controller', '_bucketCache', '-bucket-cache:main');

    registry.injection('route', 'router', 'router:main');

    registry.register('component:-text-field', _emberViewsViewsText_field2['default']);
    registry.register('component:-text-area', _emberViewsViewsText_area2['default']);
    registry.register('component:-checkbox', _emberViewsViewsCheckbox2['default']);
    registry.register('view:-legacy-each', _emberViewsViewsLegacy_each_view2['default']);
    registry.register('component:-link-to', _emberRoutingViewsViewsLink2['default']);

    // Register the routing service...
    registry.register('service:-routing', _emberRoutingServicesRouting2['default']);
    // Then inject the app router into it
    registry.injection('service:-routing', 'router', 'router:main');

    // DEBUGGING
    registry.register('resolver-for-debugging:main', registry.resolver.__resolver__, { instantiate: false });
    registry.injection('container-debug-adapter:main', 'resolver', 'resolver-for-debugging:main');
    registry.injection('data-adapter:main', 'containerDebugAdapter', 'container-debug-adapter:main');
    // Custom resolver authors may want to register their own ContainerDebugAdapter with this key

    registry.register('container-debug-adapter:main', _emberExtensionSupportContainer_debug_adapter2['default']);

    return registry;
  }
});

/**
  This function defines the default lookup rules for container lookups:

  * templates are looked up on `Ember.TEMPLATES`
  * other names are looked up on the application after classifying the name.
    For example, `controller:post` looks up `App.PostController` by default.
  * if the default lookup fails, look for registered classes on the container

  This allows the application to register default injections in the container
  that could be overridden by the normal naming convention.

  @private
  @method resolverFor
  @param {Ember.Namespace} namespace the namespace to look for classes
  @return {*} the resolved value for a given lookup
*/
function resolverFor(namespace) {
  _emberMetal2['default'].deprecate('Application.resolver is deprecated in favor of Application.Resolver', !namespace.get('resolver'));

  var ResolverClass = namespace.get('resolver') || namespace.get('Resolver') || _emberApplicationSystemResolver2['default'];
  var resolver = ResolverClass.create({
    namespace: namespace
  });

  function resolve(fullName) {
    return resolver.resolve(fullName);
  }

  resolve.describe = function (fullName) {
    return resolver.lookupDescription(fullName);
  };

  resolve.makeToString = function (factory, fullName) {
    return resolver.makeToString(factory, fullName);
  };

  resolve.normalize = function (fullName) {
    if (resolver.normalize) {
      return resolver.normalize(fullName);
    } else {
      _emberMetal2['default'].deprecate('The Resolver should now provide a \'normalize\' function', false);
      return fullName;
    }
  };

  resolve.knownForType = function knownForType(type) {
    if (resolver.knownForType) {
      return resolver.knownForType(type);
    }
  };

  resolve.moduleBasedResolver = resolver.moduleBasedResolver;

  resolve.__resolver__ = resolver;

  return resolve;
}

function registerLibraries() {
  if (!librariesRegistered) {
    librariesRegistered = true;

    if (_emberMetalEnvironment2['default'].hasDOM) {
      _emberMetal2['default'].libraries.registerCoreLibrary('jQuery', (0, _emberViewsSystemJquery2['default'])().jquery);
    }
  }
}

function logLibraryVersions() {
  if (_emberMetal2['default'].LOG_VERSION) {
    // we only need to see this once per Application#init
    _emberMetal2['default'].LOG_VERSION = false;
    var libs = _emberMetal2['default'].libraries._registry;

    var nameLengths = libs.map(function (item) {
      return (0, _emberMetalProperty_get.get)(item, 'name.length');
    });

    var maxNameLength = Math.max.apply(this, nameLengths);

    _emberMetal2['default'].debug('-------------------------------');
    for (var i = 0, l = libs.length; i < l; i++) {
      var lib = libs[i];
      var spaces = new Array(maxNameLength - lib.name.length + 1).join(' ');
      _emberMetal2['default'].debug([lib.name, spaces, ' : ', lib.version].join(''));
    }
    _emberMetal2['default'].debug('-------------------------------');
  }
}

function buildInitializerMethod(bucketName, humanName) {
  return function (initializer) {
    // If this is the first initializer being added to a subclass, we are going to reopen the class
    // to make sure we have a new `initializers` object, which extends from the parent class' using
    // prototypal inheritance. Without this, attempting to add initializers to the subclass would
    // pollute the parent class as well as other subclasses.
    if (this.superclass[bucketName] !== undefined && this.superclass[bucketName] === this[bucketName]) {
      var attrs = {};
      attrs[bucketName] = Object.create(this[bucketName]);
      this.reopenClass(attrs);
    }

    _emberMetal2['default'].assert('The ' + humanName + ' \'' + initializer.name + '\' has already been registered', !this[bucketName][initializer.name]);
    _emberMetal2['default'].assert('An ' + humanName + ' cannot be registered without an initialize function', (0, _emberMetalUtils.canInvoke)(initializer, 'initialize'));
    _emberMetal2['default'].assert('An ' + humanName + ' cannot be registered without a name property', initializer.name !== undefined);

    this[bucketName][initializer.name] = initializer;
  };
}

exports['default'] = Application;
module.exports = exports['default'];