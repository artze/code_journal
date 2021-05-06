#!/bin/sh

cat << EOF > ./journal/posts/$2.md
---
title: `echo "$2" | sed "s/_/ /g"`
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
