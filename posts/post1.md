---
title: First Post
description: This is first post
tags: ['nodejs', 'streams']
---
# First Post
## asdfasf

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

<PageTags />