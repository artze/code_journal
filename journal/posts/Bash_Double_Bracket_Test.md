---
title: Bash Double Bracket Test
description: Behavior of Bash Double Bracket Tests vs. Single Bracket Tests
tags: ['bash']
timestamp: 1619850952418
---

# Bash Double Bracket Test
The `[` command can be used in shell scripts to test an expression. In Bash, this can be done with `[[` as well, which offers more features. However `[[` is not POSIX compliant and does not work in many shell implementations.

Resources: 
- <http://mywiki.wooledge.org/BashFAQ/031>

## Word Splitting and Glob Expansion
The `[` command requires that you wrap your multi-word string variables with quotes. Without quotes, the variable will be subject to word splitting. With `[[`, word-splitting will not be performed, even without quotes.

```bash
filename="foo bar.txt"

# -e checks if a file exists

[ -e $filename ] && echo "file exists"
# The command above is equivalent to `test -e foo bar.txt` which will not run correctly

[ -e "$filename" ] && echo "file exists"
# The command above is equivalent to `test -e "foo bar.txt" and runs as expected


[[ -e $filename ]] && echo "file exists"
# Runs as expected
```

Similarly, variables with `*` symbol needs to be wrapped in quotes for `[` tests to prevent the shell from performing glob expansion. This isn't necessary for `[[` tests.

## Handling Special Characters
For `[` tests, some characters need to be escaped as they carry special meanings. For example, `<` and `>` are redirection commands. These will need to be escaped if we want these symbols to be interpreted as comparison operators. Escaping these characters isn't necessary with `[[` tests.

As string comparison operators, these symbols compare strings according to their place in the alphabetical order. `b > a` should return true as 'b' comes after 'a'.

```bash
[ a > b ] && echo "true"
# The above will output 'true' and a file 'b' will be created 
# as the redirection command '>' took effect

[ a \> b ] && echo "true"
# The above has no output. Behaves as expected

[[ a > b ]] && echo "true"
# The above has no output. Behaves as expected
```

+++

Expression grouping with `(...)` needs to be escaped for `[` tests, but not in `[[` tests. See below:

```bash
[ \(expression1 && expression2\) && expression3 ]
[[ (expression1 && expression2) && expression3 ]]
```

## Conditional Evaluation

Conditional evaluation (AND, OR) works differently for `[` vs. `[[` tests. The following shows the syntax for both types of tests.

```bash
# AND evaluation
[ $var1 = a -a $var2 = b ] && echo "true"

[ $var1 = a ] && [ $var2=b ] && echo "true"

[[ $var1 = a && $var = b ]] && echo "true"

# OR evaluation
[ $var1 = a -o $var2 = b ] && echo "true"

[ $var1 = a ] || [ $var2 = b ] && echo "true"

[[ $var1 = a || $var2 = b ]] && echo "true"
```

`&&` and `||` does not work within a *single* test expression for `[` tests. They either need to be split or replaced with `-a`, `-o` operators.


## Regex Matching
`[[` tests offer regex matching. This is not available in `[` tests.

```bash
[[ $answer =~ ^y(es)?$ ]]

# returns true if answer is either 'y' or 'yes'
```

## Pattern Matching
Pattern matching only works in `[[` tests, and not available in `[`. This is achieved with the use of `*` wildcard character

```bash
input="abcdfoobarefgh"

[[ $input = *"foobar"* ]] && echo "true" # This is equivalent to string contains check

[[ $input = "abcd"* ]] && echo "true" # Checks if string is prefixed with 'abcd'
```
