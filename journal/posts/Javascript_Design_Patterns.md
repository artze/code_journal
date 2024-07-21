---
title: Javascript Design Patterns
description: A guide through 10 design patterns
tags: ['design pattern', 'javascript']
timestamp: 1562901663426
---

# Javascript Design Patterns

[[toc]]

## Factory Pattern

- Allows us to separate the object creation logic from its implementation. Consumer of factory is totally agnostic about how the instace is created.
- Factory allows us to keep constructors (or classes) of objects private, and prevents them from being extended or modified - thus adhering to the concept of _small surface area_
- The following example gives us better:
  - **Flexibility**. The factory method prevents us from binding our implementation with one particular type of object (as oppposed to using `new` operator in implementation)
  - **Control**. An exception can be thrown when something unexpected happens.

```js
function createImage(name) {
  if (name.match(/\.jpeg$/)) {
    return new JpegImage(name);
  } else if (name.match(/\.gif$/)) {
    return new GifImage(name);
  } else if (name.match(/\.png$/)) {
    return new PngImage(name);
  } else {
    throw new Exception('Unsupported format');
  }
}
```

### Enforcing Encapsulation

Encapsulation refers to the technique of controlling access to some internal details of an object by preventing external code from manipulating them directly (i.e. making _private_ variables in OOP jargon). The interaction with these details happens only through its public interface.

As we can't declare _private_ variables in JavaScript, we could implement encapsulation through function scopes and closures:

```js
function createPerson(name) {
  const privateProperties = {};

  const person = {
    setName: function () {
      if (!name) {
        throw new Error('A person must have a name');
      }
      privateProperties.name = name;
    },
    getName: function () {
      return privateProperties.name;
    },
  };

  person.setName(name);
  return person;
}
```

In the example above:

- The factory returns a `person` object containing public interfaces to external code.
- Internally, `privateProperties` object is created and is only accessible through the interface provided by the `person` object. This is possible thanks to the concept of _closures_.

An alternate approach in creating private variables recommended by Douglas Crockford: <http://crockford.com/javascript/private.html>

### Example Use Case

In this example we will create a simple code profiler that returns the execution time of code execution. It has two methods:

- `start()` method that triggers the start of profiling session
- `end()` method that termintates the session and log its execution time to the console

```js
class Profiler {
  constructor(label) {
    this.label = label;
    this.lastTime = null;
  }

  start() {
    this.lastTime = process.hrtime();
  }

  end() {
    const diff = process.hrtime(this.lastTime);
    console.log(
      `Timer ${this.label} took ${diff[0]} seconds and ${diff[1]} nanoseconds`,
    );
  }
}
```

In a real-world application, we might not want the `Profiler` to overcrowd the standard output in a production environment. So the `Profiler` would run as normal in a `development` environment, but is disabled in a `production` environment:

```js
function profiler(label) {
  if (process.NODE_ENV === 'development') {
    return new Profiler(label);
  } else if (process.NODE_ENV === 'production') {
    return {
      start: function () {},
      end: function () {},
    };
  } else {
    throw new Error('NODE_ENV must be set');
  }
}
```

The factory above very nicely abstracts the `Profiler` object creation logic from its consumer. One thing to highlight is that in the `production` case, an object literal (instead of a Profiler instance) with a similar interface signature is returned instead. This is an idea called **duck typing** - i.e. if it walks and quacks like a duck, it must be a duck. Because of its similar interface signature, the consuming code could run without errors, only that `start()` and `end()` methods would do nothing.

To complete the example, the following shows how `Profiler` might be used:

```js
function getRandomArray(len) {
  const p = profiler(`Generating an array with ${len} items`);
  p.start();
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(Math.random());
  }
  p.end();
}

getRandomArray(1e6);
```

### Composable Factory Functions

A Composable Factory Function is a type of factory function that can be composed together to build new enhanced factory functions. They allow us to construct objects that inherit behaviours from different sources without the need of building complex hierarchies.

This can be illustrated with an example. Say we want to build a game in which it has multiple characters, each of which has different behaviours. The behaviours include:

- Character: the base character that has a name, life points and current position.
- Mover: a character that is able to move
- Slasher: a character that is able to slash with sword
- Shooter: a character that is able to shoot (if he has bullets)

