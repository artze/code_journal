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
# loop is printed 2 times, proof that there are a total of 2 args
```

### How Multi-word Arguments are Handled

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

# When we run `./script.sh "john smith" "anna nicole"`:
# $1 is john
# $2 is smith
# loop is printed 4 times, proof that there are a total of 4 args
```

```bash
main () {
  echo "\$1 is $1"
  echo "\$2 is $2"
}

main "$@"

# When we run `./script.sh "john smith" "anna nicole"`:
# $1 is john smith
# $2 is anna nicole
# loop is printed 2 times, proof that there are a total of 2 args
```

When `$@` is wrapped in double-quotes, the space in "john smith" is preserved; otherwise, _all_ spaces will serve as delimeter between arguments.
