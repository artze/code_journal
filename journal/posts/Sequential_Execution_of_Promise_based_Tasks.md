---
title: Sequential Execution of Promise based Tasks
description: Execute Promise based tasks sequentially, one after another.
tags: ['javascript', 'design pattern']
timestamp: 1551421271000
---

## Sequential Execution of Promise based Tasks

Execute an array of promises in sequence, one after another:

```js
let tasks = [
  /*promise-based tasks*/
];
let promise = Promise.resolve();
tasks.forEach(function (task) {
  promise = promise.then(function () {
    return task();
  });
});
promise.then(function () {
  // Do something after all tasks completed
});

// Alternative with reduce
let tasks = [
  /*promise-based tasks*/
];
let promise = tasks.reduce(function (prev, task) {
  return prev.then(function () {
    return task();
  });
}, Promise.resolve());
promise.then(function () {
  // Do something after all tasks completed
});
```

What’s happening:

- `Promise.resolve()` creates a promise that resolves without any conditions simply to begin the promise chain
- The `forEach` loop calls `then()` on the previous promise in each iteration to create a promise chain
- At the very end, the callback within the final `then()` function triggers when the last promise-based task completes.
