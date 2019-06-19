---
title: Multi-Threading with ExecutorService
description: Execute multi-threading with Executor Service in Java
tags: ['java']
timestamp: 1537500000000
---

# Multi-Threading with Executor Service

* ExecutorServce: A service that manages a pool of threads — creates them, assigns tasks to them, queues tasks to newly available threads and shutsdown the pool at the end

* Runnables: holds tasks that will be fed into the pool of threads

```java
public void runMultiThread() {

    // Creates and makes ready a pool of 5 threads to wait for tasks
    ExecutorService executorService = Executors.newFixedThreadPool(5);

    // Define task for each Runnable which will be submitted to executorService for assingment to threads
    Runnable task1 = () -> {
        System.out.println("Inside task1 on thread: " + Thread.currentThread().getName());
        try {
            TimeUnit.SECONDS.sleep(10);
        } catch (InterruptedException e) {
            System.out.println(e);
        }
        System.out.println("Timeout ended for Task1");
    };

    Runnable task2 = () -> {
        System.out.println("Inside task2 on thread: " + Thread.currentThread().getName());
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            System.out.println(e);
        }
        System.out.println("Timeout ended for Task2");
    };

    Runnable task3 = () -> {
        System.out.println("Inside task3 on thread: " + Thread.currentThread().getName());
        try {
            TimeUnit.SECONDS.sleep(5);
        } catch (InterruptedException e) {
            System.out.println(e);
        }
        System.out.println("Timeout ended for Task3");
    };
    executorService.submit(task1);
    executorService.submit(task2);
    executorService.submit(task3);
    // shuts down executor service. If executorService is not shutdown, the pool will continue to wait for incoming tasks, causing the program to run forever.
    executorService.shutdown();
}

// console output:
// Inside task1...
// Inside task2...
// Inside task3...
// Timeout ended for Task2
// Timeout ended for Task3
// Timeout ended for Task1
````
<PostDate />
<PageTags />
