---
title: Implement Search on 11ty Static Site
description: How to implement search and indexing on an 11ty static site
tags: ['11ty']
timestamp: 1655303369364
---

# Implement Search on 11ty Static Site

In this post, we will walk through the steps of implementing search on an 11ty static site with `lunr`. This involves the following:

- Create a search index
- Implement user input for searching pages

## Approach

We will create the search index during _build time_ and store the index in JSON format. This JSON will be served on an endpoint (e.g. `/search-index.json`). The browser client can then fetch this index, and allow user to perform a search. This approach of _pre-building indexes_ is preferred to save time generating an index on the client side.

## Create a Search Index

In this example, we want to index all pages with `tag: posts`. We will make use of 11ty's collection of `tag: posts` to generate a `lunr` search index.

### Template File to Store Index JSON

We need a template file to output `search-index.json` during build time. We will use a Nunjucks file for this:

```
# src/search-index.njk
---
permalink: /search-index.json
---
{{ collections.posts | buildSearchIndex | safe }}
```

The basic idea is to start with `collection.posts` which has all the page data relating to `tag: posts`. The collection data then passes through a filter function `buildSearchIndex` which generates a `lunr` search index in JSON format. Finally, this JSON data passes through the the Nunjucks `safe` filter to prevent escaping of JSON content.

### `buildSearchIndex` Filter

In this example, we will create an index based only on the `title` field, and use the page url as the id or ref of each document. We can add the filter with the following:

```js
eleventyConfig.addFilter('buildSearchIndex', function (arr) {
  const docs = arr.map(function (doc) {
    return {
      url: doc.url,
      ...doc.data,
    };
  });
  const idx = lunr(function () {
    this.field('title');
    this.ref('url');
    docs.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  return JSON.stringify(idx);
});
```

The frontmatter data is nested within the `data` field of each collection item while the `url` field is at the root, which is why we will need to massage the data beforehand.

At the end of all this, the search index is served as a serialized JSON format. On the client side, `lunr` will need to _load_ this index before performing a search. This can be done with `lunr.Index.load(JSON.parse(searchIndexJson))`. See related `lunr` docs here: <https://lunrjs.com/guides/index_prebuilding.html>

## Implement User Input for Searching Pages

Coming soon

<PostDate />
<PageTags />
