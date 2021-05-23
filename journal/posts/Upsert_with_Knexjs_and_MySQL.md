---
title: Upsert with Knexjs and MySQL
description: How to create an UPSERT database operation with Knexjs
tags: ['knexjs', 'mysql']
timestamp: 1559376706000
---

## Upsert with Knexjs and MySQL

Knexjs does not support UPSERT operations out of the box. This can be achieved by building a raw SQL query.

We can observe how this works by creating a helper to perform UPSERT operation
```js
/**
 * let alarmObj be the object we want upsert-ed in the table 'alarms'.
 * `alarmObj.device_id` is set to be unique in the database table.
 */
function upsert(alarmObj) {
  /**
   * We build an insert query
   */
  const insert = knex('alarms').insert({
    ...alarmObj,
    id: uuidv4(),
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  });

  /**
   * We prepare the update object in case the UPSERT operation
   * ends up UPDATING the table row
   */
  const alarmUpdateObj = { ...alarmObj };
  delete alarmUpdateObj.device_id;
  alarmUpdateObj.updated_at = knex.fn.now();
  /**
   * We prepare an UPDATE string for the UPDATE operation
   *
   * The UPDATE string takes the following format
   * "field1=value1, field2=value2..."
   */
  const rawUpdateParameters = Object.keys(alarmUpdateObj)
    .map((field) => `${field}=${alarmUpdateObj[field]}`)
    .join(', ');

  /**
   * Finally, we build an UPSERT instruction with a raw SQL query.
   * 
   * The knex.raw query essentially translates to MYSQL query:
   * INSERT INTO tableName VALUES (x, y)
   *   ON DUPLICATE KEY UPDATE field1=value1, field2=value2;
   *
   * What happens when there is a duplicate device_id:
   * 1. Attempt to insert new row
   * 2. Duplicate key error on unique_key device_id
   * 3. Instead of INSERT, MySQL will update the targeted row with
   *    provided update values
   */
  return knex.raw('? ON DUPLICATE KEY UPDATE ?', [
      insert,
      knex.raw(rawUpdateParameters)
  ]);
}
```

* The first part builds the INSERT query (without actually running it). The query is then injected into the raw SQL query via parameter binding.
* The second part builds an update string which is required for the second part of the ON DUPLICATE KEY syntax. Because it is only a string, a knex.raw() wrapper is needed when injecting into the raw SQL query.

ON DUPLICATE KEY syntax docs: <https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html>

knexjs `raw` method docs: <https://knexjs.org/#Raw>

<PostDate />
<PageTags />
