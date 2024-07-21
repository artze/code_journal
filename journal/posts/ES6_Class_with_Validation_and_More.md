---
title: ES6 Class with Validation and More
description: ES6 class encapsulating an object model, validation methods and serializing/deserializing methods
tags: ['javascript']
timestamp: 1544930394000
---

## ES6 Class with Validation and More

What I’m trying to achieve:

- Create a class to represent Users
- Validate object values when instantiating a user object with new User()
- Serialize user object instances to arrays as a means of size compression
- De-serialize arrays back to user objects, i.e. mapping arrays back to objects

```js
const validator = require('../lib/validator/validator');
const InvalidInputError = require('../lib/validator/InvalidInputError');

class User {
  constructor(id, type, userName, firstName, lastName, email) {
    this.id = id;
    this.type = type;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    const validators = [validator.validateId, validator.validateNonEmpty];
    this.setWithValidation('_id', id, validators);
  }

  get type() {
    return this._type;
  }

  set type(type) {
    const validators = [validator.validateType, validator.validateNonEmpty];
    this.setWithValidation('_type', type, validators);
  }

  get userName() {
    return this._userName;
  }

  set userName(userName) {
    const validators = [validator.validateUserName, validator.validateNonEmpty];
    this.setWithValidation('_userName', userName, validators);
  }

  get firstName() {
    return this._firstName;
  }

  set firstName(firstName) {
    const validators = [validator.validateFirstOrLastName];
    this.setWithValidation('_firstName', firstName, validators);
  }

  get lastName() {
    return this._lastName;
  }

  set lastName(lastName) {
    const validators = [validator.validateFirstOrLastName];
    this.setWithValidation('_lastName', lastName, validators);
  }

  get email() {
    return this._email;
  }

  set email(email) {
    const validators = [validator.validateEmail];
    this.setWithValidation('_email', email, validators);
  }

  setWithValidation(key, value, validators) {
    const dataIsValid = validators.every(function (validator) {
      return validator(value);
    });
    if (!dataIsValid) {
      throw new InvalidInputError(
        `Input Error: User input has incorrect \'${key}\' field`,
      );
    }
    this[key] = value ? value : null;
  }

  serializeToArray() {
    return [
      this.type,
      this.id,
      this.userName,
      this.firstName,
      this.lastName,
      this.email,
    ];
  }

  static deserializeToObject(arrayOfObjectValues) {
    const userObject = {
      id: arrayOfObjectValues[1],
      userName: arrayOfObjectValues[2],
      firstName: arrayOfObjectValues[3],
      lastName: arrayOfObjectValues[4],
      email: arrayOfObjectValues[5],
      type: arrayOfObjectValues[0],
    };

    return userObject;
  }
}
```

Why I did it this way:

- Setter methods are set up so that I could trigger a centralized validation method setWithValidation() whenever a user object is instantiated with new User() or when instance variables are changed.
- The types of validations implemented are easily visible and re-configurable. It is easy to see what validations are applied to each field, and any changes can be done by simply adding or removing elements in the validators array in each setter method.
- The validation implementation details are outsourced to another module so that the User class would contain only details that describe its characteristics and behavior, nothing more.
- Let’s say I have an array of object instances with mixed types (User, Product etc.), all required to be serialized before sending them over a POST request. I could simply call serializeToArray() on each instance and the details of serialization will be taken care of by its respective method definitions.
