---
title: Data Access Object and Lazy Loading Pattern
description: Construct a Data Access Object with Lazy Loading of relational data
tags: ['design pattern']
timestamp: 1564890718325
---

## Data Access Object and Lazy Loading Pattern

Data Access Object (DAO) is an object containing methods that retrieve data from a database or trigger database queries. Together with the idea of Lazy Loading, we could set up a pattern as follows.

Imagine we have a schema with a table 'books' with fields _id_, _title_ and _year_, and a separate table for 'authors'.

```js
// High level books object to access a 'books' table
const Books = {
  getBooks() {
    // Database query to retrieve all books
    const result // = Database query here

    // Assume that result is a 2D array
    // Map each query result into a Book object
    const books = result.map((book) => new Book(book[0], book[1], book[2]))
  }
}


// Book class that can be instantiated to represent each book
class Book {
  constructor(id, title,  year) {
    this.id = id;
    this.title = title;
    this.year = year;
  }

  getAuthor() {
    // Database query to retrieve author
    const author // = Database query to retrieve related author with book id
    return author
  }
}

```

Notes:

- To reduce overhead, retrieving all books will only retrieve high level data without getting all relational data.
- Each `Book` instance has access to relational data (`Author`) and can be called as needed.
