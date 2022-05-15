---
title: Screen Brightness in Arch
description: Adjusting screen laptop brightness in Arch with keybindings
tags: ['archlinux']
timestamp: 1652584317660
---

# Screen Brightness in Arch

This guide tells us how we can configure laptop Fn keys to control laptop screen brightness. The following steps is tested on a Lenovo Thinkpad T460.

## Setting Screen Brightness

We can set screen brightness by manipulating the content of a system file `/sys/class/backlight/intel_backlight/brightness`. You can find more details [here](https://wiki.archlinux.org/title/backlight#Hardware_interfaces).

Only `root` user is allowed to manipulate this file. To allow users in `video` usergroup to make changes to this file, we can add the following udev rule in `/etc/udev/rules.d/backlight.rules`:

```
RUN+="/bin/chgrp video /sys/class/backlight/intel_backlight/brightness"
RUN+="/bin/chmod g+w /sys/class/backlight/intel_backlight/brightness"
```

With the above in place, we should be able to edit the integer in `/sys/class/backlight/intel_backlight/brightness`, and the screen brightness should change accordingly.

## Write a Script

Write a script so that we can run it with options (e.g. `-inc`, `-dec`) to increase/descrease screen brightness. For example, `./brightness.sh -inc`.

## Keybinding

First, find out what keycode is assoicated with the brightness Fn keys. We can run the following to capture the keycode of keyboard events.

```
xev -event keyboard
```

We can now bind the keycode with the script from before. For my case, I am using `i3wm`, so I could do this by adding the following:

```
bindcode 232 exec ~/.config/abrightness/abrightness.sh -dec
bindcode 233 exec ~/.config/abrightness/abrightness.sh -inc
```

## Other Notes

Using `xorg-xbacklight` might be a good approach as well. See [here](https://wiki.archlinux.org/title/backlight#xbacklight). However, the `xbacklight` command did not work for my case -- after running the command, nothing happens at all (not even an error mesasge).

<PostDate />
<PageTags />
