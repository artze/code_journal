---
title: Extract CSS from Webpack Bundle
description: Set up webpack to extract CSS from bundle.js to separate .css file during production build
tags: ['javascript', 'webpack']
timestamp: 1550461522000
---

## Extract CSS from Webpack Bundle

Set up webpack to extract CSS from bundle.js during production build:

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
  const isProduction = env === 'production';
  // ExtractTextPlugin takes argument of file name where extracted text will be moved to
  const CSSExtract = new ExtractTextPlugin('styles.css');

  return {
    module: {
      rules: [
        {
          loader: 'babel-loader',
          test: /\.js$/,
          exclude: /node_modules/
        },
        {
          // extract-text-plugin will extract all text from .scss files and move them into styles.css
          test: /\.s?css$/,
          use: CSSExtract.extract({
            use: ['css-loader', 'sass-loader']
          })
        }
      ]
    },
    // Add extract-text plugin instance here too
    plugins: [CSSExtract],
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      historyApiFallback: true
    }
  }
};
```

With above in place, webpack production build will now create a separate styles.css file. But, in webpack dev server mode, all css will also be dumped into a single styles.css file, making dev tools unusable — when inspecting css of elements, it will point towards the styles.css file, rather than the origin of the css code. That’s because css source maps are now failing.

To enable source maps for css :

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
  const isProduction = env === 'production';
  const CSSExtract = new ExtractTextPlugin('styles.css');

  return {
    module: {
      rules: [
          {
              loader: 'babel-loader',
              test: /\.js$/,
              exclude: /node_modules/
          },
          {
              test: /\.s?css$/,
              use: CSSExtract.extract({
                  // Enable sourceMaps in each loader
                  use: [
                      {
                          loader: 'css-loader',
                          options: {
                              sourceMap: true
                          }
                      },
                      {
                          loader: 'sass-loader',
                          options: {
                              sourceMap: true
                          }
                      }
                  ]
              })
          }
      ]
    },
    plugins: [CSSExtract],
    // use inline-source-map here to allow css source maps to work (slower than cheap-module-eval-source-map)
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      historyApiFallback: true
    }
  }
};
```

<PostDate />
<PageTags />
