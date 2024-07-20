---
title: EventEmitter Pattern with React
description: Emtting and Listening to Events between Components
tags: ['react']
timestamp: 1579755098750
---

## EventEmitter Pattern with React

A simple EventEmmiter class module:

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, callback) {
    if (!Object.prototype.hasOwnProperty.call(this.events, type)) {
      this.events[type] = [];
    }

    this.events[type].push(callback);
  }

  emit(type, payload) {
    if (this.events[type]) {
      this.events[type].forEach((callback) => {
        callback(payload);
      });
    }
  }

  once() {
    // Feature we can implement to activate listener callback only on the
    // first emit of a specific type
  }
}

export { EventEmitter };
```

Say we have a parent component that emits events, and a child component that listens to this event and performs an action

Parent component:

```js
class ParentComponent extends Component {
  state = {}

  // Instantiate eventEmitter in instance variable to ensure that
  // each component load works with an eventEmitter in a fresh state,
  // i.e. events registered in the past would be cleared
  eventEmitter = new EventEmitter()

  render() {
    return (
      <div>
        <ChildComponent
          eventEmitter={this.eventEmitter}
        />
        <button
          onClick={() => {this.eventEmitter.emit("myEvent", payloadObj)}}
        />
          Emit
        </button>
      </div>
    )
  }
}
```

Child Component:

```js
class ChildComponent extends Component {
  state = {}

  myEventCallback = (payload) => {
    console.log("myEvent", payload)
  }

  registerEventListeners = () => {
    const eventEmitter = this.props.eventEmitter;
    eventEmitter.on("myEvent", this.myEventCallback.bind(this, payload))
  }

  componentDidMount() => {
    this.registerEventListeners();
  }
}
```
