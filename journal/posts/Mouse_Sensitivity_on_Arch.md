---
title: Mouse Sensitivity on Arch
description: Configure mouse sensitivity setting on arch
tags: ['archlinux']
timestamp: 1661916722194
---

# Mouse Sensitivity on Arch

The following assumes that you are using `Xorg` as the windowing protocol.

## Using `xinput`

Get a list of devices with:

```sh
xinput list
```

In this list you will find the identifier and names of your devices. In this example, we will assume "Logitech MX Vertical" as our device indentifier.

+++

Get a list of all properties of your device:

```sh
xinput list-props "pointer:Logitech MX Vertical"
```

Here you will see a list of properties that can be configured. In this case, the property we want to configure is "libinput Accel Speed"

+++

Next we set the acceleration to desired value:

```sh
xinput set-prop "pointer:Logitech MX Vertical" "libinput Accel Speed" 1
```

And that's it! The acceleration value is updated. However, this configuration will be reset when we reboot the system. To make it permanent, we can include the `set-prop` command in `~/.xprofile`. `.xprofile` is executed at the beginning of each X user session.

```
# ~/.xprofile
xinput set-prop "pointer:Logitech MX Vertical" "libinput Accel Speed" 1
```

## Customizing Logitech MX Mouse

The max sensitivity of the config above was not enough for me. There is further customization we can do with Logitech MX mouse.

See [archwiki](https://wiki.archlinux.org/title/Logitech_MX_Master)

Notes:

- Sensitivity can be adjusted with the `dpi` property
- Archwiki says to run `logid -v` to get the name of device. `sudo` is required to get this to work.
