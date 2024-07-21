---
title: Format USB Stick in Arch
description: Steps to format USB Stick in Arch
tags: ['archlinux']
timestamp: 1651073572958
---

# Format USB Stick in Arch

To **securely** wipe all data in USB stick, see [here](/posts/Securely_Wipe_Storage_Device.md)

+++

Erase the _partition table_ with `wipefs`

```
sudo wipefs -a /dev/sdX
```

If you get a "Resource Busy" error, add the `force` option `-f`

See additional guidance on `wipefs` [here](https://unix.stackexchange.com/a/756991)

+++

Then run the following:

```
sudo fdisk /dev/sdX
```

Once in the `fdisk` menu:

- Create a partition table. In most cases, we will use GPT parition table. Use DOS partition table _only if_ we need to use this USB drive in older systems.
- Create a new partition. The default 'Linux filesystem' type partition will do.

+++

Format Partition

```
sudo mkfs.vfat /dev/sdXn -n VOLUME_NAME

# Take note to include the parition number, e.g. /dev/sdb1
```

This last step will format the partition by creating a FAT filesystem. The `-n` option allows you to set the volume label and is optional.