Based on their behaviours, we can build different characters:

- Runner: a character that can move
- Samurai: a character that can move and slash
- Sniper: a character that can shoot (but cannot move)
- Gunslinger: a character that can move and shoot
- Western Samurai: a character that can move, slash and shoot

To begin with Composable Factory Functions, we will use the `stampit` module. The module offers an interface for defining factor functions that can be composed together to build new factory functions.

The `Character` factory function:

```js
const stampit = require('stampit');

const character = stampit().props({
  name: 'anonymous',
  lifepoints: 100,
  x: 0,
  y: 0,
});
```

Usage example:

```js
const c = character();
c.name = 'John';
c.lifepoints = 20;
```

Similarly, we can create our `Mover` factory function:

```js
const mover = stampit().methods({
  move(xIncr, yIncr) {
    this.x += xIncr;
    this.y += yIncr;
    console.log(`${this.name} moved to [${this.x}, ${this.y}]`);
  },
});
```

Notice that we can access instance properties with `this` keyword from inside a method.

`Slasher` factory function:

```js
const slasher = stampit().methods({
  slash(direction) {
    console.log(`${this.name} slashed to the ${direction}`);
  },
});
```

`Shooter` factory function:

```js
const shooter = stampit()
  .props({
    bullets: 6,
  })
  .methods({
    shoot(direction) {
      if (this.bullets > 0) {
        --this.bullets;
        console.log(`${this.name} shot to the ${direction}`);
      }
    },
  });
```

Now that we have our base types defined based on behaviours, we can go on to compose them to create new factory functions for each _character_:

```js
const runner = stampit.compose(character, mover);
const samurai = stampit.compose(character, mover, slasher);
const sniper = stampit.compose(character, shooter);
const gunslinger = stampit.compose(character, mover, shooter);
const westernSamurai = stampit.compose(gunslinger, samurai);
```

`stampit.compose` defines a new Composed Factory Function that will produce an object based on the methods and properties of the composed factory functions. This is powerful as it allows us to reason in terms of _behaviours_ rather than in terms of classes.

Usage example:

```js
const yojimbo = westernSamurai();
yojimbo.name = 'Yojimbo';
yojimbo.move(3, 7);
yojimbo.slash('left');
yojimbo.shoot('right');
```

## Revealing Constructor Pattern

This pattern can be seen in the design of Promises:

```js
const promise = new Promise((resolve, reject) => {});
```

The Promise accepts a function as a constructor argument, the _executor function_. This function is called by the internal implementation of the Promise constructor and it is used to allow the constructing code to manipulate only a limited part of the internal state of the promise. It also serves as a mechanism to expose the `resolve` and `reject` methods to the constructing code (code that builds the object with `new` operator).

An additional advantage is that only the constructing code has access to `resolve` and `reject`. The newly created `promise` object can be passed around safely - no other code will be able to call `resolve` or `reject` and change the internal state of the promise.

In summary, this pattern involves:

- Passing a function as a _constructor argument_ that will be called within the internal implementation of the constructor class
- Exposing internal methods to the constructing code (e.g. `resolve` and `reject`). This is possible because during invocation of the executor function, the appropriate internal methods are passed in.

### Example Use Case

In this rather contrived example, we will try to create a read-only event emitter that is only able to emit events within the constructing code.

```js
const EventEmitter = require('EventEmitter');

class ReadOnlyEventEmitter extends EventEmitter {
  constructor(executor) {
    super();
    const emit = this.emit.bind(this);
    this.emit = undefined;
    executor(emit);
  }
}
```

What's happening here:

- We made a duplicate of the `emit` method and stored it in `emit`
- We remove the _instance_ method `emit` by assigning `undefined` to it
- Finally we pass in the `emit` function to the executor function. This allows us to be able to `emit` events only within the executor function

Using `ReadOnlyEventEmitter` to make a simple ticker

```js
const ticker = new ReadOnlyEventEmitter((emit) => {
  let tickCount = 0;
  setInterval(() => {
    emit('tick', tickCount++);
  }, 1000);
});

ticker.on('tick', (tickCount) => {
  console.log(tickCount, 'TICK(s)');
});

ticker.emit('tick', 'something'); // this will fail
```

In the example:

