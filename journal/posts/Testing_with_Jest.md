---
title: Testing with Jest
description: Advanced approaches in Jest testing
tags: ['jest', 'testing']
timestamp: 1622285996335
---

# Testing with Jest

[[toc]]

## Selective Auto-mocking
Let's say we have a `utilModule` that looks like the following.
- The `utilFunction` is core to the functionality of the app and we want to maintain its behavior throughout our tests.
- `callThirdPartyApi` involves a http call to a third-party service. This is a method we want to mock to ease our automated tests.

```js
export const utilModule = {
  utilFunction() {
    /**
     * a util function that is necessary for the app to work
     */
  }

  callThirdPartyApi() {
    /**
     * a http call to a third party
     */
  }
}
```

+++

We could auto-mock with the following:
```js
jest.mock("aModule")
```
This will mock the entire module and replace all method implementations with `jest.fn()`. This isn't what we want, cause the original behavior of `utilFunciton` is lost.

+++

To solve this, we can set up jest auto-mock to retain selected functionalities:
```js
jest.mock("aModule", () => {
  const originalModule = jest.requireActual("aModule");
  return {
    ...originalModule,
    callThirdPartyApi: jest.fn()
  }
})
```

## Mock Class Methods
In this example, we want to mock `methodToMock` but retain the behavior of `utilFunction`. The _instance_ method `methodToMock` is called within the app and we want jest to mock its implementation to return a specific result.
```js
class SomeClass {
  methodToMock() {}
}

export const moduleA = {
  SomeClass,
  utilFunction() {}
}
```

Using [selective auto-mocking](#selective-auto-mocking), we can preserve `utilFunction`. What we can do to mock instance class methods:
```js
import { SomeClass } from "aModule";
import { mocked } from "ts-jest/utils";

jest.mock("aModule", () => {
  const originalModule = jest.requireActual("aModule");
  return {
    ...originalModule,
    SomeClass: jest.fn()
  }
})

const mockedSomeClass = mocked(SomeClass, true)

// mock return value of class instance method
mockedSomeClass.prototype.methodToMock = jest.fn().mockReturnValue('return me')
```
