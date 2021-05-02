---
title: Unix Brace Expansion
description: Brace Expansion and shorthand for making backup files
tags: ['shell']
timestamp: 1537687281000
---

## Unix Brace Expansion
Brace Expansion allows users to reiterate the same parts of a string without having to type them all out.

Example:

```sh
enable_{audio,video}
# generates 'enable_audio' and 'enable_video'

echo a{p,c,d,b}e
# generates 'ape ace ade abe'

echo {a,b,c}{d,e,f}
# generates 'ad ae af bd be bf cd ce cf'

echo a{,b,c}z
# generates 'az abz acz'. Note that empty slots simply generates
# the repeating string alone.
```

### Shorthand for Creating Backup Files
With this, we can easily duplicate files and add `.bak` to the backup file name with the following:

```sh
cp example_file{,.bak}
```

<PostDate />
<PageTags />
