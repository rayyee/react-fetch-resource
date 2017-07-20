'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addHookWhenFetching = addHookWhenFetching;
exports.createInstance = createInstance;

exports.default = function () {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return _withFetching2.default.apply(undefined, [getForFetching].concat(args));
};

var _react = require('react');

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _withFetching = require('./withFetching.js');

var _withFetching2 = _interopRequireDefault(_withFetching);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getForFetching(resource, queryObj) {
  var url = queryObj ? resource + _qs2.default.stringify(queryObj) : resource;
  return fetch(url).then(function (res) {
    return res.json();
  });
}

/**
* @param fetcher is a function hook, type (resourcePath, queryObject) => Promise
*/
// No import with webpack
// new webpack.ProvidePlugin({
//   "fetch": "isomorphic-fetch",
// })
// or
// import 'isomorphic-fetch'
function addHookWhenFetching(fetcher) {
  getForFetching = fetcher;
}

function createInstance(fetcher) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _withFetching2.default.apply(undefined, [fetcher].concat(args));
  };
}

;