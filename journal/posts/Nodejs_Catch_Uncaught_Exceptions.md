---
title: Nodejs Catch Uncaught Exceptions
description: Catching uncaught exceptions in nodejs
tags: ['nodejs']
timestamp: 1548141672000
---

## Nodejs Catch Uncaught Exceptions

Log any uncaught exceptions:

```js
process.on('uncaughtException', function(err){
  console.error('Uncaught Exception: ' + err);
  process.exit(1)
})
```

It’s important to understand that an uncaught exception leaves the application in a state that is not guaranteed to be consistent, which can lead to unforeseeable problems. That’s why it is always advised, especially in production, to exit anyway from the application after an uncaught exception is received.

