/**
@module ember
@submodule ember-htmlbars
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.assert

var _emberTemplateCompilerSystemString = require('ember-template-compiler/system/string');

var _emberTemplateCompilerSystemCalculateLocationDisplay = require('ember-template-compiler/system/calculate-location-display');

var _emberTemplateCompilerSystemCalculateLocationDisplay2 = _interopRequireDefault(_emberTemplateCompilerSystemCalculateLocationDisplay);

/**
  An HTMLBars AST transformation that replaces all instances of
  {{bind-attr}} helpers with the equivalent HTMLBars-style bound
  attributes. For example

  ```handlebars
  <div {{bind-attr class=":foo some.path:bar"}}></div>
  ```

  becomes

  ```handlebars
  <div class="foo {{if some.path "bar" ""}}></div>
  ```

  @class TransformBindAttrToAttributes
  @private
*/
function TransformBindAttrToAttributes(options) {
  // set later within HTMLBars to the syntax package
  this.syntax = null;
  this.options = options || {};
}

/**
  @private
  @method transform
  @param {AST} ast The AST to be transformed.
*/
TransformBindAttrToAttributes.prototype.transform = function TransformBindAttrToAttributes_transform(ast) {
  var plugin = this;
  var moduleName = this.options.moduleName;
  var walker = new this.syntax.Walker();

  walker.visit(ast, function (node) {
    if (node.type === 'ElementNode') {
      for (var i = 0; i < node.modifiers.length; i++) {
        var modifier = node.modifiers[i];

        if (isBindAttrModifier(modifier, moduleName)) {
          node.modifiers.splice(i--, 1);
          plugin.assignAttrs(node, modifier.hash);
        }
      }
    }
  });

  return ast;
};

TransformBindAttrToAttributes.prototype.assignAttrs = function assignAttrs(element, hash) {
  var pairs = hash.pairs;

  for (var i = 0; i < pairs.length; i++) {
    var name = pairs[i].key;
    var value = pairs[i].value;

    assertAttrNameIsUnused(element, name);

    var attr = this.syntax.builders.attr(name, this.transformValue(name, value));
    element.attributes.push(attr);
  }
};

TransformBindAttrToAttributes.prototype.transformValue = function transformValue(name, value) {
  var b = this.syntax.builders;

  if (name === 'class') {
    switch (value.type) {
      case 'StringLiteral':
        return this.parseClasses(value.value);
      case 'PathExpression':
        return this.parseClasses(value.original);
      case 'SubExpression':
        return b.mustache(value.path, value.params, value.hash);
      default:
        _emberMetalCore2['default'].assert('Unsupported attribute value type: ' + value.type);
    }
  } else {
    switch (value.type) {
      case 'StringLiteral':
        return b.mustache(b.path(value.value));
      case 'PathExpression':
        return b.mustache(value);
      case 'SubExpression':
        return b.mustache(value.path, value.params, value.hash);
      default:
        _emberMetalCore2['default'].assert('Unsupported attribute value type: ' + value.type);
    }
  }
};

TransformBindAttrToAttributes.prototype.parseClasses = function parseClasses(value) {
  var b = this.syntax.builders;

  var concat = b.concat();
  var classes = value.split(' ');

  for (var i = 0; i < classes.length; i++) {
    if (i > 0) {
      concat.parts.push(b.string(' '));
    }

    var concatPart = this.parseClass(classes[i]);
    concat.parts.push(concatPart);
  }

  return concat;
};

TransformBindAttrToAttributes.prototype.parseClass = function parseClass(value) {
  var b = this.syntax.builders;

  var parts = value.split(':');

  switch (parts.length) {
    case 1:
      // Before: {{bind-attr class="view.fooBar ..."}}
      // After: class="{{-bind-attr-class view.fooBar "foo-bar"}} ..."
      return b.sexpr(b.path('-bind-attr-class'), [b.path(parts[0]), b.string(dasherizeLastKey(parts[0]))]);
    case 2:
      if (parts[0] === '') {
        // Before: {{bind-attr class=":foo ..."}}
        // After: class="foo ..."
        return b.string(parts[1]);
      } else {
        // Before: {{bind-attr class="some.path:foo ..."}}
        // After: class="{{if some.path "foo" ""}} ..."
        return b.sexpr(b.path('if'), [b.path(parts[0]), b.string(parts[1]), b.string('')]);
      }
      break;
    case 3:
      // Before: {{bind-attr class="some.path:foo:bar ..."}}
      // After: class="{{if some.path "foo" "bar"}} ..."
      return b.sexpr(b.path('if'), [b.path(parts[0]), b.string(parts[1]), b.string(parts[2])]);
    default:
      _emberMetalCore2['default'].assert('Unsupported bind-attr class syntax: `' + value + '`');
  }
};

function isBindAttrModifier(modifier, moduleName) {
  var name = modifier.path.original;

  var moduleInfo = (0, _emberTemplateCompilerSystemCalculateLocationDisplay2['default'])(moduleName, modifier.path.loc);

  if (name === 'bind-attr' || name === 'bindAttr') {
    _emberMetalCore2['default'].deprecate('The `' + name + '` helper ' + moduleInfo + 'is deprecated in favor of ' + 'HTMLBars-style bound attributes.');
    return true;
  } else {
    return false;
  }
}

function assertAttrNameIsUnused(element, name) {
  for (var i = 0; i < element.attributes.length; i++) {
    var attr = element.attributes[i];

    if (attr.name === name) {
      if (name === 'class') {
        _emberMetalCore2['default'].assert('You cannot set `class` manually and via `{{bind-attr}}` helper ' + 'on the same element. Please use `{{bind-attr}}`\'s `:static-class` ' + 'syntax instead.');
      } else {
        _emberMetalCore2['default'].assert('You cannot set `' + name + '` manually and via `{{bind-attr}}` ' + 'helper on the same element.');
      }
    }
  }
}

function dasherizeLastKey(path) {
  var parts = path.split('.');
  return (0, _emberTemplateCompilerSystemString.dasherize)(parts[parts.length - 1]);
}

exports['default'] = TransformBindAttrToAttributes;
module.exports = exports['default'];