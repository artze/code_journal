---
title: Bash Learning Notes
description: A dump of notes when learning Bash
tags: ['bash']
timestamp: 1619259610710
---

# Bash Learning Notes

## Basename

```bash
basename <path_to_file> [suffix]
```

The `basename` command will return the base name of file by stripping away the preceding directory paths. Optionally, you can pass in `suffix` as a second argument which will strip that as well

```bash
# foo.sh
basename $0
# output: foo.sh

basename $0 .sh
# output: foo
```

Take note that we are using `$0` which represents `./foo.sh` when we run `./foo.sh <arg>`

## Command Substitution

```bash
$(command)
```

Command substitution allows the *output* of a command to replace the command itself.

## Arithmetic Expansion

```bash
$((math_operation))
```

Arithmetic expansion allows the evaluation of an arithmetic expression and the substitution of the result.

Example and why does it have double parantheses:

```bash
$(( 3 + 5))

# The inner layer will evaluate the arithmetic result
# The outer layer then returns the result in-place
```

## String Concat

A few ways to concat strings:

### One after another

```bash
VAR1="Hello,"
VAR2=" World"
echo "$VAR1$VAR2"
```

### String literal interpolation

```bash
VAR1="Hello,"
echo "${VAR1}, World" # to differentiate variable name from surrounding string chars
```

### With `+=` operator

```bash
VAR1="Hello, "
VAR1+=" World"
echo "$VAR1"
```

## Shell Parameter Expansion

The most basic form of parameter expansion is `${parameter}` where the value of the `parameter` is substituted in place.

There are operators that can be used with shell parameter expansion that offers certain features:

```bash
${parameter:-word}
```
If parameter is unset or null, the expansion of word is substituted. Otherwise, the value of parameter is substituted.

+++

```bash
${parameter:=word}
```
If parameter is unset or null, the expansion of word is assigned to parameter. The value of parameter is then substituted. Positional parameters and special parameters may not be assigned to in this way.

+++

```bash
${parameter:?word}
```
If parameter is null or unset, the expansion of word (or a message to that effect if word is not present) is written to the standard error and the shell, if it is not interactive, exits. Otherwise, the value of parameter is substituted.

+++

```bash
${parameter:+word}
```
This is the opposite of `${parameter:-word}`. If parameter is null or unset, nothing is substituted, otherwise the expansion of word is substituted. 

More can be found [here](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html)

<PostDate />
<PageTags />
