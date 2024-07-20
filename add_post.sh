#!/bin/sh

filename=$1

cat << EOF > ./journal/posts/${filename}.md
---
title: `echo ${filename} | sed "s/_/ /g"`
description: 
tags: []
timestamp: `date +%s%N | cut -b1-13`
---

# 

EOF
