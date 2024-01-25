---
title: Javascript Object Prototype and Inheritance
description: Learning notes on object prototype and inheritance
tags: ['javascript']
timestamp: 1706175093442
---

# Javascript Object Prototype and Inheritance

This article outlines the important points from MDN's [Object Inheritance and prototype chain article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain) and other relevant observations.

## Prototype Chain

In an inheritance chain, objects are linked to each other through its _prototype_.

::: tip Note
The property of an object that points to its prototype is not called prototype. Its name is not standard, but in practice all browsers use `__proto__`. The standard way to access an object's prototype is the `Object.getPrototypeOf()` method.
:::

For the purpose of this article, we'll refer to an object's prototype with `__proto__`.

## Setting up Prototype Chains

### Function Constructor

Basic `Person` example:

```js
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  console.log(`Hello ${this.name}`);
};

const john = new Person('john');
john.greet(); // "Hello john"
```

The above is functionally equivalent to the following in ES6 Class syntax:

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    console.log(`Hello ${this.name}`);
  }
}
```

#### `prototype` and `__proto__`

Some important observations following the basic `Person` example above.

```js
john.__proto__
// Returns
{
  constructor: function Person(name) {...}
  greet: function greet() {...}
}

john.prototype
// Returns
undefined

Person.__proto__
// Returns
function() // The most basic function prototype that all functions have by default

Person.prototype
// Returns
{
  constructor: function Person(name) {...}
  greet: function greet() {...}
}
```

When an instance is created with `Person()`, the instance's `__proto__` property now points to the constructor's `prototype`. Note that `Person.prototype.constructor` is created by default and points to the constructor function itself.

+++

More examples:

```js
const ob = { foo: "bar" }
function func() {}

obj.prototype
// Returns
undefined

func.prototype
// Returns
{
  constructor: function func() {...}
}
```

The example above emphasizes that `prototype` property only exists for functions by default.

#### Prototypes Are Passed by Reference

```js
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  console.log(`Hello ${this.name}`);
};
Person.prototype.foo = 'bar';

var john = new Person('john');
john.greet(); // "Hello john"
console.log(john.foo); // "bar"

// Reassign prototype properties
Person.prototype.greet = function () {
  console.log('greet func overwritten');
};

Person.prototype.foo = 'foo overwritten';

john.greet(); // "greet func overwritten"
console.log(john.foo); // "foo overwritten"
```

#### Setting up Longer Inheritance Chains

```js
function Parent() {}
Parent.prototype.parentFunc = function () {
  console.log('parentFunc');
};

function Child() {}
Child.prototype.childFunc = function () {
  console.log('childFunc');
};

// Sets the `Child.prototype.__proto__` to `Parent.prototype`
Object.setPrototypeOf(Child.prototype, Parent.prototype);

const childInstance = new Child();
childInstance.parentFunc(); // "parentFunc"
childInstance.childFunc(); // "childFunc"

// The prototype chain of childInstance
{
  __proto__: {
    anotherFunc: function anotherFunc() {...},
    consturctor: function Child() {...},
    __proto__: {
      parentFunc: function parentFunc() {...},
      constructor: function Parent() {...},
      __proto__: ...
    }
  }
}
```

::: warning
`Object.setPrototypeOf` is not performant
:::

In ES6 Class terms, the above is functionally equivalent to

```js
class Parent {...}
class Child extends Parent {...}

const childInstance = new Child()
```

### `Object.create()`

```js
const parent = { parent: 'parent' };
// Points `child.__proto__` to `parent`
const child = Object.create(parent);
child.foo = 'bar';

// child object
{
  foo: 'bar',
  __proto__: {
    parent: 'parent',
  },
};

const grandchild = Object.create(child);
grandchild.foofoo = 'barbar';

// grandchild object
{
  foofoo: 'barbar',
  __proto__: {
    foo: 'bar',
    __proto__: {
      parent: 'parent'
    }
  }
}
```

## Usage with Typescript

If we define object inheritance _without_ ES6 Classes, Typescript intellisense and type checks for inherited properties do **NOT** work.

## Other links

- [MDN object prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes)
- [The Trouble with ES6 Classes](https://www.toptal.com/javascript/es6-class-chaos-keeps-js-developer-up)

<PostDate />
<PageTags />
