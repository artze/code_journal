---
title: Promises as a Convenience Structure for Async Code
description: Demonstration that Promises only provides a syntactic structure and does not make code run asynchronously
tags: ['javascript']
timestamp: 1559358706000
---

## Promises as a Convenience Structure for Async Code

Reminder: Promise provides a convenient way to structure our async code, but *does not* make our code run asynchronously. A blocking code wrapped with promises is still blocking code.

```js
// =======SYNC OPERATION======== //

// sleeps for 5 seconds
function blockingCode() {
  var start = new Date().getTime();
  var expire = start + 5000
  while(new Date().getTime() < expire) {
  }
}

function blockingCodeWithPromise() {
  return new Promise((resolve, reject) => {
      blockingCode()
      resolve('done')
  })
}

console.log('Main context start')

blockingCodeWithPromise()
  .then((result) => console.log(result))

console.log('Main context end')

// RESULT
// 'Main context end' is printed with a 5 SECONDS delay
// i.e. Blocking code is blocking the main context 


// =======ASYNC OPERATION======== //

// sleeps for 5 seconds
function blockingCode() {
  var start = new Date().getTime();
  var expire = start + 5000
  while(new Date().getTime() < expire) {
  }
}

function blockingCodeWithPromise() {
  return new Promise((resolve, reject) => {
      process.nextTick(() => {
          blockingCode()
          resolve('done')
      })
  })
}

console.log('Main context start')

blockingCodeWithPromise()
    .then((result) => console.log(result))

console.log('Main context end')

// RESULT
// 'Main context end' is printed immediately without delay
// i.e. Blocking code is run asynchronously without blocking the main context
```
