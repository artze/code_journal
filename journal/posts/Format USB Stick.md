---
title: Format USB Stick in Arch
description: Steps to format USB Stick in Arch
tags: ['archlinux']
timestamp: 1651073572958
---

# Format USB Stick in Arch

To securely wipe all data in USB stick, see [here](/posts/Securely_Wipe_Storage_Device.md)

+++

Erase filesystem with `wipefs`

```
sudo wipefs -a /dev/sdX
```

If you get a "Resource Busy" error, add the `force` option `-f`

+++

Create a New Partition

```
sudo fdisk /dev/sdX
```

Once in the fdisk menu:

- Create a partition table. In most cases, we will use GPT parition table. Use DOS partition table _only if_ we need to use this USB drive in older systems.
- Create a new partition. The default 'Linux filesystem' type parition will do.

+++

Format Partition

```
sudo mkfs.vfat /dev/sdXn -n VOLUME_NAME

# Take note to include the parition number, e.g. /dev/sdb1
```

This last step will format the partition by creating a FAT filesystem. The `-n` option allows you to set the volume label and is optional.

<PostDate />
<PageTags />