- The executor function (defined in constructing code) is passed into and invoked within the internal implementation of `ReadOnlyEventEmitter`
- An internal function `emit` is exposed to the constructing code

## Proxy Pattern

A proxy is an object that controls access to another object, called a **subject**. The proxy and the subject have identical interfaces, which allows us to swap one for the other. A proxy intercepts all or some of the operations that are meant to be executed on the subject, thus augmenting their behaviour.

A proxy is useful for:

- **Data validation**: The proxy validates input before forwarding to subject
- **Security**: The proxy verfifies that an action is authorized before passing to the subject
- **Caching**: The proxy keeps an internal cache so that the operations are executed on the subject only if the data is not yet present on the cache
- **Lazy initialization**: If the creation of the subject is expensive, the proxy can delay it to when it's really necessary
- **Logging**: The proxy intercepts the method invocations and the relative parameters, recording them as they happen
- **Remote objects**: A proxy can take an object that is located remotely, and make it appear local

It is important to note that in this case, we are _not_ proxying between classes. The proxy pattern involves wrapping actual _instances_ of the subject, thus preserving its state.

### Implementing Proxies with Object Composition

Composition is a technique whereby an object is combined with another object for the purpose of extending or using its functionality. In this case, a new object (proxy) with the same interface as the subject is created.

The following example shows a factory that creates a proxy:

```js
function createProxy(subject) {
  const subjectProto = Object.getPrototypeOf(subject);

  function Proxy(subject) {
    this.subject = subject;
  }

  Proxy.prototype = Object.create(subjectProto);

  // Proxied method
  Proxy.prototype.hello = function () {
    return this.subject.hello() + ' world';
  };

  // Delegated method
  Proxy.prototye.goodbye = function () {
    return this.subject.goodbye.apply(this.subject, args);
  };

  return new Proxy(subject);
}
```

To implement a proxy using composition, we have to intercept the methods we are intereseted in manipulating (`hello()`), while simply delegating the rest to the subject directly (`goodbye()`).

The example above shows a particular case where the subject has a prototype and we want to maintain the correct prototype chain (i.e. the case of classical inheritance). With this setup, `proxy instanceof Subject` will return `true`.

The alternate, more immediate approach without the use of inheritance, could look like the following:

```js
function createProxy(subject) {
  return {
    // Proxied method
    hello: () => subject.hello() + ' world',

    // Delegated method
    goodbye: () => subject.goodbye.apply(subject, args),
  };
}
```

As a sidenote, accomplishing the proxy pattern by means of Object Composition could be cumbersome as we have to manually delegate all methods even if we are only interested in proxying one of them. For this, an npm called `delegates` could be helpful.

#### Implementing Proxies with Object Augmentation

Object Augmentation or monkey patching consists of modifying the subject directly by replacing a method with its proxied implementation. Following the same example above, this approach would look like:

```js
function createProxy(subject) {
  const helloOrig = subject.hello;
  subject.hello = () => helloOrig.call(this) + ' world';

  return subject;
}
```

Modifying the subject directly may present some undesirable behaviours as further calls to `subject.hello()` (directly without proxying) would return the newly augmented behaviour.

### Example Use Case

In this example use case, we will create a proxy to a Writable stream that intercepts all calls to `write()` and logging a message every time this happens.

```js
function createWritableStreamProxy(writableOrig) {
  const proto = Object.getPrototypeOf(writableOrig);

  function WritableStreamProxy(writableOrig) {
    this.writableOrig = writableOrig;
  }

  WritableStreamProxy.prototype = proto;

  WritableStreamProxy.write = function (chunk, encoding, callback) {
    if (!callback && typeof encoding === 'function') {
      callback = encoding;
      encoding = undefined;
    }
    console.log('Writing ' + chunk);

    return this.writableOrig.write(chunk, encoding, function () {
      console.log('Finished writing', chunk);
      callback && callback();
    });
  };

  WritableStreamProxy.on = function () {
    return this.writableOrig.on.apply(this.writableOrig, args);
  };

  WritableStreamProxy.end = function () {
    return this.writableOrig.end.apply(this.writableOrig, args);
  };

  return new WritableStreamProxy(writableOrig);
}
```

What's happening here:

