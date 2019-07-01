---
title: Nodejs Express errorHandler Method Signature
description: Express errorHandler number of required arguments 
tags: ['nodejs']
timestamp: 1549537870000
---

## Nodejs Express errorHandler Method Signature

Error-handling middleware always takes four arguments. You must provide four arguments to identify it as an error-handling middleware function. *Even if you don’t need to use the next object, you must specify it to maintain the signature*. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors. For details about error-handling middleware.

<PostDate />
<PageTags />
