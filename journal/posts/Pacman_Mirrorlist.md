---
title: Pacman Mirrorlist
description: Configure Pacman mirrorlist
tags: ['archlinux']
timestamp: 1669123165181
---

# Pacman Mirrorlist

`pacman` pulls packages from mirror sites listed in `etc/pacman.d/mirrorlist`. This list of mirrors may need to be updated from time to time so we have a list mirrors that have the fastest download times (for example).

## Reflector

We can use `reflector` to fetch the latest mirror list and overwrite `etc/pacman.d/mirrorlist`. See the [archwiki](https://wiki.archlinux.org/title/Reflector) for full configuration options.

<PostDate />
<PageTags />
