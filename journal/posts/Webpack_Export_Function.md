---
title: Webpack Export Function
description: Export function for production from webpack.config.js
tags: ['javascript', 'webpack']
timestamp: 1550380270000
---

## Webpack Export Function

There is an option for webpack.config.js to export a function rather than an object:

```js
module.exports = (env) => {
  const isProduction = env === 'production';
  ...
  // usage example
  devtool: isProduction ? 'source-map': 'cheap-module-eval-source-map'
  ...
}
```

Run webpack -p --env production to build files for production. It is necessary to use the --env production option to allow the env argument (within webpack.config.js) to work
