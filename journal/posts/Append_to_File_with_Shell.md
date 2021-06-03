---
title: Append to File with Shell
description: Various ways to append text to file in Shell
tags: ['shell']
timestamp: 1622730437190
---

# Append to File with Shell
Append output of a command to an existing file with the redirection operator `>>`

```sh
echo "Text to append" >> file.txt
```

+++

To _interpret_ backslash escaped characters, we can use the `-e` option:
```sh
echo -e "abc\ndef\nghi" >> file.txt

# Content of file.txt:
# abc
# def
# ghi
```

+++

We can append output of _any_ command, for example:
```sh
date +"Year: %Y, Month: %m, Day: %d" >> file.txt
```

+++

Append with Heredoc. A Here document (Heredoc) is a type of redirection that allows you to pass multiple lines of input to a command. More on heredoc [here](./Heredoc.md)
```sh
cat << EOF >> file.txt
a quick brown fox jumps over the lazy dog
append file with heredoc
EOF
```

<PostDate />
<PageTags />