- We created a factory that returns a proxied version of the `writable` object passed in as argument
- The `write` method is proxied so that a message could be logged before the subject's `write` method is invoked
- Note that in such asynchronous cases, the proxying of callbacks is necessary as well
- The remaining methods `on` and `end` are simply delegated to the original `writable` object

For the sake of completion, the `WritableStreamProxy` could be used as follows:

```js
const writable = createWriteStream('test.txt');
const writableProxy = createWritableStreamProxy(writable);

writableProxy.write('First chunk');
writableProxy.write('Second chunk');
writable.write('This is not logged');
writableProxy.end();
```

### Other Forms of Proxying

The proxying pattern can also be referred to as **function hooking** or **Aspect Oriented Programming (AOC)**. In these cases, such implementations involving the setting of _pre-_ and _post-_ execution hooks for a specific methods. There are some libraries that could help facilitate this:

- `hooks`
- `hooker`
- `meld`

### ES2015 Proxy

ES2015 introduced a global object called Proxy. The Proxy API contains a `Proxy` constructor and accepts a `target` and `handler` as arguments.

```js
const proxy = new Proxy(target, handler);
```

The **target** refers to what we have been referring to as the subject of the proxy. The `handler` is a special object that defines the behaviour of the proxy. The `handler` object comes with a series of optional methods called **trap methods** (e.g. `get`, `set`, `apply`, `has`) that are automatically called when specific operations are performed on the proxy instance.

For example:

```js
const scientist = {
  name: 'nikola',
  surname: 'tesla'
}

const upperCaseScientist = new Proxy(scientist, {
  get: (target, prop) => target[prop].toUpperCase();
})

console.log(upperCaseScientist.name, upperCaseScientist.surname) // prints 'NIKOLA TESLA'
```

In the example, we are intercepting _all_ access to the properties of the `target` object, via the use of trap methods. It's important to note that the ES2015 Proxy API allows intercepting other characteristics of an object beyond just its methods.

Another example:

```js
const evenNumbers = new Proxy([], {
  get: (target, index) => index * 2,
  has: (target, number) => number % 2 === 0,
});

console.log(2 in evenNumbers); // true
console.log(5 in evenNumbers); // false
console.log(evenNumbers[7]); // 14
```

In the code above, we create a _virtual_ array with no data within. By using trap methods, we are able to intercept access to the array and make it appear to contain even numbers. The `get` method intercepts access to the array elements while the `has` method intercepts the usage of `in` operator to discern if the given numbers (should) exist in the array.

The Proxy API supports a number of other trap methods and can be found here: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy>

## Decorator Pattern

The Decorator Pattern is similar to the Proxy Pattern, but instaed of modifying _existing_ interfaces of an object, it augments the subject by adding _new_ functionalities.

### Implementing Decorator with Object Composition

The implementation is almost identical to Proxy with Object Composition, only that we are adding new methods rather than proxying existing methods:

```js
function decorate(component) {
  const proto = Object.getPrototypeOf(component);

  function Decorator(component) {
    this.component = component;
  }

  Decorator.prototype = Object.create(proto);

  // New method
  Decorator.prototype.greetings = function () {
    return 'Hi!';
  };

  // Delegated method
  Decorator.prototype.hello = function () {
    return this.component.hello.apply(this.component, args);
  };

  return new Decorator(component);
}
```

### Implementing Decorator with Object Augmentation

```js
function decorate(component) {
  // new method
  component.greetings = () => {
    return 'Hi!';
  };

  return component;
}
```

### Example Use Case

We will create a plugin for LevelUP database module using the Decorator Pattern, with the Object Augmentation technique. The plugin will have the feature of notifying us whenever an object with a user-specified pattern gets inserted into the database. For example if we specify a pattern `{a: 1}`, we will receive a notification when objects such as `{a: 1, b: 44}` or `{a: 1, c: 'x'}` are inserted into database.

```js
function levelSubscribe(db) {
  db.subscribe = (pattern, listener) => {
    db.on('put', (key, value) => {
      const match = Object.keys(pattern).every((k) => pattern[k] === value[k]);
      if (match) {
        listener(key, value);
      }
    });
  };

  return db;
}
```

Some notes:

