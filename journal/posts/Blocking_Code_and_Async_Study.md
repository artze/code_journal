---
title: Blocking Code and Async Study
description: A study on blocking code with async/await and process.nextTick
tags: ['javascript', 'nodejs']
timestamp: 1622299163094
---

# Blocking Code and Async Study
::: warning WIP
This post is a work in progress.
:::

Program set up:
```js
// PROGRAM SET UP

// Blocking code
function sleep(miliseconds) {
  var start = new Date().getTime();
  var expire = start + miliseconds
  while(new Date().getTime() < expire) {
  }
}

// Timeout function to simulate actual ASYNC function that is wrapped in promise
function timeoutPromise() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve()
    }, 0)
  })
}

// Program execution
console.log('Main context start')
asyncOperation()
  .then(() => {
    console.log('asyncOperation end')
  })
console.log('Main context end')
```

## Observation
We will observe how the program behaves in each of the cases below

**Case 1**
```js
// Different scenarios for asyncOperation()
// ============== CASE 1 ============== //
async function asyncOperation() {
  timeoutPromise()
  sleep(5000)
  console.log('sleep completed')
}

// RESULT:
// 'Main context start'
// AFTER 5 SECONDS
// 'sleep completed'
// 'Main context end'
// 'asyncOperation end'
```
1. The `timeoutPromise` async task yields the thread to the rest of _asyncOperation_.
2. Then the blocking code triggers, followed by the rest of the code.
3. Why is 'asyncOperation end' printed at the very end? Because promise callbacks are deferred or invoked _asynchronously_. Within the internal Promise implementation, this can be achieved by:

```js
setTimeout(() => {
  // invoke promise onFulfilled callbacks
}, 0)
```

See example implementation [here](https://www.promisejs.org/implementing) following Promises/A+ spec.

+++

**Case 2**
```js
// ============== CASE 2 ============== //
async function asyncOperation() {
  await timeoutPromise()
  sleep(5000)
  console.log('sleep completed')
}

// RESULT:
// 'Main context start'
// 'Main context end'
// AFTER 5 SECONDS
// 'sleep completed'
// 'asyncOperation end'
```
1. `await timeoutPromise` yields thread to the _main context_. After the task to print 'main context end' is completed, the thread comes back for the rest of `asyncOperation()`

2. The blocking code triggers and after that prints 'sleep completed' and 'asyncOperation end'

Another way to look at this is to remove the `async/await` synctactic sugar and go back to promises:
```js
function asyncOperation() {
  return new Promise((resolve) => {
    timeoutPromise().then(() => {
      sleep(5000);
      console.log('sleep completed');
      resolve();
    })
  })
}
```

When `asyncOperation()` is triggered, the code simply marches on to print 'main context end' because all `asyncOperation` tasks are callbacks that will be triggered after `timeoutPromise` finishes.

`asyncOperation end` gets called last because resolve() is only called after `sleep(5000)` is completed

+++

**Case 3**
```js
// ============== CASE 3 ============== //
async function asyncOperation() {
  timeoutPromise()
  process.nextTick(function() {
    sleep(5000)
    console.log('sleep completed')
  })
}

// RESULT:
// 'Main context start'
// 'Main context end'
// AFTER 5 SECONDS
// 'sleep completed'
// 'asyncOperation end'
```

+++

**Case 4**
```js
// ============== CASE 4 ============== //
async function asyncOperation() {
  await timeoutPromise()
  process.nextTick(function() {
    sleep(5000)
    console.log('sleep completed')
  })
}

// RESULT:
// 'Main context start'
// 'Main context end'
// 'asyncOperation end'
// AFTER 5 SECONDS
// 'sleep completed'
```

<PostDate />
<PageTags />
