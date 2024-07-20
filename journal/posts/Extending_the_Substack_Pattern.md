---
title: Extending the Substack Pattern
description: An extensible pattern to export modules in nodejs
tags: ['nodejs']
timestamp: 1548145272000
---

## Extending the Substack Pattern

Consider a common module.exports pattern below:

```js
module.exports = function(message) {
  console.log('info: ' + message);
};
```

A possible extension of this pattern is using the exported function as namespace for other public APIs. This is a very powerful combination, because it still gives the module the clarity of a single entry point (the main exported function), but it also allows us to expose other functionalities that have secondary or more advanced use cases.

Extending the Substack Pattern:

```js
module.exports.verbose = function(message) {
  console.log('verbose: ' + message);
};
```

Usage example:

```js
var logger = require('./logger');
logger('This is an informational message');
logger.verbose('This is a verbose message');
```

This pattern is great to give emphasis on a single functionality whilst still providing secondary features that are less visible.