- We decorated the db object (subject) with a new method `subscribe`
- The LevelUP module comes with a feature that emits a `put` event whenever there is a database insertion. The associated callback function is supplied with args `key` and `value`. Think of `key` as the id of document whilst `value` is the object inserted
- When there is a match in pattern, the listener supplied to `subscribe` method is called

Using `levelSubscribe`:

```js
const level = require('level');

let db = level(__dirname + '/db', { valueEncoding: 'json' });
db = levelSubscribe(db);

db.subscribe({ doctype: 'tweet', lang: 'en' }, (key, value) =>
  console.log(value),
);

db.put('1', { doctype: 'tweet', lang: 'en', text: 'Hello world!' }); // triggers notification
db.put('2', { doctype: 'company', lang: 'it', name: 'ACME Co.' }); // does not trigger notification
```

## Adapter Pattern

The Adapter Pattern allows us to access the functionality of an object using a different interface. This is again similar to the Proxy Pattern, but instead of retaining the same interface as the subject, it exposes a different interface.

### Example Use Case

We will attempt to build an Adapter around the LevelUP API, transforming it into an interface that is compatible with the core `fs` module. In particular, every call to `readFile()` and `writeFile()` will translate to `db.get()` and `db.put()`. This way, we could use the LevelUP database in place of existing `fs` implementations without making significant code changes.

```js
const path = require('path');

function createFsAdapter(db) {
  const fs = {};

  fs.readFile = (filename, options, callback) => {
    if(typeof options = 'function') {
      callback = options;
      options = {};
    } else if(typeof options = 'string') {
      options = { encoding: options };
    }

    db.get(
      path.resolve(filename),
      { valueEncoding: options.encoding },
      (err, value) => {
        if(err) {
          if(err.type === 'NotFoundError') {
            err = new Error(`ENOENT, open "${filename}"`);
            err.code = 'ENOENT';
            err.errno = 34;
            err.path = filename;
          }

          return callback && callback(err)
        }

        return callback && callback(null, value)
      }
    )
  }

  fs.writeFile = (filename, contents, options, callback) => {
    if(typeof options === 'function') {
      callback = options;
      options = {};
    } else if(typeof options === 'string') {
      options = { encoding: options };
    }

    db.put(
      path.resolve(filename),
      contents,
      { valueEncoding: options.encoding },
      callback
    )
  }

  return fs;
}
```

Note that `fs.readFile` and `fs.writeFile` are defined in a way that mimics the function signatures from the core `fs` module.

In any existing implementations of `fs` with `readFile` and `writeFile`, we could simply replace the `fs` module dependency with `const fs = createFsAdapter(db)`. With this, the transition from filesystem to LevelUP db can be done without causing any changes in results!

## Strategy Pattern

The Strategy pattern enables an object, called the _Context_ to support variations in logic by extracting the variable parts into separate, interchangeable objects, called Strategies. The Context is then able to adapt its behaviour by attaching different Strategies to it. The strategies are usually a family of solutions that address a similar problem, and they implement the same interface - one that is expected by the Context.

A rough example is a Context object called `Order`, in which has a method called `pay()`. To support different payment methods, we could:

- Use an `if...else` statement within the `pay()` method
- Delegate the logic of payment method to multiple strategies

The first solution will require modifications to the `Order` object to support new payment methods. By using strategies, the `Order` object can remain untouched as we add new strategies to support new payment methods.

### Example Use Case

Let's consider an object called `Config` that holds a set of configuration parameters. The object should:

- be able to provide a simple interface to access these parameters
- allow users to import and export the configuration using a file.
- support different formats, i.e. JSON, INI, YAML

```js
const fs = require('fs');
const objectPath = require('object-path');

class Config {
  constructor(strategy) {
    this.data = {};
    this.strategy = strategy;
  }

  get(path) {
    return objectPath.get(this.data, path);
  }

  set(path, value) {
    return objectPath.set(this.data, path, value);
  }

  read(file) {
    this.data = this.strategy.deserialize(fs.readFileSync(file, 'utf8'));
  }

  save(file) {
    fs.writeFileSync(file, this.strategy.serialize(this.data));
  }
}
```

`object-path` simply allows us to retrieve properties using dot notation:

```js
const obj = {
  a: {
    b: 123,
    c: 333,
  },
};

objectPath.get(obj, 'a.b');
// returns 123
```

