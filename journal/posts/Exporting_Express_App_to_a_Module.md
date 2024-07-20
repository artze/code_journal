---
title: Exporting Express App to a Module
description: Exporting Express app from application entry point
tags: ['design pattern', 'nodejs']
timestamp: 1538580131000
---

## Exporting Express App to a Module

The following pattern is useful when you have a module that requires the main app express variable:

```js
// app.js file
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = (module.exports = express());

// someModule.js
const app = require('../path/to/app.js');
someFunction(app);
```
