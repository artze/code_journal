---
title: Setting up Deno
description: Notes on setting up Deno
tags: ['deno']
timestamp: 1706764806294
---

# Setting up Deno

## `asdf` Runtime Version Manager

Deno is best installed with a runtime version manager like [asdf](https://asdf-vm.com/).

Install `asdf-deno` plugin (this only needs to be done once, at the very first time):

```
asdf plugin-add deno https://github.com/asdf-community/asdf-deno.git
```

Then install Deno with:

```
# Download and install the latest version of Deno
asdf install deno latest

# OR

asdf install deno x.y.z
```

Set default version globally:

```
asdf global deno x.y.z
```

### `asdf` within a Project

Within a fresh project, run the following:

```
asdf local deno x.y.z
```

This creates a file `.tool-versions` and 'locks' the project to the specified Deno version. Everytime `deno` command is run within the project, the specified version will automatically be used.

## Deno Runtime & `std lib` Compatibility

See compatibility table [here](https://deno.com/versions.json)

## VS Code Plugin

[Official Deno plugin](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)

The plugin needs to be enabled at project level, because not all Javascript/Typescript projects use Deno. Do this with `Ctrl + Shift + P` and run `Deno: Initialize Workspace Configuration`.
