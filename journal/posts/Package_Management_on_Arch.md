---
title: Package Management on Arch
description: Guide for common package management operations
tags: ['archlinux']
timestamp: 1631933126633
---

# Package Management on Arch

[[toc]]

## Common `pacman` Commands

Install packages from Arch standard repository

```sh
pacman -S <packagename>
```

+++

Remove packages and its dependencies that are not required by other packages

```sh
pacman -Rs <packagename>
```

+++

List installed packages (including AUR)

```sh
pacman -Qs
```

+++

Search installed packages (including AUR)

```sh
pacman -Qs <regex>
```

+++

List installed packages only found in sync db(s)

```sh
pacman -Qn
```

+++

List installed packages _not_ found in sync db(s) (e.g. AUR only)

```sh
pacman -Qm
```

+++

Get detailed info of a package (e.g. installation date)

```sh
pacman -Qi <packagename>
```

+++

Update all packages _from standard repo_ in system

```sh
pacman -Syu
```

Arch does not support _partial_ upgrades (or upgrading of single packages), meaning that any upgrades need to be performed _system-wide_.

## Common `yay` commands

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

List installed AUR packages

```
yay -Qm
```

+++

Clean `yay` cache from `~/.cache/yay/` (AUR only)

```sh
yay -Sca
```

## `pacman` Mirrorlist

`pacman` pulls packages from mirror sites listed in `etc/pacman.d/mirrorlist`. This list of mirrors may need to be updated from time to time so we have a list mirrors that have the fastest download times (for example).

### Reflector

We can use `reflector` to fetch the latest mirror list and overwrite `etc/pacman.d/mirrorlist`. See the [archwiki](https://wiki.archlinux.org/title/Reflector) for full configuration options.

## `pacman` Cache Buildup

`pacman` cache keeps all previously installed packages and is not cleaned up automatically.

We can use `paccache` (comes with `pacman-contrib` package) to clean up cache. See [archwiki](https://wiki.archlinux.org/title/pacman#Cleaning_the_package_cache).

Run the following to clean up cache. The command keeps the most recent 3 versions of packages by default.

```
paccache -r
```

### Setting up `paccache` Timer

`paccache` comes with a `systemd timer` (`paccache.timer`). We can set it up to run automatically at an interval by `enabling` and `starting` the `systemd timer` unit. See [archwiki](https://wiki.archlinux.org/title/Systemd#Using_units).

By default, `paccache.timer` is set to run on a weekly basis. This may be too often and we can change it to run monthly instead.

#### Editing `paccache.timer` to Run Monthly

Edit `paccache.timer` with "drop-in files" following this [archwiki](https://wiki.archlinux.org/title/Systemd#Drop-in_files).

The override file should look like this:

```
[Timer]
OnCalendar=
OnCalendar=monthly
```

- See [here](https://unix.stackexchange.com/questions/479702/cannot-override-systemd-timer-with-specific-time) to understand why we need to set `OnCalendar=` first.
- See [systemd.time man](https://man.archlinux.org/man/systemd.time.7#CALENDAR_EVENTS) to the possible configurations for `OnCalendar`.

## Downgrading Packages

### Using `pacman` Cache

If a package was installed at an earlier stage, and the pacman cache was not cleaned, install an earlier version from `/var/cache/pacman/pkg/`.

This process will remove the current package and install the older version. Dependency changes will be handled, but pacman will not handle version conflicts. If a library or other package needs to be downgraded with the packages, please be aware that you will have to downgrade this package yourself as well.

```sh
pacman -U file:///var/cache/pacman/pkg/package-old_version.pkg.tar.type
```

Note that type will be xz for older package builds, and zst for newer ones.

[archwiki](https://wiki.archlinux.org/title/downgrading_packages)

## Skip Package from being Upgraded

We can skip upgrades for specific packages during `pacman -Syu` by including these packages in the `IgnorePkg` list.

Go to `/etc/pacman.conf`, and can find the `IgnorePkg` list under the `[options]` section. The list accepts a _space separated_ list.

[archwiki](https://wiki.archlinux.org/title/Pacman#Skip_package_from_being_upgraded)

## Troubleshooting

### "Invalid or corrupted package (PGP signature)" Error Message

You might get this error message if you haven't updated packages in a long time. To solve this, simply reinstall `archlinux-keyring` by doing:

```
pacman -S archlinux-keyring
```

The command will update new keys and disable the revoked keys in your Arch Linux system. You should be able to update packages after this.

### `yay` Tries to Install Bloated `chromium-mirror`

When upgrading AUR packages with `yay`, it may try to pull ~40GB worth of files from `.../electron25/chromium-mirror` if some of your packages require `electron25` as a dependency.

You can get around this by first installing `electron25-bin` (see [here](https://aur.archlinux.org/packages/electron25-bin)) to satisfy the dependency, then upgrade your AUR packages.

## More Info

Description on how packages are handled on Arch [here](https://www.reddit.com/r/archlinux/comments/8fqzf4/will_pacman_syu_also_update_the_stuff_i_have/dya3j0g?utm_source=share&utm_medium=web2x&context=3)

<PostDate />
<PageTags />
