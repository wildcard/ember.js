'use strict';

var _emberTemplateCompiler = require('ember-template-compiler');

QUnit.module('ember-template-compiler: transform-each-into-collection');

var deprecatedAttrs = ['itemController', 'itemView', 'itemViewClass', 'tagName', 'emptyView', 'emptyViewClass'];

function testBlockForm(attr) {
  QUnit.test('Using the \'' + attr + '\' hash argument with a block results in a deprecation', function () {
    expect(1);

    expectDeprecation(function () {
      (0, _emberTemplateCompiler.compile)('\n\n    {{#each model ' + attr + '="foo" as |item|}}{{item}}{{/each}}', {
        moduleName: 'lol-wat-app/index/template'
      });
    }, 'Using \'' + attr + '\' with \'{{each}}\' (\'lol-wat-app/index/template\' @ L3:C18) is deprecated.  Please refactor to a component.');
  });
}

function testNonBlockForm(attr) {
  QUnit.test('Using the \'' + attr + '\' hash argument in non-block form results in a deprecation', function () {
    expect(1);

    expectDeprecation(function () {
      (0, _emberTemplateCompiler.compile)('\n\n    {{each model ' + attr + '="foo"}}', {
        moduleName: 'lol-wat-app/index/template'
      });
    }, 'Using \'' + attr + '\' with \'{{each}}\' (\'lol-wat-app/index/template\' @ L3:C17) is deprecated.  Please refactor to a component.');
  });
}

for (var i = 0, l = deprecatedAttrs.length; i < l; i++) {
  var attr = deprecatedAttrs[i];

  testBlockForm(attr);
  testNonBlockForm(attr);
}