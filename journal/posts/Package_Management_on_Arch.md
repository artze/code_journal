---
title: Package Management on Arch
description: pacman + yay cheatsheet
tags: ['archlinux']
timestamp: 1631933126633
---

# Package Management on Arch

Package Manger comomands that are commonly used.

## `pacman` Commands

Install packages from Arch standard repository

```sh
pacman -S <packagename>
```

+++

Remove packages and its dependencies that are not required by other packages

```
pacman -Rs <packagename>
```

+++

List installed packages

```sh
pacman -Qs
```

+++

Query installed packages

```sh
pacman -Qs <packagename>
```

+++

Update all packages _from standard repo_ in system

```sh
pacman -Syu
```

Arch does not support _partial_ upgrades (or upgrading of single packages), meaning that any upgrades need to be performed _system-wide_.

### Common Issues

#### "Invalid or corrupted package (PGP signature)" Error Message

You might get this error message if you haven't updated packages in a long time. To solve this, simply reinstall `archlinux-keyring` by doing:

```
pacman -S archlinux-keyring
```

The command will update new keys and disable the revoked keys in your Arch Linux system. You should be able to update packages after this.

## `yay` commands

Install packages from AUR repository

```sh
yay -S <packagename>
```

+++

Remove packages and its dependencies that are not required by other packages

```sh
yay -Rs <packagename>
```

+++

Remove packages and its dependencies that are not required by other packages + remove config files

```sh
yay -Rns <packagename>
```

+++

Update all packages _from AUR repo_ in system

```sh
yay -Sua
```

+++

List upgradable packages

```sh
yay -Pu
```

_Not sure if it lists only AUR related packages or both AUR + standard repo_

+++

List installed AUR packages

```
yay -Qm
```

## More Info

Description on how packages are handled on Arch [here](https://www.reddit.com/r/archlinux/comments/8fqzf4/will_pacman_syu_also_update_the_stuff_i_have/dya3j0g?utm_source=share&utm_medium=web2x&context=3)

<PostDate />
<PageTags />
