---
title: JSDoc Cheatsheet
description: A JSDoc Cheatsheet
tags: ['jsdoc']
timestamp: 1558948306000
---

## JSDoc Cheatsheet

Defining custom Object types

```js
/**
 * @typedef {Object} CustomObjectName
 * @property {string} device_id
 * @property {number} field1
 * @property {string} field2
 * @property {string} [optionalField3]
 * @property {function(string, boolean): number} aMethod - a method that takes string and boolean as parameters and returns a number
 */
```

Importing object types from another file

```js
// object definition file (objectTypes.js)
/**
 * @typedef {Object} CustomObjectName
 * @property {string} device_id
 * @property {number} field1
 * @property {string} field2
 * @property {string} [optionalField3]
 */

// module.exports an empty object to enable importing to work on another file.
module.exports = {};

// Object type consuming file
/**
 * @param {import('./objectTypes').CustomObjectName} aThing
 */
function something(aThing) {}
```

Limit string values

```js
// The following limits string values to either 'abc', 'def', 'ghi'
/**
 * @param {('abc' | 'def' | 'ghi' )} aThing
 */
function something(aThing) {}
```
