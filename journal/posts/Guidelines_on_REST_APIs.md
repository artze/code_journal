---
title: Guidelines on REST APIs
description: Notable points on REST API design
tags: ['api design']
timestamp: 1518393600000
---

# Guidelines on REST APIs

## Organizing API Around Resources

Focus on the business entities that the web API exposes. For example, in an e-commerce system, the primary entities might be customers and orders. Creating an order can be achieved by sending an HTTP POST request that contains the order information. The HTTP response indicates whether the order was placed successfully or not. When possible, resource URIs should be based on nouns (the resource) and not verbs (the operations on the resource).

```
http://adventure-works.com/orders // Good
http://adventure-works.com/create-order // Avoid
```

A resource does not have to be based on a single physical data item. For example, an order resource might be implemented internally as several tables in a relational database, but presented to the client as a single entity. Avoid creating APIs that simply mirror the internal structure of a database. The purpose of REST is to model entities and the operations that an application can perform on those entities. A client should not be exposed to the internal implementation.

Adopt a consistent naming convention in URIs. In general, it helps to use plural nouns for URIs that reference collections. It’s a good practice to organize URIs for collections and items into a hierarchy. For example, /customers is the path to the customers collection, and /customers/5 is the path to the customer with ID equal to 5. This approach helps to keep the web API intuitive. Also, many web API frameworks can route requests based on parameterized URI paths, so you could define a route for the path /customers/{id}.

Also consider the relationships between different types of resources and how you might expose these associations. For example, the /customers/5/orders might represent all of the orders for customer 5. You could also go in the other direction, and represent the association from an order back to a customer with a URI such as /orders/99/customer.

In more complex systems, it can be tempting to provide URIs that enable a client to navigate through several levels of relationships, such as /customers/1/orders/99/products. However, this level of complexity can be difficult to maintain and is inflexible if the relationships between resources change in the future. Instead, try to keep URIs relatively simple. Once an application has a reference to a resource, it should be possible to use this reference to find items related to that resource. The preceding query can be replaced with the URI /customers/1/orders to find all the orders for customer 1, and then /orders/99/products to find the products in this order.

Extracted from [microsoft docs](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)
