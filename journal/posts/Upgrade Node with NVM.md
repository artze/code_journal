---
title: Upgrade Node with NVM
description: How to upgrade node with nvm
tags: ['nodejs']
timestamp: 1646216177076
---

# Upgrade Node with NVM

The following command will install a new version of node, and reinstall all npm global packages you have in your existing node.

```
nvm install NEW_VERSION --reinstall-packages-from=OLD_VERSION
```

Example:

```
nvm install 6.7 --reinstall-packages-from="$(nvm current)"
```

After that, simply uninstall the old version by

```
nvm uninstall OLD_VERSION
```

<PostDate />
<PageTags />
