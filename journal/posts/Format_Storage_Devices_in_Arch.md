---
title: Format Storage Devices in Arch
description: Steps to format storage devices in Arch
tags: ['archlinux']
timestamp: 1651073572958
---

# Format Storage Devices in Arch

## Securely Wipe all Data in Storage

To securely wipe all data in storage, we would typically _overwrite_ all existing data with random bytes to make it difficult or impossible to recover data. This can be done with either `shred` or `dd`.

### Using `shred`

```
sudo shred -vfz -n1 /dev/sdX
```

Notes:

- `-v` verbose mode
- `-f` change permissions to allow writing if necessary
- `-z` add final overwrite with zeros to hide shredding
- `-n` overwrite N times instead of the default 3

The command above will overwrite all data with random bytes _once_ (because `-n1`), and do another round of overwrite with zero. This command wipes the entire storage device. To wipe only specific _partitions_, we can include the partition number:

```
sudo shred -vfz -n1 /dev/sdXn
```

Resources:

- <https://www.freecodecamp.org/news/securely-erasing-a-disk-and-file-using-linux-command-shred/>
- <https://wiki.archlinux.org/title/Securely_wipe_disk#shred>

#### Troubleshooting

If we run into the following error

```
error writing at offset xxx: Input/output error
```

We could get around it by adding the `-x` option, see [here](https://www.linuxquestions.org/questions/linux-general-1/problem-wiping-a-drive-with-shred-command-645258/#post5383350) (this is untested)

### Using `dd`

Overwrite drive with random data

```
dd if=/dev/urandom of=/dev/sdX bs=1M status=progress
```

+++

Overwrite drive with zeros

```
dd if=/dev/zero of=/dev/sdX bs=1M status=progress
```

This method works for specific partitions too, just add the partition identifier to the command e.g. `/dev/sdXn`

#### Block Size

`bs` specifies the 'block size', i.e. how many bytes to read + write at a time. This parameter is mainly specified for performance reasons. See [here](https://serverfault.com/a/650138)

Using `bs` in combination with `count` (number of blocks) will allow us to run `dd` for `bs * count` amount of data (instead of the entirety of the storage device).

## Format USB Sticks

We can start by securely wiping all data in storage (optional)

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
