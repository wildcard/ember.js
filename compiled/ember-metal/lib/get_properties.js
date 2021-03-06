'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getProperties;

var _emberMetalProperty_get = require('ember-metal/property_get');

/**
  To get multiple properties at once, call `Ember.getProperties`
  with an object followed by a list of strings or an array:

  ```javascript
  Ember.getProperties(record, 'firstName', 'lastName', 'zipCode');
  // { firstName: 'John', lastName: 'Doe', zipCode: '10011' }
  ```

  is equivalent to:

  ```javascript
  Ember.getProperties(record, ['firstName', 'lastName', 'zipCode']);
  // { firstName: 'John', lastName: 'Doe', zipCode: '10011' }
  ```

  @method getProperties
  @for Ember
  @param {Object} obj
  @param {String...|Array} list of keys to get
  @return {Object}
  @private
*/

function getProperties(obj) {
  var ret = {};
  var propertyNames = arguments;
  var i = 1;

  if (arguments.length === 2 && Array.isArray(arguments[1])) {
    i = 0;
    propertyNames = arguments[1];
  }
  for (var len = propertyNames.length; i < len; i++) {
    ret[propertyNames[i]] = (0, _emberMetalProperty_get.get)(obj, propertyNames[i]);
  }
  return ret;
}

module.exports = exports['default'];