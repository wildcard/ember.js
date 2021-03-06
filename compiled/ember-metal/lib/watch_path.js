'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.watchPath = watchPath;
exports.unwatchPath = unwatchPath;

var _emberMetalUtils = require('ember-metal/utils');

var _emberMetalChains = require('ember-metal/chains');

// get the chains for the current object. If the current object has
// chains inherited from the proto they will be cloned and reconfigured for
// the current object.
function chainsFor(obj, meta) {
  var m = meta || (0, _emberMetalUtils.meta)(obj);
  var ret = m.chains;
  if (!ret) {
    ret = m.chains = new _emberMetalChains.ChainNode(null, null, obj);
  } else if (ret.value() !== obj) {
    ret = m.chains = ret.copy(obj);
  }
  return ret;
}

function watchPath(obj, keyPath, meta) {
  // can't watch length on Array - it is special...
  if (keyPath === 'length' && Array.isArray(obj)) {
    return;
  }

  var m = meta || (0, _emberMetalUtils.meta)(obj);
  var watching = m.watching;

  if (!watching[keyPath]) {
    // activate watching first time
    watching[keyPath] = 1;
    chainsFor(obj, m).add(keyPath);
  } else {
    watching[keyPath] = (watching[keyPath] || 0) + 1;
  }
}

function unwatchPath(obj, keyPath, meta) {
  var m = meta || (0, _emberMetalUtils.meta)(obj);
  var watching = m.watching;

  if (watching[keyPath] === 1) {
    watching[keyPath] = 0;
    chainsFor(obj, m).remove(keyPath);
  } else if (watching[keyPath] > 1) {
    watching[keyPath]--;
  }
}