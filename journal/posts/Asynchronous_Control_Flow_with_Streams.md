---
title: Asynchronous Control Flow with Streams
description: Managing asynchronous tasks with Nodejs streams
tags: ['javascript', 'nodejs', 'design pattern', 'stream']
timestamp: 1561703895814
---

## Asynchronous Control Flow with Streams

Besides handling I/O, streams could be used as an approach to elegant programming patterns.

### Sequential Execution

By default, streams handle data in sequence. For example, a `_transfrom()` function of a Transform stream will never be invoked again until the previous invocation completes by executing `callback()`. 

In the example below `through2` is used to simplify the creation of Transform streams and `from2-array` is used to create a Readable stream from an array of objects.

```js
const fromArray = require('from2-array');
const through = require('through2');
const fs = require('fs');

const concatFiles = (destination, files, callback) => {
  const destStream = fs.createWriteStream(destination);
  fromArray.obj(files)                                    // [1]
    .pipe(through.obj((file, encoding, done) => {         // [2]
      const src = fs.createReadStream(file);              // [3]
      src.pipe(destStream, { end: false });               // [4]
      src.on('end', done);                                // [5]
    }))
    .on('finish', () => {                                 // [6]
      destStream.end();
      callback();
    })
}

concatFiles(process.argv[2], process.argv.slice(3), () => {
  console.log('Files concatenated successfully');
})

// This script combines the content of multiple files and
// combines them into a destination file.
//
// It is important to note that the script has a main
// stream which later creates sub-stream(s):
// - The main stream is formed by [1] and [2]:
//   fromArray.obj(files).pipe(through.obj(...))
// - Sub-stream(s) is created within the Transform stream
//   shown in [4].
//
// [1] `fromArray` creates a Readable stream from an array
//     of items
//
// [2] `through` creates a Transform stream with a
//     _transform function passed in as arg. The _transfrom
//     function is invoked in sequence, processing one
//     chunk/file at a time, i.e. the _transform function
//     is invoked with the next chunk after the previous
//     invocation is complete (when `done()` is called).
//
// [3] Within the Transform stream, a Readable stream is
//     created for each file.
//
// [4] The Readable stream for each file is piped to the
//     destination file. The {end: false} option is passed
//     to ensure that the Writable stream stays open after
//     the Readable stream (of the iterated file) ends.
//
// [5] When the Readable stream of iterated file reaches
//     an end, `done()` is called, and the _transform() 
//     function is invoked again with the next file in 
//     iteration.
//
// [6] The `finish` listener is attached to the Transform
//     stream, which operates on the level of the main 
//     stream. At the end of the file iteration, the
//     Readable stream (`fromArray`) reaches an end, thus 
//     triggering the 'finish' event of the Writable stream
//     (`through`) - which is the default behaviour of
//     `pipe()`.
```

### Unordered Parallel Execution

We can take advantage of Node.js concurrency with this approach, with the caveat that the order of data chunks would be disrupted. This pattern can only be applied if there is no relationship between each chunk of data.

Implementation example that defines a generic Transform stream which executes transform function in parallel:

