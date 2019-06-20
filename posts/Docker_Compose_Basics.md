---
title: Docker Compose Basics
description: Create Docker Containers with docker-compose
tags: ['docker']
timestamp: 1541135481000
---

## Docker Compose Basics

You could organize your docker container configurations and create multiple containers at once with docker-compose.

```yaml
version: '3'

services:
  nats-mon:
    container_name: nats-mon
    image: nats-mon:latest
    ports:
      - 8282:8282
    environment:
      - STAN_URL=nats://db01.d2sphere.com:4222
      - STAN_MONITOR_URL=http://db01.d2sphere.com:8222
      - STAN_CLUSTER=test-cluster
      
  nats-mon2:
    container_name: nats-mon2
    image: nats-mon:latest
    volumes:
      - /var/lib/docker/volumes/nats_vol2/_data:/datastore
    ports:
      - 8283:8283
    environment:
      - STAN_URL=nats://db01.d2sphere.com:4223
      - STAN_MONITOR_URL=http://db01.d2sphere.com:8223
      - STAN_CLUSTER=test-cluster
    
networks:
  default:
    external:
      name: nats-cluster-docker-compose_default

```

* A service definition contains configuration that is applied to each container started for that service
* The volumes tag creates a directory within the filesystem which is accessible by the container and maps it to a name. In this case, the application accesses this directory with /datastore
* The network configuration here tells docker that these containers will join an existing docker network named nats-cluster-docker-compose_default


<PostDate />
<PageTags />
