#!/bin/sh

cat << EOF > ./posts/$1.md
---
title: `echo "$1" | sed "s/_/ /g"`
description: 
tags: []
timestamp: 
---


<PageTags />
EOF

subl ./posts/$1.md
