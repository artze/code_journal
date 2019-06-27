---
title: Testing Asyc Functions with chai-as-promised
description: Testing async functions with chai-as-promised npm
tags: ['javascript', 'testing']
timestamp: 1550905261000
---

## Testing Asyc Functions with chai-as-promised

Set up chai-as-promised:

```js
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect
```

General syntax:
```js
it('Promise should be rejected with CustomError', function() {
  return expect(asyncFn()).to.be.rejectedWith(CustomError)
})

it('Promise should pass', function() {
  return expect(asyncFn()).to.be.fulfilled
})

// async-await alternative syntax
it('should work well with async/await', async function() {
  await expect(asyncFn()).to.be.rejectedWith(Error);
})
```

<PostDate />
<PageTags />
