---
title: Bash Learning Notes
description: A dump of notes when learning Bash
tags: ['bash']
timestamp: 1619259610710
---

# Bash Learning Notes

[[toc]]

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

Command substitution allows the _output_ of a command to replace the command itself.

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

| Operator | Description                     |
| -------- | ------------------------------- |
| ^        | Convert first char to uppercase |
| ^^       | Convert all chars to uppercase  |
| ,        | Convert first char to lowercase |
| ,,       | Convert all chars to lowercase  |

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

- `++i` increments the variable and _returns the new value_
- `i++` increments the variable and _returns the previous value_

Decrement by using the `--` operator.

## Ternery Expression

```bash
[ $sum -eq $1 ] && echo "true" || echo "false"
```

## Comparison Operators

### String Comparison

Both `=` and `==` can be used in Bash for string comparison. However, only `=` is POSIX compliant and guaranteed to work in all sh. `==` is Bash specific.

### Numerical Comparison

`-eq` must be used for numerical comparisons. Other comparison operators:

- `-ne`
- `-lt`
- `-le`
- `-gt`
- `-ge`

## Filter, Dedup, and Sort Strings

```bash
result=$(echo "${input//[_0-9 \\\".]/}" | grep -o . | sort -u | tr -d "\n")
```

Let's unpack what's going on here.

`${input//[_0-9 \\\".]/}` filters out the chars `_`, ` ` (space), `numbers`, `.`, `\` and `"` by replacing them with nothing. See [here](./Shell_Parameter_Expansion.md#string-replace).

+++

`grep -o <pattern>`. The `-o` or `--only-matching` option outputs _only_ the matching parts (everything else in the same line is discarded), with each match on a newline.

::: tip
Remember that plain old `grep <pattern>` will _highlight_ the matching parts, but still outputs the _entire_ corresponding lines.
:::

The `.` in `grep -o .` means that all characters are a matching pattern. This essentially separates each input character into a newline.

+++

The `sort` command typically sorts _lines_ in a file, which is why we needed to split each input character into a newline. The `-u` option removes duplicates.

More info on `sort` command [here](https://www.geeksforgeeks.org/sort-command-linuxunix-examples/)

+++

The `tr` command is an abbreviation of translate. The `-d` or `--delete` option simply deletes the character specified in the following argument. So `tr -d "\n"` removes the newlines, and brings us back to a one-liner string with the result.

More on `tr` [here](https://linuxize.com/post/linux-tr-command/)

## Capture Whitespace Characters with Regex

The `=~` regex matcher operator in Bash supports 'extended regular expressions' which means it supports Character Classes notation like below:

- `[[:blank:]]` means space and tab. This makes it similar to: [ \t].

- `[[:space:]]`, in addition to space and tab, includes newline, linefeed, formfeed, and vertical tab. This makes it similar to: [ \t\n\r\f\v].

See list of Character Classes [here](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX-Extended_Regular_Expressions#Character_classes)

```bash
[[ $1 =~ ^[[:space:]]+$ ]] && echo "true"

# Tests if $1 contains only one or more [:space] characters
```

## Hashmaps in Bash

Hashmaps in Bash can be achieved by using an associative array.

```bash
# Declare associative array
declare -A hashmap

# Set key-value pairs
hashmap[foo]="bar"
hashmap[abc]="def"

# Get value
echo ${hashmap[foo]} # outputs 'bar'

# Iterate keys in hashamp
for key in ${!hashmap[@]}
do
  echo $key
done

# Iterate values in hashmap
for value in ${hashmap[@]}
do
  echo $value
done

# Get number of elements
echo ${#hashmap[@]} # outputs 2
```

## Case Statements

```bash
# Syntax
case expression in
  pattern_1)
    # do something
    ;;
  pattern_2)
    # do something
    ;;
  *)
    # do something
    ;;
esac


# Example
case $1 in
  foo)
    # If $1="foo"
    echo "foo triggered"
    ;;
  *"?"*)
    # Pattern Matching. If $1 contains "?"
    echo "? triggered"
    ;;
  ${1^^})
    # Parameter expansion can be used. If $1 are ALL CAPS
    echo "All caps triggered"
    ;;
  [ABCDE])
    # Glob works. If $1 contains any one candidate from "ABCDE"
    echo "Glob triggered"
    ;;
  *)
    echo "Default case triggered"
    ;;
esac
```

## Handling Exponents and Large Numbers

In Bash, we can get results of exponentiation by

```bash
echo $(( 2 ** 5 )) # Equivalent to 2^5

# Outputs 32
```

But if the resulting number is too large, (when it is larger than `2^63 - 1`), it will not be handled correctly. See more [here](https://stackoverflow.com/a/23044929/5204647). You will instead require a calculator program such as `bc`

```bash
echo $(echo "2 ^ 80" | bc)

# Outputs 1208925819614629174706176
```

+++

Other examples of large number scenarios:

```bash
sum=0
for i in {1..64}
do
  exp_product=$(echo "2 ^ $(( $i - 1 ))" | bc)
  (( sum+=$exp_product ))
done
echo $sum

# outputs -1
# The correct value should be 18446744073709551615
```

This can be resolved with `bc`

```bash
    sum=0
    for i in {1..64}
    do
      exp_product=$(echo "2 ^ $(( $i - 1 ))" | bc)
      sum=$(echo "$sum + $exp_product" | bc)
    done
    echo $sum
```

## Parse CLI Arguments with `getopts`

Bash offers a basic command `getopts` to parse CLI arguments. Useful links:

- <https://man7.org/linux/man-pages/man1/getopts.1p.html>
- <https://kodekloud.com/blog/bash-getopts/>
- <https://stackoverflow.com/questions/16483119/an-example-of-how-to-use-getopts-in-bash>
- <https://unix.stackexchange.com/questions/426483/what-is-the-purpose-of-the-very-first-character-of-the-option-string-of-getopts>

## Read Lines from File

There are a number of ways to read lines from files.

```sh
while read -r l ; do
  echo "$l"
done < input-file.txt
```

This approach is well and good, but:

- It will omit the last line of the file if it is not followed by a newline character
- Any leading spaces will be omitted

For example:

```
# input-file.txt
abc
 def
jkl

# No newline char after jkl
```

gives us the following output:

```
abc
def
```

+++

The following approach can address the last line ommission issue:

```sh
while read -r l || [[ -n $l ]] ; do
  echo "$l"
done < input-file.txt
```

gives us:

```
abc
def
jkl
```

+++

And finally:

```sh
while IFS="" read -r l || [[ -n $l ]] ; do
  echo "$l"
done < input-file.txt
```

gives us:

```
abc
 def
jkl
```

Related links:

- <https://linuxize.com/post/bash-read/>
- <https://stackoverflow.com/questions/1521462/looping-through-the-content-of-a-file-in-bash>
- <https://unix.stackexchange.com/questions/18886/why-is-while-ifs-read-used-so-often-instead-of-ifs-while-read>
- <https://stackoverflow.com/questions/26479562/what-does-ifs-do-in-this-bash-loop-cat-file-while-ifs-read-r-line-do>
