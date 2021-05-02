---
title: Parsing Command Line Arguments
description: Parse command line arguments in shell script
tags: ['shell']
timestamp: 1570080424118
---

## Parsing Command Line Arguments
`getopts` command can be used to parse single character options e.g. `-a` or `-al`

For long options with arguments e.g. `--env dev --db test`, see script below:

```sh
#!/bin/bash 
while [ "${1:-}" != "" ]; do
  case "$1" in
    "--env")
      shift
      export NODE_ENV=$1 #do something with long option arg
      ;;
    "--db")
      shift
      export DB_NAME=$1 #do something with long option arg
      ;;
    *)
      exit 1
      ;;
  esac
  shift
done
```

<PostDate />
<PageTags />
