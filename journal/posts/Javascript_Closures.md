---
title: Javascript Closures
description: Learning notes and examples
tags: ['javascript']
timestamp: 1501545600000
---

# Javascript Closures

```js
function greet(whattosay) {
  return function (name) {
    console.log(whattosay + ' ' + name);
  };
}

var sayHi = greet('Hi');
sayHi('Tony');
```

`sayHi('Tony')` will produce 'Hi Tony' on the console. No problem with the code at all.

How does it work? The execution context of `function greet(whattosay){}` is finished and popped off the stack once `var sayHi = greet('Hi')` is done. BUT the variable 'whattosay' declared within this context still persists even after its execution context has ceased. This is part of the js engine feature, which allows variables to be accessible even after their execution contexts have ended.

+++

```js
function buildFunctions() {
  var arr = [];
  for (var i = 0; i < 3; i++) {
    arr.push(function () {
      console.log(i);
    });
  }
  return arr;
}

var fs = buildFunctions();
fs[0]();
fs[1]();
fs[2]();
```

Each function call within fs array will print the value 3. During each function invocation, it will look for `var i` from the for loop’s execution context. The variable still persists even after the for loop has come to an end, thanks to closures. At this point in time, `var i` holds the value of 3 (at the end of loop).

```js
function buildFunctions2() {
  var arr = [];
  for (var i = 0; i < 3; i++) {
    arr.push(
      (function (j) {
        return function () {
          console.log(j);
        };
      })(i)
    );
  }
  return arr;
}

var fs2 = buildFunctions2();
fs2[0]();
fs2[1]();
fs2[2]();
```

The code above prints 0, 1, 2 in order. Variable persistence from closures is still present here, only difference is that each `function() {console.log(j)}` will now look for `var j` in its respective parent execution context created by the for loop, each holding a distinct value for `var j`.
