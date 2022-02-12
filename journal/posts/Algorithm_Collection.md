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

## Binary Search

Searching an element in a _sorted_ array. Covers scenario if search `target` does not exist.

```js
function binarySearch(arr, target) {
  // Exit early if target is out of bounds
  if (target < arr[0]) {
    return -1;
  }
  if (target > arr[arr.length - 1]) {
    return -1;
  }

  let min = 0;
  let max = arr.length - 1;
  while (min <= max) {
    const middleIndex = Math.floor((min + max) / 2);
    if (arr[middleIndex] == target) {
      return middleIndex;
    }
    if (arr[middleIndex] > target) {
      max = middleIndex - 1;
    } else if (arr[middleIndex] < target) {
      min = middleIndex + 1;
    }
  }

  return -1;
}
```

If `min` stops being smaller or equal to `max`, we can conclude that the `target` does not exist:

1. When `target` does not exist, we will eventually come to either `min == max` or `min = n; max = n + 1`.
2. The computed `middleIndex` will equal `min` as we are taking `Math.floor`.
3. If `arr[middleIndex] > target`, `max` will be adjusted and become smaller than `min`; if `arr[middleIndex] < target`, `min` will be adjusted and become larger than `max`.
4. So when `min < max`, we can conclude that `target` does not exist.

<PostDate />
<PageTags />
