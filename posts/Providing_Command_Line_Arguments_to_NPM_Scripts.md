---
title: Providing Command Line Arguments to NPM Scripts
description: Syntax to run NPM scripts with command line arguments
tags: ['npm']
timestamp: 1559369506000
---

## Providing Command Line Arguments to NPM Scripts

Providing argv arguments to node app:

`node app.js something1 --something2`

Setting up an NPM script might look like the following within `package.json`:

```js
scripts: {
  "aScript": node app.js
}
```

To run that NPM script with command line arguments:

`npm run aScript -- something1 --something2`

We simply need a double-dash followed by the arguments we want passed in.

<PostDate />
<PageTags />
