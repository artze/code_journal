---
title: D3 Selection and Binding Data
description: Binding data to DOM elements with select(), data(), enter()
tags: ['d3', 'javascript']
timestamp: 1557115305000
---

## D3 Selection and Binding Data

The `data()` method is used on a selection of DOM elements to bind data to those elements. Dataset is passed as an argument.

When `enter()` is combined with the `data()` method, it looks at the selected elements from the page and compares them to the number of data items in the set. If there are fewer elements than data items, it creates the missing elements.

Example:

```js
dataset = [1, 2, 3, 4, 5];
d3.select('body')
  .selectAll('h2')
  .data(dataset)
  .enter()
  .append('h2')
  .text('New Title')
```

At the parts `selectAll().data()`, d3 selects all h2 elements (there could be none, there could be a few existing ones) and ‘links’ them with the dataset. The `data()` method essentially runs the succeeding code for each item in the dataset.

(We’re now in the `data()` iteration). When it reaches `enter()` d3 compares the current selected element (in this case h2) with the current item in the dataset. If the current selected element is missing, it runs the succeeding code and appends a new h2 element. Else, it skips to the next iteration.

So, if we started off with a single existing h2 element `<h2>Old Title</h2>` d3 would generate four h2 elements with the text ‘New Title’.

<PostDate />
<PageTags />
