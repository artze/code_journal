#!/bin/sh

cat << EOF > ./journal/posts/$1.md
---
title: `echo "$1" | sed "s/_/ /g"`
description: 
tags: []
timestamp: `date +%s%N | cut -b1-13`
---

# 


<PostDate />
<PageTags />
EOF

subl ./journal/posts/$1.md
