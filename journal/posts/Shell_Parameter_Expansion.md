---
title: Shell Parameter Expansion
description: 
tags: ['bash']
timestamp: 1619340474849
---

# Shell Parameter Expansion

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

+++

```bash
${parameter:offset}
${parameter:offset:length}
```

These are substring operations:
- `offset` is a zero-based index. Outputs substring from `offset` index onwards (inclusive) up to the end of string.
- `length` is the desired length of substring. Outputs substring from `offset` index onwards up to the given `length`.

More can be found [here](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html)


<PostDate />
<PageTags />
