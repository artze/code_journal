---
title: Errors in Shell Scripts
description: Throwing errors and error handling
tags: ['bash', 'shell']
timestamp: 1619395361533
---

# Errors in Shell Scripts

Errors or failures in shell are represented by a non-zero exit code between `1` and `255`. In most cases, exit code `1` can be used.

Resources:

- <https://dev.to/banks/stop-ignoring-errors-in-bash-3co5>

## Default Error Behaviors

By default, shell scripts will keep on running when encountered with an error (instead of terminating). See below:

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

To be specific, it will not terminate when encountered with a non-zero exit code from a _sub-command_. It will still terminate when a non-zero exit code is emitted in the main flow:

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

At the most basic level, we can get shell scripts to terminate when a subcommand errored, and propagate the exit code to the calling function. This can be done by adding `set -e` in our script.

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

This causes the shell script to treat unset variables as an error _and_ exit immediately. See cases below:

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

<https://stackoverflow.com/questions/64786/error-handling-in-bash>
<https://stackoverflow.com/questions/30078281/raise-error-in-a-bash-script/50265513#50265513>
