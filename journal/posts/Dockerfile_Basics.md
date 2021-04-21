---
title: Dockerfile Basics
description: Create a Docker image with Dockerfile
tags: ['docker']
timestamp: 1541139671000
---

## Dockerfile Basics

Encapsulate your application within a container that has a runtime environment set up correctly.

A docker image is required to create this container, and a Dockerfile is what you need to build this image.

A Dockerfile generally:

* Specifies what the runtime environment your application needs (e.g. Nodejs). A common practice is to pull an existing docker ‘base image’.
* Allows you to run shell commands
* Specifies files (source code) to copy into your container for your application to run
* Specifies which port your application is publishing to
* Includes the command required to run your app

```sh
FROM node:8-alpine

# prepare project directory within container
RUN mkdir -p /opt/nats-streaming-console/
# Specifies the current working directory. RUN or cd commands will use this directory as reference point
WORKDIR /opt/nats-streaming-console/
# Copy source code into container
COPY <insert/source/code/path> /opt/nats-streaming-console/

# install dependencies, build application
RUN npm install
RUN npm run build-css
RUN npm run build

# application will publish to this port
EXPOSE 8282

#command to run application
CMD ["node", "server"]
```

With the file ready, you could create a Docker image (in your directory with Dockerfile) `docker build -t <insert img name>` .

<PostDate />
<PageTags />
