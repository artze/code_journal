---
title: Shell Script to Auto-deploy with Git Hook
description: Shell script to run npm commands and auto-deploy with Git Hook
tags: ['server setup', 'shell']
timestamp: 1537510932000
---

## Shell Script to Auto-deploy with Git Hook

```sh
#!/bin/sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "POST RECEIVE hook triggered" \

echo "POST-RECEIVE: git checkout ..."
git --work-tree=/var/repos/project --git-dir=/var/repos/project/project.git checkout -f

cd /var/repos/project

echo "POST-RECEIVE: npm install ..." \
&& npm install \

echo "POST-RECIEVE: building app ..." \
&& npm run build \

echo "POST-RECEIVE: removing old files from www ..." \
&& rm -rf /var/www/html/* \

echo "copying build files to www ..." \
&& cp -a /var/repos/project/dist/. /var/www/html/ \

echo "copying operation complete"
```

Notes:
* First two lines to initialize nvm related variables to enable npm command to work
* At the very end, replace files in /www from which nginx will serve.

<PostDate />
<PageTags />
