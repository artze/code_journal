#!/bin/sh

filename=""
if [ "$1" = "-o" ]; then
  filename=$2
else
  filename=$1
fi

cat << EOF > ./journal/posts/${filename}.md
---
title: `echo ${filename} | sed "s/_/ /g"`
description: 
tags: []
timestamp: `date +%s%N | cut -b1-13`
---

# 


<PostDate />
<PageTags />
EOF

if [ "$1" = "-o" ]; then
  subl ./journal/posts/$2.md
fi