Now we have that out of the way, it is clear that the implementation details of `serialize` and `deserialize` are delegated to strategies. As long as all strategies share the same interface and contain these methods, they can be plugged-in when `Config` is constructed.

The strategies might look like the following:

```js
const ini = require('ini');

strategies = {
  ini: {
    deserialize: (data) => ini.parse(data),
    serialize: (data) => ini.stringify(data),
  },
  json: {
    deserialize: (data) => JSON.parse(data),
    serialize: (data) => JSON.stringify(data),
  },
};
```

And the implementation:

```js
const jsonConfig = new Config(strategies.json);
jsonConfig.read('path/to/file.json');
jsonConfig.set('object.prop', 'new value');
jsonConfig.save('path/to/new_file.json');

const iniConfig = new Config(strategies.ini);
iniConfig.read('path/to/file.ini');
iniConfig.set('object.prop', 'new value');
iniConfig.save('path/to/new_file.ini');
```

Note that we defined only one `Config` class, which implements the common parts of our configuration manager. Changing the strategies allowed us to create different `Config` instances that support different file formats.

There are alternate approaches in arranging our strategies:

- We could group strategies in two families, one for deserialization and the other for serialization. This would enable us to read and save in different formats.
- We could select strategies dynamically based on file extentions. This would of course require an object that maps extensions to strategies.

The Strategy Pattern might appear in different forms too. In its simplest form, it can appear as functions - `function context(strategy) {...}`.

## State Pattern

State is a variation of the Strategy Pattern where the strategy changes depending on the state of the context. We have seen previously how a strategy can be selected, and once this selection is done, the strategy statys unchanged for the rest of the context's lifespan. Instead, in the State pattern, the strategy (also called _state_) is dynamic and can change during the context's lifetime.

Consider a hotel booking application that has a `Reservation` object and its 3 scenarios:

1. When the reservation is initially created, the user can `confirm()`. At this point, the user cannot `cancel()` because it's still not confirmed. However, the user could `delete()`.
2. Once the reservation is confirmed, the user could not `confirm()` again. It is possible to `cancel()` the reservation, but not possible to `delete()` a reservation because it needs to be kept as record.
3. On the day before the reservation date, it is not possible to `cancel()` the reservation as it is too late.

With the State Pattern, we could implement 3 strategies (or states), each representing a scenario above. The basic idea is that the `Reservation` context could easily switch between states, thus triggering the correct set of operations based on the current scenario.

The state transition can be initiated and controlled by the context object, by the client code or by the `State` objects themselves. The last option usually provides the best results in terms of flexibility and decoupling, as the context does not have to know about all the possible states and how to transition between them.

### Example Use Case

To demonstrate this pattern, we will implement a fail-safe client TCP socket that queues data sent during the time the server is offline, and tries to resend them once the server comes online. In this example, the fail-safe socket will be used by client machines to send resource utilization data at regular intervals.

```js
const OfflineState = require('./offlineState');
const OnlineState = require('./onlineState');

class FailSafeSocket {
  constructor(options) {
    this.options = options;
    this.queue = [];
    this.currentState = null;
    this.socket = null;
    this.states = {
      offline: new OfflineState(this),
      online: new OnlineState(this),
    };
    this.changeState('offline');
  }

  changeState(state) {
    this.currentState = this.states[state];
    this.currentState.activate();
  }

  send(data) {
    this.currentState.send(data);
  }
}

module.exports = (options) => {
  return new FailSafeSocket(options);
};
```

Notes:

- The `changeState()` method is responsible for transitioning between states. It calls `activate()` on the target state to launch any starter code in each state.
- The `send()` method simply delegates the operation to the currently active state, which adopts a different behaviour based on the online/offline state.

`offlineState.js` might look like:

```js
const jot = require('json-over-tcp');

class OfflineState {
  constructor(failSafeSocket) {
    this.failSafeSocket = failSafeSocket;
  }

  send(data) {
    this.failSafeSocket.queue.push(data);
  }

  activate() {
    const retry = () => {
      setTimeout(() => {
        this.activate();
      }, 500);
    };

    this.failSafeSocket.socket = jot.connect(
      this.failSafeSocket.options,
      () => {
        this.failSafeSocket.socket.removeListener('error', retry);
        this.failSafeSocket.changeState('online');
      },
    );

    this.failSafeSocket.socket.once('error', retry);
  }
}
```

