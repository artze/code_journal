---
title: Setup eslint on React App
description: Guide to setup eslint on react app
tags: ['eslint', 'react']
timestamp: 1574126374748
---

## Setup eslint on React App
1. Install `eslint` as devDependency
2. Install `eslint-plugin-react` as devDependency. This provides react specific rules. More here: https://github.com/yannickcr/eslint-plugin-react
3. Install `babel-eslint` as devDependency. This allows eslint to parse experimental ECMAScript features that are most likely used by react.

The result should look like this

```js
module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
    "plugins": [
      "react"
    ],
    "rules": {
    }
};

```
