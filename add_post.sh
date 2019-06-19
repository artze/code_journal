#!/bin/sh

cat << EOF > ./posts/$1.md
---
title: `echo "$1" | sed "s/_/ /g"`
description: 
tags: []
timestamp: `date +%s%N | cut -b1-13`
---


<PageTags />
EOF

subl ./posts/$1.md
