---
title: Upsert with Knexjs and MySQL
description: How to create an UPSERT database operation with Knexjs
tags: ['knexjs', 'mysql']
timestamp: 1559376706000
---

## Upsert with Knexjs and MySQL

Knexjs does not support UPSERT operations out of the box. We can create our own UPSERT function using raw SQL query with `INSERT ... ON DUPLICATE KEY UPDATE` statement. See docs [here](https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html)).

We can illustrate this with an example. Let's say we want to UPSERT to a `users` table. The `users` table have the following columns:

- id (primary key, unique index)
- first_name
- last_name
- email (unique index)

The UPSERT function we are about to create will insert a new row _if_ the unique index is not violated; otherwise, it will simply UPDATE the row.

Our UPSERT function:

```js
function upsertUser({ first_name, last_name, email }) {
  /**
   * We build an insert query
   */
  const insert = knex('users').insert({
    first_name,
    last_name,
    email,
    id: uuidv4(),
    created_at: knex.fn.now(),
    updated_at: knex.fn.now(),
  });

  /**
   * We prepare the update object in case the UPSERT operation
   * ends up UPDATING the table row
   *
   * We omit the email here because this user  already exists
   * and we only want to update non-unique fields
   */
  const userUpdateObj = {
    first_name,
    last_name,
    updated_at: knex.fn.now(),
  };

  /**
   * We prepare an UPDATE string for the UPDATE operation
   *
   * The UPDATE string takes the following format
   * "field1=value1, field2=value2..."
   */
  const rawUpdateParameters = Object.keys(userUpdateObj)
    .map((field) => `${field}=${userUpdateObj[field]}`)
    .join(', ');

  /**
   * Finally, we build an UPSERT instruction with a raw SQL query.
   *
   * The following knex.raw query essentially translates to MYSQL query:
   * INSERT INTO tableName VALUES (x, y)
   *   ON DUPLICATE KEY UPDATE field1=value1, field2=value2;
   *
   * What happens with this SQL query:
   * 1. Attempt to insert new row
   * 2. Duplicate key error on unique_key device_id
   * 3. Instead of INSERT, MySQL will update the targeted row with
   *    provided update values
   */
  return knex.raw('? ON DUPLICATE KEY UPDATE ?', [
    insert,
    /**
     * We need to wrap our `rawUpdateParameters` with knex.raw()
     * because it is only a string (and not a knex object)
     *
     * knex.raw() docs: <https://knexjs.org/#Raw>
     */
    knex.raw(rawUpdateParameters),
  ]);
}
```

Our `upsertUser` function essentially prepares the INSERT and UPDATE parts of the `INSERT ... ON DUPLICATE KEY UPDATE` statement.

<PostDate />
<PageTags />
