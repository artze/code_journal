---
title: Configure Touchpad in Arch
description: Customize touchpad behavior in Arch + xorg
tags: ['archlinux']
timestamp: 1647667236001
---

# Configure Touchpad in Arch

_The following is meant for systems with xorg display server_

By default, the touchpad does not recognize 'tapping' as clicks, and two-finger scrolling is not inversed. We can change this behavior by adding a file `30-touchpad.conf` in `/etc/X11/xorg.conf.d`.

The contents of the file:

```
Section "InputClass"
	Identifier "libinput touchpad catchall"
	MatchIsTouchpad "on"
	MatchDevicePath "/dev/input/event*"
	Driver "libinput"
	Option "NaturalScrolling" "true"
	Option "Tapping" "on"
EndSection
```

The `Option` parameters are the ones responsible in customizing touchpad behavior. The other parameters can be copied over from the generic configurations in `/usr/share/X11/xorg.conf.d/40-libinput.conf`.

More on these configurations on [archwiki](https://wiki.archlinux.org/title/libinput#Configuration)

<PostDate />
<PageTags />
