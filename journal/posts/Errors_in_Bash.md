---
title: Errors in Bash
description: Throwing errors and error handling
tags: ['bash']
timestamp: 1619395361533
---

# Errors in Bash

Errors or failures in Bash are represented by a non-zero exit code between `1` and `255`. In most cases, exit code `1` can be used.

## Default Error Behaviors

By default, Bash scripts will keep on running when encountered with an error (instead of terminating). See below:

```bash
main () {
  abc
  def
}

main

# Output
# abc: command not found
# def: command not found
```

To be specific, it will not terminate when encountered with a non-zero exit code from a *sub-command*. It will still terminate when a non-zero exit code is emitted in the main flow:

```bash
main () {
  abc
  def
  exit 1
  echo "Unreachable code"
}

main

# Output
# abc: command not found
# def: command not found
```

## Terminate on Error

At the most basic level, we can get Bash scripts to terminate when a subcommand errored, and propagate the exit code to the calling function. This can be done by adding `set -e` in our script.

```bash
set -e

main () {
  abc
  def
}

main

# Output
# abc: command not found
```

To cover most cases, it is common practice to add the following

```bash
set -euo pipefail
```

### `set -u`

This causes the Bash script to treat unset variables as an error *and* exit immediately. See cases below:

```bash
main () {
  echo "$foo"
  echo "end of main"
}

main

# Output
# 
# end of main
```

```bash
set -u

main () {
  echo "$foo"
  echo "end of main"
}

main

# Output
# line x: foo: unbound variable 
```

### `set -o pipefail`

This prevents errors from being silently ignored in pipelines. For example:

```bash
cat example.txt | grep sometext | sort
```

By default, the exit status of the entire pipeline will just be that of the last command, sort. This can succeed even if example.txt does not exist and an earlier command like cat fails. pipefail changes this behaviour so that the pipeline is marked as failed if any of the commands fail. (Subsequent commands in the pipeline will still be executed. If multiple fail, the exit status of the last failing command will be used.)


## Error Handling
To be completed

<PostDate />
<PageTags />
