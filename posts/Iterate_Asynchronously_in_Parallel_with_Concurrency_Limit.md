---
title: Iterate Asynchronously in Parallel with Concurrency Limit
description: Pattern that iterates through array of tasks and runs them asynchronously and in parallel with a concurrency limit
tags: ['javascript', 'design pattern']
timestamp: 1548760860000
---

## Iterate Asynchronously in Parallel with Concurrency Limit

```js
const tasks = []; // array of async tasks
let concurrency = 2, running = 0, completed = 0, index = 0;

function next() {
    while(running <= concurrency && index < tasks.length) {
        task = tasks[index++];
        task(function() {
            // async callback: will execute when async task completes

            // when all tasks are completed, exit function
            if(completed === tasks.length) {
                return finish();
            }

            // when there are still tasks remaining in array
            completed++, running--;
            next(); // trigger while loop once again
        });
        running++;
    }
}

next();

function finish() {
    // all tasks completed
}
```

A function with a pattern above works nicely until the same function is called many times, where there could be more than 2 concurrent tasks running at once. What we need in this case is a ‘global’ concurrency limit, where concurrency limits & counts are kept in a central entity. This can be achieved with a TaskQueue class implementation:

```js
class TaskQueue {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    pushTask(task) {
        this.queue.push(task);
        this.next();
    }

    next() {
        while(this.running <= this.concurrency && this.queue.length) {
            const task = this.queue.shift();
            task(function() {
                this.running--;
                this.next();
            })
            this.running++;
        }
    }
}

const downloadTask = new TaskQueue(2);
downloadTask.pushTask(task1)
downloadTask.pushTask(task2)
```

<PostDate />
<PageTags />
