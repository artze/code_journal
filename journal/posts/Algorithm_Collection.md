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

## Two Sum

Read [this](https://www.code-recipe.com/post/two-sum)

## Three Sum

Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.

Notice that the solution set must not contain duplicate triplets.

Example:

```
Input: nums = [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]
```

Solution

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  nums = nums.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    return 1;
  });

  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    let j = i + 1;
    let k = nums.length - 1;
    if (nums[i] == nums[i - 1]) {
      continue;
    }
    while (j < k) {
      if (nums[i] + nums[j] + nums[k] < 0) {
        j++;
        continue;
      }
      if (nums[i] + nums[j] + nums[k] > 0) {
        k--;
        continue;
      }
      if (nums[i] + nums[j] + nums[k] == 0) {
        if (nums[k] != nums[k + 1]) {
          result.push([nums[i], nums[j], nums[k]]);
        }
        k--;
      }
    }
  }

  return result;
};
```

Explanation:

- This is a three-pointer solution, and starts with the following setup:

```
PointerA at i = 0;
PointerB at i = 1;
PointerC at i = arr.length - 1;
```

- There are two nested loops, the outer loop will control PointerA, whilst the inner loop will control PointerB and PointerC.
- We first sort the input array to help us decide how to move PointerB and PointerC later on, and to help us exclude duplicates from our answer.
- At each iteration of the outer loop:
  - The inner loop will move PointerB and PointerC towards each other
  - We move PointerB rightwards if the sum is less than 0, suggesting that we need a larger candidate
  - We move PointerC leftwards if the sum is greater than 0, suggesting that we need a smaller candidate
  - When we get `sum == 0`, we simply push it to the result array
- We avoid duplicate values by skipping any num values that were seen before.

[Source](https://www.code-recipe.com/post/three-sum)

## Selection Sort

In computer science, selection sort is a sorting algorithm, specifically an in-place comparison sort. It has O(n2) time complexity, making it inefficient on large lists, and generally performs worse than the similar insertion sort.

The algorithm divides the input list into two parts: the sublist of items already sorted, which is built up from left to right at the front (left) of the list, and the sublist of items remaining to be sorted that occupy the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire input list. The algorithm proceeds by finding the smallest element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element (putting it in sorted order), and moving the sublist boundaries one element to the right.

```js
var swap = function (array, firstIndex, secondIndex) {
  var temp = array[firstIndex];
  array[firstIndex] = array[secondIndex];
  array[secondIndex] = temp;
};

var indexOfMinimum = function (array, startIndex) {
  var minValue = array[startIndex];
  var minIndex = startIndex;

  for (var i = minIndex + 1; i < array.length; i++) {
    if (array[i] < minValue) {
      minIndex = i;
      minValue = array[i];
    }
  }
  return minIndex;
};

var selectionSort = function (array) {
  for (var i = 0; i < array.length; i++) {
    swap(array, i, indexOfMinimum(array, i));
  }
};
```

## Insertion Sort

![insertion_sort_gif](https://upload.wikimedia.org/wikipedia/commons/0/0f/Insertion-sort-example-300px.gif)

```js
function insert(array, rightIndex, value) {
  for (var j = rightIndex; j > -1 && array[j] > value; j--) {
    array[j + 1] = array[j];
  }
  array[j + 1] = value;
}

function insertionSort(array) {
  for (var i = 1; i < array.length; i++) {
    insert(array, i - 1, array[i]);
  }
  return array;
}
```

<PostDate />
<PageTags />
