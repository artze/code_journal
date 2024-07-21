---
title: API Endpoints with User Dependent Resources
description: API design for private, user dependent resources
tags: ['programming', 'api design']
timestamp: 1558926706000
---

## API Endpoints with User Dependent Resources

It is common to have endpoints arranged like the following for resources that are below users in hierarchy:

`users/3/posts`

`users/32/posts`

For applications such as blog apps, this would make sense. Users are able to look into posts of other users (since they are publicly available).

But for private data such as payment details of each user, where each user could only look into his/her own payment details and would never be able to access other users’ payment data, the parts `users/:userId` becomes redundant. Also, in cases involving sensitive data, having a user’s id exposed would probably not be a good idea either.

One way to approach this is to make use of the `Authorization` token in request headers. The client could make a request to `/payments` API endpoint, and the backend API could decode the token and establish which user is making that request, and respond accordingly.
