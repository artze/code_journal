---
title: EventEmitter Pattern
description: EventEmitter pattern and typical gotchas
tags: ['nodejs']
timestamp: 1548123671000
---

## EventEmitter Pattern

Some notes on the EventEmitter pattern and its workings.

A contrived example:

```js
function logWhenSuccessful() {
  someOperation().on('SUCCESS', function () {
    console.log('Operation was successful');
  });
}

function someOperation() {
  let emitter = new EventEmitter();
  emitter.emit('SUCCESS');
  return emitter; // this is to allow chaining with 'on'
}

logWhenSuccessful();
```

The idea is that when `someOperation()` is invoked, it emits a `SUCCESS` event, which _should_ in turn trigger the callback with `console.log`, but it **does not work**.

The reason is that the entire script is ran synchronously. When `someOperation` is called, it emits the `SUCCESS` event before the listener `.on('SUCCESS'...)` could be registered. Conceptually, this would work if `someOperation` were an asynchronous function: when `someOperation` is called, it would be delegated to background processes and would pass the execution control back to `logWhenSuccessful`, which would immediately register a `SUCCESS` event listener. When the asynchronous `someOperation` completes, it would emit the event and would work as expected.

### EventEmitter in Asynchronous Scenario

The asynchronous scenario could be simulated with the following:

```js
function logWhenSuccessful() {
  someOperation().on('SUCCESS', function () {
    console.log('Operation was successful');
  });
}

function someOperation() {
  let emitter = new EventEmitter();
  process.nextTick(function () {
    emitter.emit('SUCCESS');
  });
  return emitter;
}

logWhenSuccessful();
```

`process.nextTick()` defers the execution of `emitter.emit` until the next pass of the event loop, thus allowing the listener to be registered first, before event emitting occurs.

### EventEmitter Class Pattern

A perhaps cleaner alternative is to have `someOperation` extend directly from EventEmitter. This allows an instance of `someOperation` to register listeners first _before_ calling any functions:

```js
class SomeOperation extends EventEmitter {
  executeOperation() {
    this.emit('SUCCESS');
  }
}

function logWhenSuccessful() {
  let someOperation = new SomeOperation();
  someOperation.on('SUCCESS', function () {
    console.log('Operation was successful');
  });
  someOperation.executeOperation();
}

lowWhenSuccessful();
```