Notes:

- Instead of using a raw TCP socket, we are using `json-over-tcp` to conveniently send json data over tcp.
- The `activate()` method simply tries to establish a connection every 500ms. It keeps trying until a connection is established, at which point the state of `failSafeSocket` changes to `online`.

`onlineState()`:

```js
class OnlineState {
  constructor(failSafeSocket) {
    this.failSafeSocket = failSafeSocket;
  }

  send(data) {
    this.failSafeSocket.socket.write(data);
  }

  activate() {
    this.failSafeSocket.queue.forEach((data) => {
      this.failSafeSocket.write(data);
    });
    this.failSafeSocket.queue = [];

    this.failSafeSocket.socket.once('error', () => {
      this.failSafeSocket.changeState('offline');
    });
  }
}
```

How it all comes together:

```js
const createFailSafeSocket = require('./failSafeSocket');
const failSafeSocket = createFailSafeSocket({ port: 5000 });

setInterval(() => {
  failSafeSocket.send(process.memoryUsage());
}, 1000);
```

## Template Pattern

The Template Pattern is almost identical to the Strategy Pattern. Instead of _composing_ the context and strategies together, the Template Pattern ties them together through classical inheritance. The parent class (or Template) would contain generic methods, while the child classes will have specific behaviours (or _template methods_).

Both Strategy and Template patterns allow us to change some parts of a context while reusing the common parts. The distinction is that Strategy allows us to do it _dynamically_ (and possibly at runtime), but with Template, the complete structure is determined the moment the child classes are defined. With this, the Template Pattern might be more suitable in situations where we want to create prepackaged variations of an algorithm.

### Example Use Case

We will re-use the same configuration manager example in the Strategy Pattern section.

```js
const fs = require('fs');
const objectPath = require('object-path');

class ConfigTemplate {
  read(file) {
    this.data = this._deserialize(fs.readFileSync(file, 'utf8'));
  }

  save(file) {
    fs.writeFileSync(file, this._serialize(this.data));
  }

  get(path) {
    return objectPath.get(this.data, path);
  }

  set(path, value) {
    return objectPath.set(this.data, path, value);
  }

  _serialize() {
    throw new Error('_serialize() must be implemented');
  }

  _deserialize() {
    throw new Error('_deserialize() must be implemented');
  }
}

class JsonConfig extends ConfigTemplate {
  _serialize(data) {
    return JSON.stringify(data);
  }

  _deserialize(data) {
    return JSON.parse(data);
  }
}
```

How the example might be used:

```js
const jsonConfig = new JsonConfig();
jsonConfig.read('path/to/file.json');
jsonConfig.set('prop', 'value');
jsonConfig.save('path/to/another/file.json');
```

Notes:

- In `ConfigTemplate`, we defined both `_serialize()` and `deserialze()` as stubs that throw an error if they are not overriden by children classes.
- Notice that a `ConfigTemplate` object is never created as it is simply an _Abstract Class_.

## Middleware Pattern

In the enterprise architecture jargon, 'middleware' represents the various software suites that help to abstract lower-level mechanisms, e.g. memory management, network communications. In the context of Nodejs Express, middleware are a set of functions that do just that - abstracting non-essential parts of the core application (authentication, compression/decompression etc.). The defining characteristic of middleware in the Express world is that they are organized as a processing pipeline, where a set of processing units, filters and handlers, in the form of functions, are connected to form an asynchronous sequence. This pattern is used well beyond the boundaries of Express and will be the focus of this section.

### Middleware Manager

The set up of this pattern involves a `Middleware Manager` which is responsible for organizing and executing the middleware functions. Its implementation details:

- New middleware can be registered by invoking the `use()` function. Usually new middleware are appended at the end of pipeline but this is not a strict rule.
- When new data is received for processing, the registered middleware is invoked in an asynchronous sequential execution flow. Each unit receives the result from the previous middleware.
- Each piece of middleware can decide to stop further processing of data by simply not invoking its callback or by passing an error to the callback. An error situation normally triggers the execution of another sequence of middleware dedicated for errors.

There is no strict rule on how the data is processed along the pipeline. Some strategies:

