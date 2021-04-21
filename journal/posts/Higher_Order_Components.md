---
title: Higher Order Components
description: Introduction to Higher Order Components
tags: ['javascript', 'reactjs']
timestamp: 1555214505000
---

## Higher Order Components

Higher order components are components that:

* render children components
* allow ‘render hijacking’ of children components (i.e. control rendering of children components)
* allow manipulation of props before being passed to children components

A simple example that displays Info component with boilerplate warning message:

```js
import React from 'react';
import ReactDOM from 'react-dom';

// Child component
const Info = (props) => (
  <div>
    <h1>Info Page</h1>
    <p>Info: {props.info}</p>
  </div>
)

// Wrapper function that encapsulates children components
const withAdminWarning = (WrappedComponent) => {
  return (props) => (
    <div>
      <p>These are private info. Please do not share</p>
      <WrappedComponent {...props} />
    </div>
  )
}

// Create higher order component by calling wrapper function
const AdminInfo = withAdminWarning(Info);

ReactDOM.render(<AdminInfo info="Secret data here" />, document.getElementById('root'));
```

Same example with render hijacking. Warning message and child component are rendered only when isAdmin = true:

```js
const Info = (props) => (
  <div>
    <h1>Info Page</h1>
    <p>Info: {props.info}</p>
  </div>
)

const withAdminWarning = (WrappedComponent) => {
  return (props) => (
    <div>
      { props.isAdmin && <p>These are private info. Please do not share</p> }
      { props.isAdmin ? (
        <WrappedComponent {...props} />
      ) : (
          <p>Forbidden</p>
        ) }
    </div>
  )
}

const AdminInfo = withAdminWarning(Info);

ReactDOM.render(<AdminInfo isAdmin={false} info="Secret data here" />, document.getElementById('root'));
```

<PostDate />
<PageTags />
