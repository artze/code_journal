module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "plugin:vue/recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "prettier/vue"
  ],
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
    "prettier/prettier": ["error", {
      "tabWidth": 2,
      "singleQuote": true,
      "arrowParens": "always"
    }]
  }
};