---
title: Nodejs Streams
description: A thorough explanation of Nodejs streams, stream types, custom implementation of streams, and piping streams
tags: ['nodejs', 'stream']
timestamp: 1559981506000
---

## Nodejs Streams
Nodejs streams can handle two operating modes:
* **Binary mode**: Data is streamed in chunks such as buffers or strings. Useful for I/O operations
* **Object mode**: Streaming data is treated as a sequence of objects. Useful in composing processing units in functional fashion.

### Readable Streams
Has two modes: non-flowing and flowing

#### Non-flowing
* The default pattern for reading from Readable streams.
* Consist of attaching a listener for `readable` event which signals that new data is *available* to be read.
* Requires a `read()` method to synchronously read data from internal buffer, and returns a Buffer or String

```js
process.stdin
  .on('readable', () => {
  // When new readable data becomes available, this code block is executed
  let chunk;
  while((chunk = process.stdin.read()) !== null ) {
    console.log(`Chunk read: (${chunk.length}) "${chunk.toString()}"`)
  }
  })
  .on('end', () => process.stdout.write('End of stream'));

// Note: process.stdin is an instance of Readable stream and 
// inherits stream events and methods (e.g. read())
```

What’s happening here:
* The `read()` method *pulls* data from the internal buffers of the Readable stream when new readable data becomes available
* `read()` returns `null` when no more data is available in internal buffers. In this case, the program waits for another `readable` event to be fired and repeats the process.

#### Flowing Mode
* Works by attaching a listener to the `data` event.
* Data is *pushed* to the data listener as soon as it arrives
* Offers less flexibility to control the flow of data. Data is read as it arrives without control over how much data is read each time.

```js
process.stdin
  .on('data', (chunk) => {
  console.log(`Chunk read: (${chunk.length}) "${chunk.toString()}"`);
  })
  .on('end', () => process.stdout.write('End of stream'));
```

#### Implementing Readable Streams
* We can create our own implementation of Readable Stream by extending from stream.Readable class
* The custom stream class must provide an implementation of the `_read()` method which has the signature `readable._read(size)`. The `size` parameter specifies how many bytes the consumer wants to read in the current `_read()` invocation.

```js
const stream = require('stream');
const Chance = require('chance');
const chance = new Chance();

class RandomStream extends stream.Readable {
  constructor(options) {
  super(options);
  }

  _read(size) {
  const chunk = chance.string();                          // [1]
  console.log(`Pushing chunk of size: ${chunk.length}`);
  this.push(chunk, 'utf8');                               // [2]
  if(chance.bool({ likelihood: 5 })) {                    // [3]
    this.push(null);
  }
  }
}

// [1] Generates a random string using chance lib
// [2] Pushes the string into the internal reading buffer. Since we are
//     pushing String, the encoding is specified
// [3] The bool method returns true at a 5% likelihood. In this case, null
//     is pushed into internal buffer which triggers the 'end' event


// Usage of RandomStream
const randomStream = new RandomStream();

randomStream
  .on('readable', () => {
  let chunk;
  while((chunk = randomStream.read()) !== null) {
    console.log(`Chunk received: ${chunk.toString()}`);
  }
  })
  .on('end', () => console.log('End of stream'));
```

Side notes:
* `read()` method is called by stream consumers, while `_read()` is a method in a stream subclass that will be called by the internals of the Readable class. Think of `_read()` as feeding data into the readable stream like how `fs.createReadStream()` feeds file data into a Readable Stream.
* The options object passed into the Readable Stream constructor could include:
  * `encoding` argument that is used to convert Buffer to String (defaults to null)
  * `objectMode` to toggle between **binary mode** and **object mode**
  * The upper limit of data stored in internal buffer, `highWaterMark`. Defaults to 16KB
* It’s possible that the highWaterMark limit is reached during push() invocation. In this scenario:
  * `push()` will return false
  * `push()` will continue to attempt pushing data into internal buffer. Considerations to stop pushing data needs to be implemented in code

