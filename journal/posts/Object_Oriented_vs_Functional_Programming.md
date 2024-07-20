---
title: Object Oriented vs Functional Programming
description: A comparison between Object Oriented Programming and Functional Programming
tags: ['programming']
timestamp: 1544955671000
---

## Object Oriented vs Functional Programming

I will compare Object Oriented Programming (OOP) and Functional Programming with the following scenario:

Let’s say we need to record the net salaries (after deducting taxes) of each employee and update their salaries at some points in time. There are 2 different types of employees — Directors (with a 45% salary tax) and Managers (with a 35% salary tax).

### Object Oriented Approach

The OOP approach would involve classes to represent different employees:

```js
class Director {
  constructor(name, netSalary) {
    this.name = name;
    this.netSalary = netSalary;
  }

  updateSalary(grossSalaryChange) {
    this.netSalary = this.netSalary + grossSalaryChange * 0.55;
  }
}

class Manager {
  constructor(name, netSalary) {
    this.name = name;
    this.netSalary = netSalary;
  }

  updateSalary(grossSalaryChange) {
    this.netSalary = this.netSalary + grossSalaryChange * 0.65;
  }
}
```

Instances of these classes will then be created to represent each employee, like so:

```js
let directorsArr = [
  new Director('Thomas', 220000),
  new Director('Michael', 200000),
];

let managersArr = [
  new Manager('Robert', 100000),
  new Manager('Sandra', 105000),
];
```

When the salaries change, we could simply call updateSalaryon each instance, which will update netSalary contained within each object instance. Done.

### Functional Programming Approach

Let’s say the name and netSalary of all employees are represented like so:

```js
let directorsArr = [
  ['Thomas', 220000],
  ['Michael', 200000],
];

let managersArr = [
  ['Robert', 100000],
  ['Sandra', 105000],
];
```

The salary update operation (let’s say $2000 increase across the board) could be carried out as follows:

```js
function updateSalaryPerEmployee(type, employee, grossSalaryChange) {
  let updatedEmployee = employee.slice();
  switch (type) {
    case 'director':
      updatedEmployee[1] = employee[1] + grossSalaryChange * 0.55;
      break;

    case 'manager':
      updatedEmployee[1] = employee[1] + grossSalaryChange * 0.65;
      break;
  }
  return updatedEmployee;
}

function updateSalariesOfEmployees(type, employeesArr, grossSalaryChange) {
  return employeesArr.map(function (employee) {
    return updateSalaryPerEmployee(type, employee, grossSalaryChange);
  });
}

// To get an updated view of employees and their net salaries

let updatedDirectorsArr = updateSalariesOfEmployees(
  'director',
  directorsArr,
  2000,
);
let updatedManagersArr = updateSalariesOfEmployees(
  'manager',
  managersArr,
  2000,
);

console.log(directorsArr);
// will output [ [ 'Thomas', 220000 ], [ 'Michael', 200000 ] ]

console.log(managersArr);
// will output [ [ 'Robert', 100000 ], [ 'Sandra', 105000 ] ]

console.log(updatedDirectorsArr);
// will output [ [ 'Thomas', 221100 ], [ 'Michael', 201100 ] ]

console.log(updatedManagersArr);
// will output [ [ 'Robert', 101300 ], [ 'Sandra', 106300 ] ]
```

The functional approach involves defining functions that receives all the needed inputs (in this case, type of employee, employee data and salary changes) and returns a fresh copy of updated data.

### Comparison

The OOP approach attempts to represent each employee with an object that contains related data and methods which alter these data. These alterations are said to change the ‘state’ of the object. The object data could show only its current state and would have ‘forgotten’ its previous states. In other words, if we look at the object data at a point in time, there is no way of knowing if the state was changed before.

