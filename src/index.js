// No import with webpack
// new webpack.ProvidePlugin({
//   "fetch": "isomorphic-fetch",
// })
// or
// import 'isomorphic-fetch'
import { Component, createFactory } from 'react';
import qs from 'qs';
import withFetching from "./withFetching.js";

function getForFetching(resource, queryObj) {
  const url = queryObj ? resource + qs.stringify(queryObj) : resource;
  return fetch(url).then(res => {
    return res.json();
  })
}

/**
* @param fetcher is a function hook, type (resourcePath, queryObject) => Promise
*/
export function addHookWhenFetching(fetcher) {
  getForFetching = fetcher;
}

export function createInstance(fetcher) {
  return function(...args) {
    return withFetching(fetcher, ...args);
  }
}

export default function(...args) {
  return withFetching(getForFetching, ...args);
};
