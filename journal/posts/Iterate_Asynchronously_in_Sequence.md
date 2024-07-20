---
title: Iterate Asynchronously in Sequence
description: Pattern that iterates through an array of tasks and runs them asynchronously and in sequence
tags: ['javascript', 'design pattern']
timestamp: 1548764460000
---

## Iterate Asynchronously in Sequence

```js
const tasks = []; // array of async tasks

function iterate(index) {
  if (index === tasks.length) {
    return finish();
  }

  const task = tasks[index];
  task(function () {
    // async callback: will execute when async task completes
    iterate(index + 1);
  });
}

function finish() {
  // iteration completed
}

iterate(0); // initiate series of async task execution
```
