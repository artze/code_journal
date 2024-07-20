---
title: Promise All
description: promise.all() basics
tags: ['javascript']
timestamp: 1541726565000
---

## Promise All

Useful when you want to aggregate multiple promises results, and return them all as a result only when all promises resolve successfully.

Let’s say you have a Backend API with 5 Sequelize database queries (each of which returns promises by default) that returns all 5 results as a response to the client. A response 200 will only be given if all 5 queries resolve successfully.

```js
let promises = [query1(), query2(), query3(), query4(), query5()]
Promises.all(promises)
  .then(function(result)) {
    // result here will be an array of results in the same order as promises arr
    res.status(200).json(result);
  }
```
