---
title: Loops in Bash
description: Walkthrough different loop syntax in Bash 
tags: ['bash']
timestamp: 1619879006573
---

# Loops in Bash
Resources:
- <https://www.cyberciti.biz/faq/bash-for-loop>
- <https://ryanstutorials.net/bash-scripting-tutorial/bash-loops.php>

## For Loops

### Iterate a List of Words

Iterate through a series of space-delimited words.

```bash
words="abc def ghi"
for w in $words
do
  echo "$w"
done

# Output:
# abc
# def
# ghi
```
### Iterate a Range of Integers

Iterate using range of numbers (inclusive on both sides).
```bash
for i in {1..3}
do
  echo "$i"
done

# Output:
# 1
# 2
# 3
```

The ranges can go in both directions
```bash
for i in {3..1}
do
  echo "$i"
done

# Output:
# 3
# 2
# 1
```

Increment can be specified too (as the 3rd value in `{}`)
```bash
for i in {1..10..2}
do
  echo "$i"
done

# Output:
# 1
# 3
# 5
# 7
# 9
```

### Three-expression Syntax
The typical for-loop syntax is possible as well.
```bash
for (( i=0; i<5; i++ ))
do
  echo "$i"
done

# Output:
# 1
# 2
# 3
# 4
# 5
```

### Iterate Results of a Sub-command
```bash
# Let 'command' return values 'foo bar'

for result in $(command)
do
  echo "$result"
done

# Output
# foo
# bar
```

<PostDate />
<PageTags />
