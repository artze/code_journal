---
title: Expose API with Promises and Optional Callback Feature
description: API pattern that exposes both Promises and Callback interfaces
tags: ['javascript', 'design pattern']
timestamp: 1551690669000
---

## Expose API with Promises and Optional Callback Feature

The API pattern below allows users to use it as a promise or as a callback-based API (if an optional callback argument is passed in):

```js
function asyncFn(arg1, arg2, callback) {
  return new Promise(function(resolve, reject) {
    // When error occurs
    if(someError) {
      const err = new Error('Invalid input')
      if(callback) {
        callback(err)
      }
      return reject(err)
    }
    
    // No error
    if(callback) {
      callback(null, result); 
    }
    resolve(result);
  })
}
```

Some notes:
* The async API checks presence of callback function before calling it
* A promise is always created and completed regardless if users opt for the callback option.

<PostDate />
<PageTags />
