---
title: Blocking Code and Async Study
description: A study on blocking code with async/await and process.nextTick
tags: ['javascript', 'nodejs']
timestamp: 1622299163094
---

# Blocking Code and Async Study
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

/**
 * Main context triggers asyncOperation(), does not wait,
 * and proceeds to print 'main context end'
 * 
 * 1. The 'await' keyword yields thread to the main context. 
 *    After the task to print 'main context end' is completed,
 *    the thread comes back for the rest of asyncOperation()
 *
 * 2. The blocking code triggers and only after that proceeds
 *    to march forward.
 */

/**
 * Another way to look at this is to remove the async/await
 * synctactic sugar and go back to promises
 *
 * The following is equivalent to the async function above.
 * When asyncOperation() is triggered, the code simply marches on because all
 * tasks are callbacks that will be triggered after timeoutPromise finishes.
 * This is why 'main context end' gets printed first, before the rest of 
 * asyncOperation() gets run.
 *
 * 'asyncOperation end' gets called last because resolve() is only called
 * after sleep(5000) is completed
 */

function asyncOperation() {
  return new Promise((resolve) => {
    timeoutPromise().then(() => {
      sleep(5000);
      console.log('sleep completed');
      resolve();
    })
  })
}


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
