---
title: Throwing Errors in Async Context
description: Using callback patterns to pass errors in Async Context in Nodejs
tags: ['nodejs']
timestamp: 1548148872000
---

## Throwing Errors in Async Context

A typical gotcha in throwing Errors within an Async function

```js
function asyncFunction() {
  setTimeout(function () {
    throw new Error();
  }, 1000);
}

try {
  asyncFunction();
} catch (e) {
  console.log('error occurred');
}
```

The above will **not** work because the async callback is not executed in the same context as the try...catch block.

In async contexts, it might be better to use the _callback_ pattern, passing any errors as the first argument in callback:

```js
function asyncFunction(callback) {
  setTimeout(function () {
    callback(new Error());
  }, 2000);
}

asyncFunction(function (err, data) {
  if (err) {
    console.log('error occurred');
    return;
  }
  console.log(data);
});
```