### Writable Streams
Writing into streams requires the `write()` method with the following signature:

```js
writable.write(chunk, [encoding], [callback])
```

The `encoding` argument is optional and can be specified if chunk is String (it defauls to ‘utf8’ and ignored if chunk is Buffer). The callback is optional and is called when the chunk is flushed into the writable stream.

To signal end of stream:

```js
writable.end([chunk], [encoding], [callback])
```

The callback in this case is fired when *all data* is written to the stream. This is equivalent to registering a listener to the `finish` event (as in example below).

```js
const Chance = require('chance');
const http = require('http');
const chance = new Chance();

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  while(chance.bool({ likelihood: 95 })) {
  res.write(chance.string() + '\n');
  }
  res.end('\n The end... \n')
  res.on('finish', () => {
  console.log('All data was sent')
  })
})
  .listen(3000, () => {
  console.log('Listening on port 3000');
  })
```

Side note:
* There is a distinction in the naming of events that signals the end of stream:
  * `end` to mark the end of a Readable stream
  * `finish` to mark the end of a Writable stream
* The distinction is made to distinguish between the two in cases of duplex streams.

#### Backpressure
* Streams can suffer from bottlenecks when data is written to *streams* at a faster rate than it is consumed (e.g. saving data to filesystem).
* The mechanism to deal with this problem is to buffer incoming data, but without controlling the writer, data stored in internal buffer will accumulate, leading to undesirable memory usage
* `writable.write()` returns `false` when the internal buffer exceeds `highWaterMark` limit, indicating that the writing operation should be put on pause. When the buffer is *emptied*, the drain event is emitted, communicating that it’s safe to resume writing. This mechanism is called **back-pressure**.

```js
const Chance = require('chance');
const http = require('http');
const chance = new Chance();

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  const generateMore = () => {
    while(chance.bool({ likelihood: 95 })) {
      let shouldContinue = res.write(
        chance.string({ length: (16 * 1024) - 1 })
      );

      if(!shouldContinue) {                          // [1]
        console.log('backpressure');
        return res.once('drain', generateMore);
      }
    }

    res.end('\n The end... \n', () => {              // [2]
      console.log('All data was sent')
    })
  }

  generateMore();
})
  .listen(3000, () => {
  console.log('Listening on port 3000');
  })


// [1] Triggers when internal buffer is full. Return statement stops out
//     of function and registers a one-time 'drain' listener, which
//     waits for buffer to be flushed before invoking generateMore()
//
// [2] Signal end of write stream when while condition fails
```

#### Implementing Writable Streams
```js
const stream = require('stream');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class ToFileStream extends stream.Writable {
  constructor() {
    super({ objectMode: true });                            // [1]
  }

  _write(chunk, encoding, callback) {                       // [2]
    mkdirp(path.dirname(chunk.path), (err) => {
      if(err) {
        callback(err);
      }
      fs.writeFile(chunk.path, chunk.content, callback);
    })
  }
}

const tfs = new ToFileStream();

tfs.write({
  path: './fileCreatorFiles/file1.txt',
  content: 'Hello'
});

tfs.write({
  path: './fileCreatorFiles/file2.txt',
  content: 'Nodejs'
});

tfs.write({
  path: './fileCreatorFiles/file3.txt',
  content: 'Streams!'
});

tfs.end(() => {
  console.log('All files created');
})

// [1] `objectMode` true to allow writable stream to accept object data type.
//     Other acceptable arguments:
//       - `highWaterMark`: controls internal buffer limit
//       - `decodeStrings`: enables automatic decoding of strings into binary
//          buffers before passing to _write() method. Defaults to true
//
// [2] the _write() implementation accepts a callback which is invoked when
//     the operation completes. It is not necessary to pass the result to
//     callback; but we can pass an error which will cause the stream to
//     emit an `error` event.
```

