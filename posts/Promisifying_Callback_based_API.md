---
title: Promisifying Callback based API
description: Adding Promise interface to callback based API
tags: ['javascript', 'nodejs']
timestamp: 1551412823000
---

## Promisifying Callback based API

Convert callback-based APIs to promise-based API:

```js
// A wrapper for callback-based API that returns a function which uses promises

function promisify(callbackBasedAPI) {
  return function promisfiedApi() {
    const args = [].slice.call(arguments);
    return new Promise(function(resolve, reject) {
      args.push(function(err, result) {
        if(err) {
          return reject(err) 
        }
        if(arguments.length <= 2) {
          resolve(result); 
        } else {
          resolve([].slice.call(arguments, 1)); 
        }
      })
      callbackBasedApi.apply(null, args)
    })
  }
}

// Usage:
const promiseBasedApi = promisify(callbackBasedApi)
```

What’s happening:

* `[].slice.call(arguments)` is required as `arguments` is an array-like object that does NOT inherit most array methods like slice
* The function pushes a special callback as the last argument. The callback simply rejects promise if an error is present. Otherwise, the callback resolves promise either with a single result or an array of results. (note that the `arguments` within callback refers to the parameters passed into callback, e.g. `err`, `result`)
* `callbackBasedApi` is called with the argument list that was built earlier

<PostDate />
<PageTags />
