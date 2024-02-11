---
title: Git Cheatsheet
description: Common git commands
tags: ['git']
timestamp: 1502496000000
---

# Git Cheatsheet

```
#displays differences between working file and latest commit
git diff <filename>

#lists all commits
git log

#displays details and changes of latest commit
git show HEAD

#revert to latest commit and discards changes in working file
git checkout HEAD <filename>

#unstages a file from commit; working file remains untouched
git reset HEAD <filename>

#revert to previous commit; working file remains untouched
git reset <SHA>

#revert to previous commit; working files restored to specified commit
git reset --hard <SHA>

#show all branches and which is active
git branch

#create new branch
git branch <branch_name>

#switch to a different branch
git checkout <branch_name>

#merge (giver) branch to master. First go to master branch and use command below
git merge <giver_branch_name>

#destroy branch
git branch -d <branch_name>

#fetch changes from remote to local. Changes can be seen with 'git status' but not merged to local
git fetch

#prune all local branches that are deleted on remote
git remote prune origin
```
