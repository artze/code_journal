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

## Change String Case
| Operator | Description |
| --- | --- |
| ^ | Convert first char to uppercase |
| ^^ | Convert all chars to uppercase |
| , | Convert first char to lowercase |
| ,, | Convert all chars to lowercase |

```bash
str1="foo bar"
${str1^} # Foo bar
${str1^^} # FOO BAR

str2="FOO BAR"
${str2,} # fOO BAR
${str2,,} # foo bar
```

It is possible to target specific letters to change its case:

```bash
languages="perl python java php"
${languages^p} # Perl python java php
${languages^^p} # Perl Python java Php
${languages^^[p,j]} # Perl Python Java Php
```

## Increment / Decrement Variables

With `i+=1` similar to other languages.

Can also be achieved with either `++i` or `i++`:
- `++i` increments the variable and *returns the new value*
- `i++` increments the variable and *returns the previous value*

Decrement by using the `-` operator.

<PostDate />
<PageTags />
