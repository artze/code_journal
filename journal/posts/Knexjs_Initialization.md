---
title: Knexjs Initialization
description: Setting up Knexjs. Making db connection, setting default timezone and verifying connection
tags: ['knexjs']
timestamp: 1557889906000
---

## Knexjs Initialization

Establishing connection with Database, setting default time zone and verifying connection.

```js
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'xxx',
    password: 'xxx',
    database: 'xxx'
  },
  // after connection is made, set time zone to UTC
  pool: {
    afterCreate(connection, done) {
      connection.query('SET time_zone = "+00:00";', (err) => {
        done(err, connection);
      })
    }
  }
})

// Fetch MySql version to verify connection is successful
knex.raw("SELECT VERSION()")
  .then(() => {
    console.log('DB connection established')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = knex;
```
