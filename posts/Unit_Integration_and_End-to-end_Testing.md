---
title: Unit Integration and End-to-end Testing
description: An introduction to unit, integration and end-to-end testing concepts
tags: ['testing']
timestamp: 1554868905000
---

## Unit, Integration and End-to-end Testing

### Unit Testing

Tests the smallest unit of functionality, typically a method/function (e.g. given a class with a particular state, calling x method on the class should cause y to happen). Unit tests should be focused on one particular feature (e.g., calling the pop method when the stack is empty should throw an InvalidOperationException). Everything it touches should be done in memory; this means that the test code and the code under test **should not**:

* Call out into other modules
* Access the network
* Hit a database
* Use the file system
* Spin up a thread

All dependencies should be stubbed/mocked using the appropriate techniques so you can focus on what the unit of code is doing, not what its dependencies do.

In short, unit tests are as simple as possible, easy to debug, reliable (due to reduced external factors), fast to execute and help to prove that the smallest building blocks of your program function as intended before they’re put together. The caveat is that, although you can prove they work perfectly in isolation, the units of code may blow up when combined.

### Integration Testing

Integration tests build on unit tests by combining the units of code to ensure that the resulting combination functions correctly. Integration tests can and will use threads, access the database or do whatever is required to ensure that interactions between modules work well.

Integration tests don’t necessarily prove that a complete feature works, and may be testing implementation details that users do not care about.

### End-to-end Testing
Tests whether the flow of an application right from start to finish is behaving as expected by simulating real user scenarios and validating outcomes.

### Striking a Balance between Tests
A good starting point is to have a 70/20/10 split: 70% unit tests, 20% integration tests, and 10% end-to-end tests.


Sources:

<https://stackoverflow.com/questions/4904096/whats-the-difference-between-unit-functional-acceptance-and-integration-test>

<https://codeahoy.com/2016/07/05/unit-integration-and-end-to-end-tests-finding-the-right-balance/>

<PostDate />
<PageTags />