### Duplex Streams
* Is both Readable and Writable
* Duplex streams are readable/writable and both ends of the stream engage in a two-way interaction, sending back and forth messages like a telephone
* When creating custom Duplex streams, implementations for both `_read()` and `_write()` required. The `options` object passed to custom Duplex streams constructor are the same as Readable/Writable streams, with the addition of `allowHalfOpen` parameter: setting it to `false` will cause *both* Readable and Writable streams to end when one of them does (defaults to `true`)

### Transform Streams
* Has both Readable and Writable interfaces
* Unlike Duplex streams, it has only a Writable stream on one end, and a Readable stream on the other.
* Allows us to write into the stream. Within the stream, some processing can be done before being output as a Readable stream.

Its custom implementation requires 2 methods:
* `_transform()`: Its signature is similar to that of `_write()`, but instead of pushing data to an underlying resource, it pushes processed chunks into an internal buffer (to be consumed as a Readable stream).
* `_flush()`: Invoked internally just before the stream is ended. Allows us to finalize the stream or push any remaining data before completely ending the stream.

```js
const stream = require('stream');

class ReplaceStream extends stream.Transform {
  constructor(searchString, replaceString) {
    super();
    this.searchString = searchString;
    this.replaceString = replaceString;
    this.tailPiece = '';
  }

  _transform(chunk, encoding, callback) {
    const pieces = (this.tailPiece + chunk).split(this.searchString);    // [1]
    const lastPiece = pieces[pieces.length - 1];
    const tailPieceLen = this.searchString - 1;                          // [2]

    this.tailPiece = lastPiece.slice(-tailPieceLen);
    pieces[pieces.length - 1] = lastPiece.slice(0, -tailPieceLen);       // [3]
    this.push(pieces.join(this.replaceString));                          // [4]
    callback();
  }

  _flush(callback) {
    this.push(this.tailPiece);                                           // [5]
    callback();
  }
}

const rs = new ReplaceStream('dog', 'wizard');
rs.on('data', (chunk) => {
  console.log(chunk.toString());
})

rs.write('a quick brown fox jumps over the lazy dog.')
rs.write('a quick brown f')
rs.write('ox jumps over the lazy d')
rs.write('og. a quick brown fox jumps over the lazy do')
rs.write('g. a quick br');

rs.end()

// This script replaces a searchString in a text stream with a replaceString.
// The tricky part: searchString may be truncated on one chunk, and continues on
// in the next chunk. The approach is to store the last bit of a chunk in a
// variable and prepending it to the next chunk.

// [1] Prepend previous tailPiece and splits string into array with searchString
//     as delimiter
// [2] The length of tailPiece only needs to be (searchString.length -1). If
//     searchString happens to at the end, it would have been picked up earlier
//     anyway
// [3] Remove tailPiece part before pushing into internal buffer
// [4] Push chunk into internal buffer (similar to Readable stream set up)
// [5] _flush is called at the end of stream to push any last chunk of data into
//     internal buffer (to be consumed as Readable stream) before end of stream.
//     In this case, the very last tailPiece is pushed, which would otherwise be
//     missed.
```

### Piping Streams
* With pipe(), the Writable stream is ended automatically when the Readable stream emits and end event, UNLESS we specify {end: false} in `options`:

```js
readable.pipe(writable, [options])

```

* Piping two streams together creates a *suction* that allows data to flow automatically from Readable stream to Writable stream, so there is no need to call `read()` and `write()`
* Back-pressure is automatically taken care of
* `error` events are not propagated through the pipeline. In the following example, only errors from `stream2` will be caught. If the destination stream (`stream2`) emits an error, it gets automatically unpiped from the source stream.

```js
stream1
  .pipe(stream2)
  .on('error' () => {})
```

### Composing Custom Streams
Creating customs streams through prototypal inheritance (as we saw above) is not exactly the Node way as it violates the small surface area principle and requires some boilerplate code.

Some libraries are available to help us:
* `through2` npm allows us to create Transform streams with simply `through2([options], [_transform], [_flush])`
* `from2` npm allows us to create Readable streams with `from2([options], _read)`

<PostDate />
<PageTags />