- Augmenting data with additional properties/functions.
- Replacing data with result of some kind of processing.
- Maintaining the immutability of data and always returning fresh copies

### Example Use Case

We will implement the middleware pattern for a message bus implementation called ZeroMQ. ZeroMQ is a lightweight messaging library that allows only strings and binary buffers for messages, so any encoding or custom formatting will have to be implemented manually. For this, we will implement a middleware infrastructure to encode/decode JSON messages before and after they get sent through the message bus.

The Middleware Manager:

```js
class ZmqMiddlewareManager {
  constructor(socket) {
    this.socket = socket;
    this.inboundMiddleware = [];
    this.outboundMiddleware = [];
    socket.on('message', (message) => {
      this.executeMiddleware(this.inboundMiddleware, {
        data: message,
      });
    });
  }

  send(data) {
    const message = { data: data };

    this.executeMiddleware(this.outboundMiddleware, message, () => {
      this.socket.send(message.data);
    });
  }

  use(middleware) {
    if (middleware.inbound) {
      this.inboundMiddleware.push(middleware.inbound);
    }
    if (middleware.outbound) {
      this.outboundMiddleware.unshift(middleware.outbound);
    }
  }

  executeMiddleware(middleware, arg, finish) {
    function iterator(index) {
      if (index === middleware.length) {
        return finish && finish();
      }

      middleware[index].call(this, arg, (err) => {
        if (err) {
          return console.log('There was an error: ' + err.message);
        }
        iterator.call(this, ++index);
      });
    }

    iterator.call(this, 0);
  }
}

module.exports = ZmqMiddlewareManager;
```

Some notes:

- In this scenario, each middleware comes in an inbound-outbound pair and are executed in inverted order. For example, we need to serialize messages, then compress it before sending it over the wire. On the receiving end, decompression needs to happen first before deserializing.
- `executeMiddleware()` uses a simple implementation of the asynchronous sequential iteration pattern. Each function in `middleware` array is executed one after another, and the _same_ `arg` object is passed to each middleware function. The `arg` object is mutated along the way as we will see next.

JSON Middleware:

```js
const json = () => {
  return {
    inbound: function(message, next) {
      message.data = JSON.parse(message.data.toString());
      next();
    }
    outbound: function(message, next) {
      message.data = new Buffer(JSON.stringify(message.data));
      next();
    }
  }
}

module.exports = { json };
```

Implementation on server side:

```js
const zmq = require('zmq');
const ZmqMiddlewareManager = require('./zmqMiddlewareManager');
const jsonMiddleware = require('./jsonMiddleware');

const reply = zmq.socket('rep');
reply.bind('tcp://127.0.0.1:5000');

const zmqm = new ZmqMiddlewareManager(reply);
zmqm.use(jsonMiddleware.json())
zmqm.use(() => {
  inbound: function(message, next) {
    console.log('Received: ', message.data);
    if(message.data.action === 'ping') {
      this.send({ action: 'pong', echo: message.data.echo });
    }
    next();
  }
})

```

Notes:

- A message handler is registered as a middleware to send a reply. Because the previous middleware has already deserialized the message, we could conveniently access the `message` object.
- Data passed to the `send` method, will be processed by the outbound middleware before going on the wire.
- Notice that the `inbound` and `outbound` methods are defined using the `function` keyword (rather than arrow functions). Arrow functions are bound to its lexical scope, which means that the value of `this` is the same as in the parent block and cannot be altered. In other words, if we use an arrow function, our middleware will not recognize `this` as an _instance_ of `ZmqMiddlewareManager`.

Implementation on client side:

```js
const zmq = require('zmq');
const ZmqMiddlewareManager = require('./zmqMiddlewareManager');
const jsonMiddleware = require('./jsonMiddleware');

const request = zmq.socket('req');
request.connect('tcp://127.0.0.1:5000');

const zmqm = new ZmqMiddlewareManager(request);
zmqm.use(jsonMiddleware.json());
zmqm.use({
  inbound: function (message, next) {
    console.log('Echoed back: ', message.data);
    next();
  },
});

setInterval(() => {
  zmqm.send({ action: 'ping', echo: Date.now() });
}, 1000);
```

## Command Pattern

This pattern seems unecessary at this point in time and will be covered later.
