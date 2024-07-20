---
title: Upgrade Node with NVM
description: How to upgrade node with nvm
tags: ['nodejs']
timestamp: 1646216177076
---

# Upgrade Node with NVM

The following command will install a new version of node, and reinstall all current npm global packages.

```sh
nvm install NEW_VERSION --reinstall-packages-from=current
```

Example:

```sh
# This installs the latest node 16, and will install all your current
# npm global packages
nvm install 16 --reinstall-packages-from=current
```

After that, simply uninstall the old version by

```sh
nvm uninstall OLD_VERSION
```

<PostDate />
<PageTags />
