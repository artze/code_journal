---
title: Bash Special Variables
description: Walkthrough Bash Special Variables 
tags: ['bash']
timestamp: 1619016274823
---

# Bash Special Variables

## `$@`
Represents all arguments that are passed in, and allows these arguments to be referenced by positional variables `$1`, `$2`...

```bash
main () {
  echo "\$1 is $1"
  echo "\$2 is $2"
  for el in $@
  do 
    echo "loop"
  done
}

main $@

# When we run `./script.sh foo bar`:
# $1 is foo
# $2 is bar
# loop is printed 2 times
```

<PostDate />
<PageTags />
