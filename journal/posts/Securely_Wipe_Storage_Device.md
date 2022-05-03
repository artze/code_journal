---
title: Securely Wipe Storage Device
description: Steps to securely wipe storage device on Arch
tags: ['archlinux']
timestamp: 1651073572958
---

# Securely Wipe Storage Device

To securely wipe all data in storage, we need to _overwrite_ the entire storage with random bytes to make it difficult or impossible to recover data. This can be done with either `shred` or `dd`.

## Using `shred`

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

## Using `dd`

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

### Block Size

`bs` specifies the 'block size', i.e. how many bytes to read + write at a time. This parameter is mainly specified for performance reasons. See [here](https://serverfault.com/a/650138)

Using `bs` in combination with `count` (number of blocks) will allow us to run `dd` for `bs * count` amount of data (instead of the entirety of the storage device).

### Resuming from a Specified Byte

We can resume wiping a drive from n-th byte with the `seek` option. For example, if we wish to resume from byte 2000, we can do the following:

```
dd if=/dev/urandom of=/dev/sdX bs=1M seek=2000B status=progress
```

## Observations

The following was observed when using the commands above:

- `bs=2M` for `dd` seems to give better performance result than 4096B, 1M.
- After either adding random bytes or zero-filling a partition, all partition info is wiped so it is no longer mount-able.
- Tried both approahces to wipe a 1TB HDD with a _faulty_ SATA to USB convertor. A faulty convertor can lead to the following errors:
  - with `shred`: `error writing at offset xxx: Input/output error`.
  - with `dd`: The process freezes after a while, i.e. the byte number does not progress for long periods of time. To stop and exit `dd`, we need to run `kill -9 <pid>`.

<PostDate />
<PageTags />
