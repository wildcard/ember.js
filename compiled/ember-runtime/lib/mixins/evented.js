'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalEvents = require('ember-metal/events');

/**
@module ember
@submodule ember-runtime
*/

/**
  This mixin allows for Ember objects to subscribe to and emit events.

  ```javascript
  App.Person = Ember.Object.extend(Ember.Evented, {
    greet: function() {
      // ...
      this.trigger('greet');
    }
  });

  var person = App.Person.create();

  person.on('greet', function() {
    console.log('Our person has greeted');
  });

  person.greet();

  // outputs: 'Our person has greeted'
  ```

  You can also chain multiple event subscriptions:

  ```javascript
  person.on('greet', function() {
    console.log('Our person has greeted');
  }).one('greet', function() {
    console.log('Offer one-time special');
  }).off('event', this, forgetThis);
  ```

  @class Evented
  @namespace Ember
  @public
 */
exports['default'] = _emberMetalMixin.Mixin.create({

  /**
   Subscribes to a named event with given function.
     ```javascript
   person.on('didLoad', function() {
     // fired once the person has loaded
   });
   ```
     An optional target can be passed in as the 2nd argument that will
   be set as the "this" for the callback. This is a good way to give your
   function access to the object triggering the event. When the target
   parameter is used the callback becomes the third argument.
     @method on
   @param {String} name The name of the event
   @param {Object} [target] The "this" binding for the callback
   @param {Function} method The callback to execute
   @return this
   @public
  */
  on: function on(name, target, method) {
    (0, _emberMetalEvents.addListener)(this, name, target, method);
    return this;
  },

  /**
    Subscribes a function to a named event and then cancels the subscription
    after the first time the event is triggered. It is good to use ``one`` when
    you only care about the first time an event has taken place.
      This function takes an optional 2nd argument that will become the "this"
    value for the callback. If this argument is passed then the 3rd argument
    becomes the function.
      @method one
    @param {String} name The name of the event
    @param {Object} [target] The "this" binding for the callback
    @param {Function} method The callback to execute
    @return this
    @public
  */
  one: function one(name, target, method) {
    if (!method) {
      method = target;
      target = null;
    }

    (0, _emberMetalEvents.addListener)(this, name, target, method, true);
    return this;
  },

  /**
    Triggers a named event for the object. Any additional arguments
    will be passed as parameters to the functions that are subscribed to the
    event.
      ```javascript
    person.on('didEat', function(food) {
      console.log('person ate some ' + food);
    });
      person.trigger('didEat', 'broccoli');
      // outputs: person ate some broccoli
    ```
    @method trigger
    @param {String} name The name of the event
    @param {Object...} args Optional arguments to pass on
    @public
  */
  trigger: function trigger(name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (0, _emberMetalEvents.sendEvent)(this, name, args);
  },

  /**
    Cancels subscription for given name, target, and method.
      @method off
    @param {String} name The name of the event
    @param {Object} target The target of the subscription
    @param {Function} method The function of the subscription
    @return this
    @public
  */
  off: function off(name, target, method) {
    (0, _emberMetalEvents.removeListener)(this, name, target, method);
    return this;
  },

  /**
    Checks to see if object has any subscriptions for named event.
      @method has
    @param {String} name The name of the event
    @return {Boolean} does the object have a subscription for event
    @public
   */
  has: function has(name) {
    return (0, _emberMetalEvents.hasListeners)(this, name);
  }
});
module.exports = exports['default'];