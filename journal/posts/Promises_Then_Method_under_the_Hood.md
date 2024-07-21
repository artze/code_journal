---
title: Promises Then Method under the Hood
description: Internal workings of then() method
tags: ['javascript']
timestamp: 1550980823000
---

## Promises Then Method under the Hood

Behind the scenes, .then() function returns a Promise.

```js
asyncFn()
  .then(function (result) {
    // do something with result
  })
  .catch(function (err) {
    // do something with error
  });
```

What’s happening in a success case:

- `asyncFn` completes and triggers `.then()`. Because it is a success case (promised resolved), the anonymous function within `.then()` is invoked.
- `.then()` returns a Promise that inherits the fulfillment value result and proceeds to trigger `.catch()`
- Because there is no error ( `rejected()` was never called), the error handler is not invoked. A Promise is still returned at the end, but nothing is done with it.

What’s happneing in an error case:

- `asyncFn` completes and triggers `.then()`. The success handler is ignored because it is a failure case.
- `.then()` returns a Promise that inherits the rejected value (error) and proceeds to trigger `.catch()`
- With a rejection value present, error handler is invoked. A Promise is returned at the end and nothing is done with it.

This characteristic allows for a few useful patterns:

### Promise chaining

```js
asyncFn()
  .then(function(result1) {
    return anotherAsyncFn()
  .then(function(result2) {
    // do something
  .catch(function(err) {
    // do something with err
  })
```

This pattern works well when we want to trigger a series of async functions sequentially without creating too much nesting. Errors that occur at any level of the chain will eventually trigger the final `catch()` block as each `.then()` function will trigger and return a Promise that inherits the error.

### Throwing Errors

```js
asyncFn() {
  .then(function(result) {
    if(something) {
      throw new Error('Error msg')
    }
  })
  .catch(function(err) {
    // do something with error
  })
```

Throwing an error in the `.then()` block will trigger the error handler within the `catch()` block. With an error thrown, the `.then()` method will return a Promise that inherits the error, and trigger the error handler within the `catch()` block.
