---
title: Stream Piping Patterns
description: Nodejs stream piping patterns - combine, fork, merge, multiplexing and demultiplexing streams
tags: ['nodejs', 'stream', 'design pattern']
timestamp: 1561961329617
---

## Stream Piping Patterns

### Combining Streams

- Combines multiple streams so that it looks like one from the outside
- Allows us to modularize and reuse an entire pipeline
- When we write into the combined stream, we are writing to the first stream of the pipeline
- When we read from the combined stream, we are reading from the last stream of the pipeline

Note that any error event that occurs is not automatically propagated down the pipeline. Proper error management would then require us to explicitly attach an error listener to _each_ stream. This approach isn't ideal if we want the combined stream to act as a 'black box'. It is thus crucial for the combined stream to also act as an _aggregator_ for all errors coming from any stream in the pipeline.

#### Implementing Combined Streams

We can illustrate this implementation by creating a combined stream that compresses and encrypts data, with the help of `multipipe` npm.

```js
const zlib = require('zlib');
const crypto = require('crypto');
const combine = require('multipipe');

const compressAndEncrypt = (password) => {
  return combine(zlib.createGzip(), crypto.createCipher('aes192', password));
};

module.exports = compressAndEncrypt;
```

We can use the combined stream as if it were a 'black box':

```js
const fs = require('fs');
const compressAndEncrypt = require('./compressAndEncrypt');

fs.createReadStream(process.argv[3])
  .pipe(compressAndEncrypt(process.argv[2]))
  .pipe(fs.createWriteStream(process.argv[3] + '.gz.enc'));
```

The preceeding code has its intended functionality but does not have error management. We can solve this elegantly by taking advantage of combined stream's role as an _aggregator_ of error events:

```js
const fs = require('fs');
const combine = require('multipipe');
const compressAndEncrypt = require('./compressAndEncrypt');

combine(
  fs
    .createReadStream(process.argv[3])
    .pipe(compressAndEncrypt(process.argv[2]))
    .pipe(fs.createWriteStream(process.argv[3] + '.gz.enc')),
).on('error', (err) => {
  // this error may come from any stream in the pipeline
  console.log(err);
});
```

### Forking Streams

Forking a stream involves piping a single Readable stream into multiple Writalbe streams. Can be useful when we want to:

- to send the same data to different destinations (files/sockets etc.)
- to perform different data transformations on the same data
- to split data (to different streams) based on some criteria

#### Implementing Forked Streams

In this illustration we will create a utility that outputs both `sha1` and `md5` hashes of a given file.

```js
const fs = require('fs');
const crypto = require('crypto');

const sha1Stream = crypto.createHash('sha1');
sha1Stream.setEncoding('base64');

const md5Stream = crypto.createHash('md5');
md5Stream.setEncoding('base64');

const inputFile = process.argv[2];
const inputStream = fs.createReadStream(inputFile);

inputStream.pipe(sha1Stream).pipe(fs.createWriteStream(inputFile + '.sha1'));

inputStream.pipe(md5Stream).pipe(fs.createWriteStream(inputFile + '.md5'));
```

Notes:

- Forked stream is implemented simply by piping from the same input stream to different destination streams
- Both `sha1Stream` and `md5Stream` will be ended automatically when `inputStream` ends, unless we specify `{ end: false }` as an option when invoking `pipe()`
- The two forks will receive the same data chunks
- Back-pressure will work out of the box; the flow coming form `inputStream` will go as fast as the _slowest_ branch of the fork

### Merging Streams

Consists of piping a set of Readable streams into a single Writable stream. We need to pay attention to how the `end` event is handled - piping using the automatic `end` option would cause the destination stream to be ended as soon as one of the sources ends. This can lead to error situations as other active source streams will still continue to write to an already terminated stream. We would need to handle `end` events manually and be sure to specify `{ end: false }` when invoking `pipe()`:

A contrived example:

```js
const sourceStreamA = fs.createReadStream('sourceFileA');
const sourceStreamB = fs.createReadStream('sourceFileB');
const destinationStream = fs.createWriteStream('destFile');

let endCount = 0;

function onEnd() {
  if (++endCount === 2) {
    destinationStream.end();
  }
}

sourceStreamA.on('end', onEnd);
sourceStreamB.on('end', onEnd);

sourceStreamA.pipe(destinationStream, { end: false });
sourceStreamB.pipe(destinationStream, { end: false });
```

Notes:

- The data piped into the destination stream is randomly intermingled. This is a property that can be acceptable in some types of object streams, but often undesired when dealing with binary streams.
- To overcome the issue above, one approach is to merge streams in order - by consuming source streams one after another. This can be done with `multistream` npm

We can use the following npm to simplify merging of streams:

- `merge-stream`
- `multistream-merge`

### Multiplexing and Demultiplexing

Multiplexing is similar to merging streams but instead of simply joining streams together, we use a shared channel to deliver the data of a set of streams. The source streams remain _logically separated_ inside the shared channel, which allows us to split the stream again once the data reaches the other end of the shared channel (demultiplexing).

Conceptually, the implementation generally involves having each chunk of data carry information about its source stream (e.g. source stream ID).
For binary data, this can be done by wrapping each data chunk into packets, with packet headers carrying information about its source stream. For object streams, this can be done by simply adding a property in the object that specifies its source stream.
