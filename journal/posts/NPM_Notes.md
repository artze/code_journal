---
title: NPM Notes
description: Collection of NPM Guides
tags: ['npm']
timestamp: 1620350049788
---

# NPM Notes

[[toc]]

## Manage NPM Dependency Updates

Check for outdated NPMs in your repo with

```sh
npm outdated
```

++

Update packages with

```sh
npm update
```

Update specific package with

```sh
npm update <package-name>
```

`npm update` will conform with semver rules defined in `package.json`. For example, if `~1.2.0` is defined, `npm update` will:

- install `1.2.4`
- but will not install `1.3.0`

++

But sometimes we want to _bump_ `package.json` semver rules, for example from `~1.2.0` to `~1.3.0`. This can be done with a global npm `npm-check-updates`:

```sh
ncu -u <package-name>
```

Full doc [here](https://github.com/raineorshine/npm-check-updates#npm-check-updates)

Source: <https://stackoverflow.com/a/23980257>

## Executable Global NPM Module

<https://medium.com/jspoint/creating-cli-executable-global-npm-module-5ef734febe32>

Another example with Typescript:
<https://walrus.ai/blog/2019/11/typescript-cli/>

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

## Package-lock and Semver

<https://medium.com/coinmonks/everything-you-wanted-to-know-about-package-lock-json-b81911aa8ab8>

npm semver calculator:
<https://semver.npmjs.com/>

## Publish Pre-releases

1. Insert pre-release version in `package.json`

```
// example
"version": "1.2.2-beta.0"
```

2. Publish with custom tag. Here, we will use `next` tag to follow npm conventions. This tag is important:

- To prevent user from installing pre-releases when installing npm with `npm install package`. This installation command will pull packages tagged with `latest`.
- To allow user to install pre-releases with `npm install package@next`

```
npm publish --tag next
```

## Executable NPM Packages and `npx`

A good StackOverflow answer on this topic <https://stackoverflow.com/a/52018825/5204647>

<PostDate />
<PageTags />
