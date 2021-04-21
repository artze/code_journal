---
title: Element Width Based on Content
description: Make element width dynamic based on content with CSS.
tags: ['css']
timestamp: 1538572281000
---

## Element Width Based on Content

Say you have a div element and you want its width to follow its content. There is a neat css you could use — width: fit-content;

Much like message bubbles you see in chat apps, you could set the max-width of a div (so that excess content will be pushed to the next line), and make the div width dynamic for anything shorter than that:

```css
div {
  max-width: 500px;
  width: fit-content;
}
```


<PostDate />
<PageTags />
