---
title: Iterate Asynchornously in Parallel
description: Pattern that iterates through array of tasks and runs them asynchronously and in parallel
tags: ['javascript', 'design pattern']
timestamp: 1548750060000
---

## Iterate Asynchronously in Parallel

```js
// Run a set of asynchronous tasks in parallel by spawning them all at once,
// and then wait for all of them to complete by counting the number of times
// their callbacks are invoked.

const tasks = []; // array of async tasks

let completed = 0;
tasks.forEach(function (task) {
  task(function () {
    // async callback: will execute when async task completes

    // if all tasks are completed, call finish()
    if (++completed === tasks.length) {
      finish();
    }
  });
});

function finish() {
  // all tasks completed
}
```
