---
title: Manage NPM Dependency Updates
description: Commands and tools to manage NPM updates
tags: ['npm']
timestamp: 1620350049788
---

# Manage NPM Dependency Updates
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

<PostDate />
<PageTags />