The Functional Programming approach makes no attempt to model real-life objects with specific sets of attributes or methods. Rather, it is a black-box that receives input, processes it and produces output. It knows nothing about data and is completely dependent on data being fed through its input. This approach does not alter the ‘state’ of data (the original data remains intact) and it is easy to figure out if data had been updated, e.g. by comparing directorsArr and updatedDirectorsArr.

### The Expression Problem

The strengths and weaknesses of each approach can be seen when we wish to extend the application, either by adding a new type of employee or by redefining the calculation of netSalary.

Let’s say we need to add a new type of employee, Junior (with a 20% salary tax) into the picture:

- In the OOP approach, we simply need to add a new class Junior and we are good to go.
- In the Functional approach, we will need to add a case for Junior in all functions that take employee as a parameter. A cumbersome change when the application becomes complex.

In another case, let’s say the company now has a retirement fund policy, requiring a further deduction of 10% across the board, thus altering the calculation of netSalary.

- In the OOP approach, the updateSalary method will need to be modified in each class. Cumbersome.
- In the Functional approach, only the function updateSalaryPerEmployee needs to be adjusted.

### OOP: Other Strengths and Weaknesses

The OOP approach is generally easier to grasp in the context of modeling real-world objects. This model allows the idea of inheritance too, where shared characteristics can be retained in the parent class, whilst children classes hold unique characteristics. This approach makes it easy to reuse code and spawn new child classes as they arise (i.e. methods that previously accept a class type will accept newly created descendant types).

By having characteristics of Objects in one place, any changes in characteristics will become easy to deal with, as it only involves modifications to that class.

There are pitfalls too. By following too rigidly to the inheritance structure, applications can become needlessly complex. Imagine that Feature A, Feature B and Feature C of an application share 1 or 2 common attributes. One might introduce an abstraction layer as a parent to these 3 features to capture their shared characteristics. Many abstraction layers can pop up at all levels in the hierarchy, each grouping different sets of features. In this scenario, it can become difficult to determine where modifications need to be made when changes are necessary.

By strictly organizing attributes and behaviors into classes, problems arise when we have methods that cut across many data types — where do we place them? One might place these methods in a Util class somewhere. As the application grows, these classes might expand and multiply into an incomprehensible mess. The ambiguity of organization is also apparent when we have an Email class — should we include a sendEmail() method within the Email class itself? With that, it could become difficult to achieve code consistency within a team.

### Functional Programming: Other Strengths and Weaknesses

As we observed earlier, OOP mutates the state of an object. In a scenario where multiple operations are accessing the state of an object and manipulating it in a concurrent fashion, the outcomes of the same set of operations might become inconsistent. Because state is immutable in Functional Programming, we can be sure that the input of a function is exactly what is intended, therefore producing consistent output. Another side benefit is that we no longer need to maintain the myriad states of an application, i.e. what is the state of Object X in a particular stage of application execution?

Because pure functions depend only on the input fed to them, testing and debugging becomes more straightforward. In contrast, in the OOP approach, let’s say we have a object.doSomething() which manipulates one of its attributes. Testing/debugging it would require us to consider the state of that attribute at that moment to understand the expected outcome.

Generally, pure Functional Programming has a steeper learning curve and it can be difficult to combine pure functions into a complete application. In some cases, the idea of ‘immutable state’ does not work, e.g. when a user clicks on a tab on the nav bar, it makes sense to update the state of the clicked tab to ‘highlighted’. Maintaining ‘state immutability’ would make things needlessly complicated in this context.

### When to Use Which

OOP approach works great if we are trying to model real world things (think ‘nouns’) and when object characteristics along with their classifications are clear in the beginning. Generally, OOP shines when trying to represent data models such as Users, Accounts, Products etc. in an application.

When the task at hand is of a procedural nature, or involves assembling together a set of actions (think ‘verbs’) like data processing, the Functional approach could work well. In the context of web applications, services like route handling or data analytics would be better left with the Functional approach (although they might not be purely Functional Programming as they are not completely without side-effects).
