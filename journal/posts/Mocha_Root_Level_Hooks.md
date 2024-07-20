---
title: Mocha Root Level Hooks
description: Using root level hooks with Mochajs
tags: ['javascript', 'testing', 'mocha']
timestamp: 1550894461000
---

## Mocha Root Level Hooks

We can use `before` and `after` hooks outside of describe blocks. These are root-level hooks that are run in the context of the entire test suite. E.g. before root-level hook will run at the very beginning before all test cases.

Root-level hooks can be located in any test file.

