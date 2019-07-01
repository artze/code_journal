---
title: Upsert with Knexjs and MySQL
description: How to create an UPSERT database operation with Knexjs
tags: ['knexjs', 'mysql']
timestamp: 1559376706000
---

## Upsert with Knexjs and MySQL

Knexjs does not support UPSERT operations out of the box. This can be achieved by building a raw SQL query.

```js
const insert = knex('tableName').insert({
  ...newObj,
  id: uuidv4(),
  created_at: knex.fn.now(),
  updated_at: knex.fn.now()
});

// create string of raw update column parameters (e.g. field1=value1, field2=value2)
const rawUpdateParameters = Object.keys(updateObj)
  .map((field) => `${field}=${updateObj[field]}`)
  .join(', ');

knex.raw('? ON DUPLICATE KEY UPDATE ?', [
    insert,
    knex.raw(rawUpdateParameters)
]);

// The raw query essentially translates to MYSQL query:
// INSERT INTO tableName VALUES (x, y)
//   ON DUPLICATE KEY UPDATE field1=value1, field2=value2;
```

* The first part builds the INSERT query (without actually running it). The query is then injected into the raw SQL query via parameter binding
* The second part builds an update string which is required as the second part of the ON DUPLICATE KEY syntax. Because it is only a string, a knex.raw() wrapper is required when injecting into the raw SQL query

ON DUPLICATE KEY syntax docs: <https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html>

knexjs `raw` method docs: <https://knexjs.org/#Raw>

<PostDate />
<PageTags />
