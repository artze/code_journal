---
title: Algorithm Collection
description: A collection of neat and useful algorithms
tags: ['algorithm']
timestamp: 1643721710813
---

# Algorithm Collection

[[toc]]

## Dedup Sorted Array

This dedup algorithm works only on sorted arrays.

```js
function dedupSortedArr(inputArr) {
  let i = 0;
  for (let j = 1; j < inputArr.length; j++) {
    if (inputArr[i] != inputArr[j]) {
      i++;
      inputArr[i] = inputArr[j];
    }
  }
  return inputArr.slice(0, i + 1);
}

// inputArr = [0, 0, 1, 2, 2, 3, 4];
// result = [0, 1, 2, 3, 4];
```

Some notes:

- `i` stores the index of the _last known_ unique element
- When `inputArr[i] != inputArr[j]`, move the newfound unique element to the slot _after_ the last known unique element

+++

An alternative would be to do something like the following. This solution is more intuitive, but is **less efficient** -- the `indexOf` presumably triggers another loop. On Leetcode, this solution takes almost twice as long compared to the one above.

```js
function dedupSortedArr(inputArr) {
  for (let i = 0; i < inputArr.length; i++) {
    if (i != inputArr.indexOf(inputArr[i])) {
      inputArr.splice(i, 1);
      i--;
    }
  }
  return inputArr;
}
```

<PostDate />
<PageTags />
