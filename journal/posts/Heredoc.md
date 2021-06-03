---
title: Heredoc
description: Here document in Shell
tags: ['shell']
timestamp: 1622731076839
---

# Heredoc
A Here document (Heredoc) is a type of redirection that allows you to pass multiple lines of input to a command.

The syntax of writing HereDoc takes the following form:
```sh
[COMMAND] <<[-] 'DELIMITER'
  HERE-DOCUMENT
DELIMITER
```

- The first line starts with an optional command followed by the special redirection operator `<<` and the delimiting identifier.
- You can use any string as a delimiting identifier, the most commonly used are EOF or END.
- If the delimiting identifier is unquoted, the shell will substitute all variables, commands and special characters before passing the here-document lines to the command.
- Appending a minus sign to the redirection operator <<-, will cause all leading tab characters to be ignored. This allows you to use indentation when writing here-documents in shell scripts. Leading whitespace characters are not allowed, only tab.

See more [here](https://linuxize.com/post/bash-heredoc)

## Examples
Heredoc is most often used with the `cat` command.

An example with environment variables:
```sh
cat << EOF
The current working directory is: $PWD
You are logged in as: $(whoami)
EOF
```

Output:
```
The current working directory is: /home/john
You are logged in as: john
```

+++

What if we enclose the delimeter with quotes?
```sh
cat << "EOF"
The current working directory is: $PWD
You are logged in as: $(whoami)
EOF
```

Output:
```
The current working directory is: $PWD
You are logged in as: $(whoami)
```

Notice that no paramter expansion and command substitution is done by the shell

+++

Instead of displaying the output, we can redirect to file with `>` or `>>` operators:
```sh
cat << EOF > file.txt
The current working directory is: $PWD
You are logged in as: $(whoami)
EOF
```

`>` overwrites the file whilst `>>` appends to file.

<PostDate />
<PageTags />
