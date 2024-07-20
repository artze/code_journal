---
title: Object Spread vs Object Assign
description: Object Spread vs Object.assign() when extending an object
tags: ['javascript']
timestamp: 1706876677543
---

# Object Spread vs Object Assign

We can extend an object with either Object Spread operator or Object.assign():

```js
// With Object Spread
const sourceObj = { foo: 'bar' };
const extendedObj = {
  ...sourceObj,
  newProp: 'a',
};
```

```js
// With Object.assign()
const sourceObj = { foo: 'bar' };
const extendedObj = Object.assign(sourceObj, { newProp: 'a' });
```

There are subtle differences between the two approaches. See below.

## Object Prototypes

The spread operator will not copy the the source object’s prototype to the target object. This is outlined in more detail [here](https://stackoverflow.com/questions/32925460/object-spread-vs-object-assign/54300191#54300191).

Notable observations with Class instances and getters & setters:

```js
class Person {
  constructor(str) {
    this.str = str;
  }

  get str() {
    return this._str;
  }

  set str(str) {
    this._str = str;
  }

  greet() {
    return 'Hello';
  }
}

var p = new Person('abc');

var spreadObj = {
  ...p,
  newProp: 'a',
};

var assignedObj = Object.assign(p, { newProp: 'a' });

console.log(spreadObj);
/**
 * {
 *   _str: 'abc',
 *   newProp: 'a'
 * }
 *
 * Note that this is a plain object
 */

console.log(spreadObj.str);
/**
 * undefined
 */

console.log(spreadObj.greet());
/**
 * TypeError: spreadObj.greet is not a function
 */

console.log(assignedObj);
/**
 * Person {
 *   _str: 'abc',
 *   newProp: 'a'
 * }
 *
 * Note that this is instance of Person
 */

console.log(assignedObj.str);
/**
 * 'abc'
 */

console.log(assignedObj.greet());
/**
 * 'Hello'
 */
```

## Source Object Mutation

With the spread operator, a new literal object `extendedObj` is defined and the `sourceObj` remains untouched; `Object.assign()` mutates the `sourceObject`, and returns it.

```js
const sourceObj = { foo: 'bar' };
const extendedObj = {
  ...sourceObj,
  newProp: 'a',
};

console.log(sourceObj);
/**
 * {
 *   foo: 'bar'
 * }
 */
```

```js
const sourceObj = { foo: 'bar' };
const extendedObj = Object.assign(sourceObj, { newProp: 'a' });

console.log(sourceObj);
/**
 * {
 *   foo: 'bar',
 *   newProp: 'a'
 * }
 */
```

## Triggering `set`

`Object.assign()` triggers `set` while spread operator does not.

```js
const objectAssign = Object.assign(
  {
    set foo(val) {
      console.log(val);
    },
  },
  { foo: 1 }
);
// Logs "1"; objectAssign.foo is still the original setter

const spread = {
  set foo(val) {
    console.log(val);
  },
  ...{ foo: 1 },
};
// Nothing is logged; spread.foo is 1
```

## References

- [MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals)
