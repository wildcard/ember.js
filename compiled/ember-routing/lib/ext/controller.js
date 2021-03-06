'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// FEATURES, deprecate

var _emberMetalProperty_get = require('ember-metal/property_get');

var _emberRuntimeMixinsController = require('ember-runtime/mixins/controller');

var _emberRuntimeMixinsController2 = _interopRequireDefault(_emberRuntimeMixinsController);

/**
@module ember
@submodule ember-routing
*/

_emberRuntimeMixinsController2['default'].reopen({
    concatenatedProperties: ['queryParams'],

    /**
      Defines which query parameters the controller accepts.
      If you give the names ['category','page'] it will bind
      the values of these query parameters to the variables
      `this.category` and `this.page`
        @property queryParams
      @public
    */
    queryParams: null,

    /**
      @property _qpDelegate
      @private
    */
    _qpDelegate: null, // set by route

    /**
      @method _qpChanged
      @private
    */
    _qpChanged: function _qpChanged(controller, _prop) {
        var prop = _prop.substr(0, _prop.length - 3);

        var delegate = controller._qpDelegate;
        var value = (0, _emberMetalProperty_get.get)(controller, prop);
        delegate(prop, value);
    },

    /**
      Transition the application into another route. The route may
      be either a single route or route path:
        ```javascript
      aController.transitionToRoute('blogPosts');
      aController.transitionToRoute('blogPosts.recentEntries');
      ```
        Optionally supply a model for the route in question. The model
      will be serialized into the URL using the `serialize` hook of
      the route:
        ```javascript
      aController.transitionToRoute('blogPost', aPost);
      ```
        If a literal is passed (such as a number or a string), it will
      be treated as an identifier instead. In this case, the `model`
      hook of the route will be triggered:
        ```javascript
      aController.transitionToRoute('blogPost', 1);
      ```
        Multiple models will be applied last to first recursively up the
      route tree.
        ```javascript
      App.Router.map(function() {
        this.route('blogPost', { path: ':blogPostId' }, function() {
          this.route('blogComment', { path: ':blogCommentId', resetNamespace: true });
        });
      });
        aController.transitionToRoute('blogComment', aPost, aComment);
      aController.transitionToRoute('blogComment', 1, 13);
      ```
        It is also possible to pass a URL (a string that starts with a
      `/`). This is intended for testing and debugging purposes and
      should rarely be used in production code.
        ```javascript
      aController.transitionToRoute('/');
      aController.transitionToRoute('/blog/post/1/comment/13');
      aController.transitionToRoute('/blog/posts?sort=title');
      ```
        An options hash with a `queryParams` property may be provided as
      the final argument to add query parameters to the destination URL.
        ```javascript
      aController.transitionToRoute('blogPost', 1, {
        queryParams: {showComments: 'true'}
      });
        // if you just want to transition the query parameters without changing the route
      aController.transitionToRoute({queryParams: {sort: 'date'}});
      ```
        See also [replaceRoute](/api/classes/Ember.ControllerMixin.html#method_replaceRoute).
        @param {String} name the name of the route or a URL
      @param {...Object} models the model(s) or identifier(s) to be used
        while transitioning to the route.
      @param {Object} [options] optional hash with a queryParams property
        containing a mapping of query parameters
      @for Ember.ControllerMixin
      @method transitionToRoute
      @public
    */
    transitionToRoute: function transitionToRoute() {
        // target may be either another controller or a router
        var target = (0, _emberMetalProperty_get.get)(this, 'target');
        var method = target.transitionToRoute || target.transitionTo;
        return method.apply(target, arguments);
    },

    /**
      @deprecated
      @for Ember.ControllerMixin
      @method transitionTo
      @private
    */
    transitionTo: function transitionTo() {
        _emberMetalCore2['default'].deprecate('transitionTo is deprecated. Please use transitionToRoute.');
        return this.transitionToRoute.apply(this, arguments);
    },

    /**
      Transition into another route while replacing the current URL, if possible.
      This will replace the current history entry instead of adding a new one.
      Beside that, it is identical to `transitionToRoute` in all other respects.
        ```javascript
      aController.replaceRoute('blogPosts');
      aController.replaceRoute('blogPosts.recentEntries');
      ```
        Optionally supply a model for the route in question. The model
      will be serialized into the URL using the `serialize` hook of
      the route:
        ```javascript
      aController.replaceRoute('blogPost', aPost);
      ```
        If a literal is passed (such as a number or a string), it will
      be treated as an identifier instead. In this case, the `model`
      hook of the route will be triggered:
        ```javascript
      aController.replaceRoute('blogPost', 1);
      ```
        Multiple models will be applied last to first recursively up the
      route tree.
        ```javascript
      App.Router.map(function() {
        this.route('blogPost', { path: ':blogPostId' }, function() {
          this.route('blogComment', { path: ':blogCommentId', resetNamespace: true });
        });
      });
        aController.replaceRoute('blogComment', aPost, aComment);
      aController.replaceRoute('blogComment', 1, 13);
      ```
        It is also possible to pass a URL (a string that starts with a
      `/`). This is intended for testing and debugging purposes and
      should rarely be used in production code.
        ```javascript
      aController.replaceRoute('/');
      aController.replaceRoute('/blog/post/1/comment/13');
      ```
        @param {String} name the name of the route or a URL
      @param {...Object} models the model(s) or identifier(s) to be used
      while transitioning to the route.
      @for Ember.ControllerMixin
      @method replaceRoute
      @private
    */
    replaceRoute: function replaceRoute() {
        // target may be either another controller or a router
        var target = (0, _emberMetalProperty_get.get)(this, 'target');
        var method = target.replaceRoute || target.replaceWith;
        return method.apply(target, arguments);
    },

    /**
      @deprecated
      @for Ember.ControllerMixin
      @method replaceWith
      @private
    */
    replaceWith: function replaceWith() {
        _emberMetalCore2['default'].deprecate('replaceWith is deprecated. Please use replaceRoute.');
        return this.replaceRoute.apply(this, arguments);
    }
});

exports['default'] = _emberRuntimeMixinsController2['default'];
module.exports = exports['default'];