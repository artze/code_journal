---
title: Momentjs utcOffset
description: Note on momentjs timezone offset
tags: ['momentjs']
timestamp: 1625808439284
---

# Momentjs utcOffset

Consider a machine or OS configured with Pacific/Fiji timezone (+12). When the machine runs the following script:

```js
const m = moment();
console.log(m.toString());

// Prints "Fri Jul 09 2021 17:26:02 GMT+1200"
```

All subsequent momentjs operations will assume the timezone of +12.

To ensure consistency, it is best to _explicitly_ define which timezone momentjs operations are based on, without depending on the settings of the machine. This can be done with `utcOffset`:

```js
const m = moment().utcOffset(8);
console.log(m.toString());

// Prints "Fri Jul 09 2021 13:26:12 GMT+0800"
```

The above will make sure that all momentjs operations are based on +8 timezone, no matter where the script is being run.
