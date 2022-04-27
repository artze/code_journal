---
title: Format USB Drive in Arch
description: Steps to format USB drive in Arch
tags: ['archlinux']
timestamp: 1651073572958
---

# Format USB Drive in Arch

## 1. Wipe Everything

```
sudo wipefs -a /dev/sdX
```

If you get a "Resource Busy" error, add the `force` option `-f`

## 2. Create a New Partition

```
sudo fdisk /dev/sdX
```

Once in the fdisk menu:

- Create a partition table. In most cases, we will use GPT parition table. Use DOS partition table _only if_ we need to use this USB drive in older systems.
- Create a new partition. The default 'Linux filesystem' type parition will do.

## 3. Format Partition

```
sudo mkfs.vfat /dev/sdXn -n VOLUME_NAME

# Take note to include the parition number, e.g. /dev/sdb1
```

This last step will format the partition by creating a FAT filesystem. The `-n` option allows you to set the volume label and is optional.

<PostDate />
<PageTags />