```js
const stream = require('stream');

class ParallelStream extends stream.Transform {
  constructor(userTransform) {                                   // [1]
    super({ objectMode: true });
    this.userTransform = userTransform;
    this.running = 0;
    this.terminateCallback = null;
  }

  _transform(chunk, enc, done) {
    this.running++
    this.userTransform(                                          // [2]
      chunk,
      enc,
      this.push.bind(this),
      this._onComplete.bind(this)
    );
    done();
  }

  _flush(done) {                                                 // [3]
    if (this.running > 0) {
      this.terminateCallback = done;
    } else {
      done();
    }
  }

  _onComplete(err) {                                             // [4]
    this.running--;
    if (err) {
      return this.emit('error', err);
    }
    if (this.running === 0) {
      this.terminateCallback && this.terminateCallback();
    }
  }

}

module.exports = ParallelStream;

// [1] ParallelStream is initialized with a userTransform function that will be
//     applied to each incoming chunk of data.
//
// [2] The `userTransform()`` function is invoked. `done()` is called
//     immediately without waiting for `userTransform()` to complete. This is
//     where the 'trick' for parallel execution lies: we notify that the 
//     current `_transform()` function is complete, thereby accepting the next
//     chunk of data without waiting for `userTransform()`.
//
//     The function signature of `userTransform()`:
//     - `chunk`, `enc`` are arguments passed down from `_transform()`
//     - `this.push.bind(this)` allows `userTransform()` to push completed data
//       chunks to the buffer of the Readable stream (output)
//     - `this._onComplete.bind(this)` allows `userTransform()` to invoke the 
//       special callback we created. This special callback is called every
//       time `userTransform()` completes.
//
// [3] The `_flush()` method is invoked just before the stream terminates.
//     The `done` callback (passed in internally by stream.Transform) essentially
//     terminates the stream by emitting a `finish` event. 
//
//     By suspending the `done()` callback when running tasks are still present,
//     the stream is kept open. Instead, we let the special `_onComplete()`
//     callback to invoke `done()`, which may very well occur after `_flush()`
//     is called.
//
// [4] This is a special callback we created and is invoked at the end of each
//     `userTransform()` async task. It is here that we check if all running 
//     tasks are completed before finally terminating the stream.
```

We can see an example use case of `ParallelStream` by creating a URL status monitoring application, which:

* Reads from a text file containing a list of URLs (seperated by newline) 
* Sends a request to each URL
* Outputs a file containing the list of URLs and its status ('up' or 'down')

```js
const fs = require('fs');
const request = require('request');
const split = require('split');
const ParallelStream = require('./ParallelStream');

fs.createReadStream(process.argv[2])
  .pipe(split())                                                // [1]
  .pipe(new ParallelStream((url, enc, push, done) => {
    if (!url) {
      return done()
    }

    request.head((url, (err, response) => {
      push(url + ' is ' + (err? 'down' : 'up') + '\n');
      done();
    }))
  }))
  .pipe(fs.createWriteStream('results.txt'))
  .on('finish', () => console.log('All urls were checked.'))

// [1] `split` is a Tranform stream that ensures outputting each
//     line on a separate chunk.
```

In `results.txt` we might see that the list of URLs are not in the same order as its input file.

### Unordered Limited Parallel Execution

With some tweaks to the `ParallelStream` module, we could limit the number of parallel tasks.

```js
const stream = require('stream');

class LimitedParallelStream extends stream.Transform {
  constructor(concurrencyLimit, userTransform) {
    super({ objectMode: true });
    this.concurrencyLimit = concurrencyLimit;
    this.userTransform = userTransform;
    this.running = 0;
    this.terminateCallback = null;
    this.continueCallback = null;
  }

  _transform(chunk, enc, done) {
    this.running++
    this.userTransform(
      chunk,
      enc,
      this.push.bind(this),
      this._onComplete.bind(this)
    );
    if (this.running < this.concurrencyLimit) {             // [1]
      done()
    } else {
      this.continueCallback = done;
    }
  }

  _flush(done) {
    if (this.running > 0) {
      this.terminateCallback = done;
    } else {
      done();
    }
  }

  _onComplete(err) {
    this.running--;
    if (err) {
      return this.emit('error', err);
    }
    const tmpContinueCallback = this.continueCallback;      // [2]
    this.continueCallback = null;
    tmpContinueCallback && tmpContinueCallback();
    if (this.running === 0) {
      this.terminateCallback && this.terminateCallback();
    }
  }

}

module.exports = LimitedParallelStream;

// [1] The `_transform()` callback is suspended if number of running tasks
//     equals/exceeds concurrencyLimit. This prevents the Transform stream
//     from processing the next incoming chunk of data.
//
//     The `_transform()` callback is instead saved to an instance variable
//     to be called within `_onComplete()`
//
// [2] At the end of each async task, `continueCallback` is invoked (if 
//     available) to allow new chunks of data to flow into the stream once
//     again.
```

### Ordered Parallel Execution

One approach to have ordered parallel execution is to sort processed/transformed data so that it follows the same order in which they are received.

This technique involves the use of buffer to reorder chunks while they are emitted by each running task. An npm can be used for this purpose - `through2-parallel`
