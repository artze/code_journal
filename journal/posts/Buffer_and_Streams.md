---
title: Buffer and Streams
description: A comparison between buffer and streams
tags: ['programming', 'nodejs', 'stream']
timestamp: 1557630706000
---

## Buffer and Streams

The differences between buffers and streams in the context of an asynchronous API in Nodejs.

With buffers, input data is first collected in a buffer. The buffer is sent to the consumer only after **all** input data is collected.

With streams, input data is sent to consumer in chunks once they become available. In order for this to work, the order of chunks needs to be preserved on the consumer side (but this is taken care of out of the box with Nodejs streams)

### Efficiencies

We could look at efficiencies of each in terms of spatial efficiency and time efficiency.

#### Spatial Efficiency

* Buffering becomes an issue if input data is large. Buffer size needs to be large enough to contain all input data, and its size is constrained by available memory.
* V8 engine can only accept buffers that are no larger than \~1gb in size.

#### Time Efficiency

* Buffering requires each stage to complete in its entirety before moving on to the next
* Streaming allows concurrency.
* E.g. In a program that reads, compresses and writes data, streaming allows the current chunk to be read while the previous chunk is being compressed. In the buffering approach, the compression stage could only begin when all input data is read.

### Examples

Example of a program that reads a file, compresses it and writes compressed file.

Gzip with Buffer API:

```js
const fs = require('fs')
const zlib = require('zlib')
const file = process.argv[2]

fs.readFile(file, (err, buffer) => {
  zlib.gzip(buffer, (err, buffer) => {
    fs.writeFile(file + '.gz', buffer, err => {
      console.log('File successfully compressed')
    })
  })
})
```

Gzip with streaming API: 

```js
const fs = require('fs')
const zlib = require('zlib')
const file = process.argv[2]
fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(file + '.gz'))
  .on('finish', () => console.log('File successfully compressed'))
```

### Notes on Streaming

In considering performance, you want to make sure that you’re not producing too many chunks . The more “chunking” you do, the more overhead that exists in both producing the chunks and parsing the chunks. Furthermore, it also results in more executions of buffering functions if the receiver can’t make immediate use of the chunks. Chunking isn’t always the right answer, it adds extra complexity on the recipient. So if you’re sending small units of things that won’t gain much from streaming, don’t bother with it!

<PostDate />
<PageTags />
