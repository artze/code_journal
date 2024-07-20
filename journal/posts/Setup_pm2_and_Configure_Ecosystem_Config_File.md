---
title: Setup pm2 and Configure Ecosystem Config File
description: Setup nodejs app with pm2 and configure with ecosystem.config.js file
tags: ['server setup', 'pm2']
timestamp: 1537776731000
---

## Setup pm2 and Configure Ecosystem Config File

### Setup pm2

Follow this guide to set up nodejs app with pm2:

<https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04>

### Configure with ecosystem.config.js

An alternate way to configure pm2 is by using pm2’s config file ecosystem.config.js

- For starters, install pm2

```sh
npm install -g pm2
```

- Create a folder (in a directory of your choice) to store pm2 config file. For my case, i used `/var/pm2-config/` . Then generate a config file like so:

```sh
cd /var/pm2-config/
pm2 ecosystem simple #this generates a 'ecosystem.config.js' file
```

- The config file contains basic entries — your app name and location of script file. Edit the file to your needs. Example:

```js
module.exports = {
  apps: [
    {
      name: 'my-app',
      script: './path/to/app/entry/point.js', // path needs to be relative from ecosystem.config.js
      watch: true, // any changes to app folder will get pm2 to restart app
      env: {
        NODE_ENV: 'development', // define env variables here
      },
    },
  ],
};
```

- After which, (within /pm2-config) you could run pm2 start ecosystem.config.js to get PM2 to run your app, and add it into its process list.

Note: within ecosystem.config.js the apps array can hold multiple objects. If you have multiple nodejs apps, you could place each within the array. Running pm2 start ecosystem.config.js will get pm2 to run all apps listed in the array.
