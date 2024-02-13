---
title: ES6 Generators
description: Introduction to ES6 generators and possible design patterns
tags: ['javascript', 'design pattern']
timestamp: 1551673271000
---

# ES6 Generators

A generator is a function that can be paused at specific points and resumed at a later time.

Basic syntax:

```js
function* makeGenerator() {
  console.log('do something');
  yield 'A result';
  console.log('Resume to end');
}
```

Some notes:

- The asterisk after the function keyword makes it a generator
- The `yield` keyword marks where a function would pause and return execution control to its _caller_.

The `makeGenerator()` function is essentially a factory that creates instances of generators. These generator objects have a method `next()` which initiates the execution of the code block in the generator or resumes execution from the point it was paused.

The `next()` method returns an object:

```
{
  value: <yield return value>
  done: <boolean. True if execution reached the end of>
}
```

Example:

```js
function* animalGenerator() {
  console.log('begin');
  yield 'Hyena';
  var temp = yield 'Tortoise';
  return 'Magpie';
}
const animalGeneratorObj = animalGenerator();
console.log(animalGeneratorObj.next()); // [1] see below
console.log(animalGeneratorObj.next()); // [2] see below
console.log(animalGeneratorObj.next('abc')); // [3] see below
```

Example notes:

1. `next()` is invoked the first time and initiates the generator code block. `console.log('begin')` triggers, and terminates at the first yield statement. This `next()` method returns:

```
{
  value: 'Hyena',
  done: false
}
```

2. The second `next()` invocation triggers code execution from the previous yield statement to the next one (before the temp var assignment is made). This `next()` method returns:

```
{
  value: 'Tortoise'
  done: false
}
```

3. The third `next()` invocation resumes code execution, this time with an argument. Calling `next()` with an argument allows the caller to pass a value to the generator. Here, the value abc is passed into the generator and becomes the return value of the previous yield statement, thus assigning temp with ‘abc’. Code executes till the end. This time `next()` returns:

```
{
  value: 'Magpie',
  done: true
}
```

## Generators as Iterators

```js
function* iteratorGenerator(arr) {
  for (let i = 0; i < arr.legth; i++) {
    yield arr[i];
  }
}

const iterator = iteratorGenerator(['abc', 'def', 'ghi', 'jkl']);
let currentItem = iterator.next();
while (!currentItem.done) {
  console.log(currentItem.value);
  currentItem = iterator.next();
}
```

## Managing Async Control Flow with Generators

```js
function asyncFlow(generatorFunction) {
  function callback(err) {
    if (err) {
      return generator.throw(err);
    }

    const results = [].slice.call(arguments, 1);
    generator.next(results.length > 1 ? results : results[0]);
  }

  const generator = generatorFunction(callback);
  generator.next();
}

// Example usage to clone a file:
const fs = require('fs');
const path = require('path');

asyncFlow(function* (callback) {
  const fileName = path.basename(__filename);
  const myself = yield fs.readFile(fileName, 'utf8', callback);
  yield fs.writeFile(`clone_of_${filename}`, myself, callback);
  console.log('Clone created');
});
```

What’s happening here:

- `asyncFlow()` first initializes generator and invokes it by calling `next()`
- Each async operation is preceded by a `yield` statement which pauses execution of generator. When async operation is complete, the callback invocation triggers `next()` and resumes the execution of generator.

## Useful Resources

- [David Walsh blog post](https://davidwalsh.name/es6-generators)

<PostDate />
<PageTags />
