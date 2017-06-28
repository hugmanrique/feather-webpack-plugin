# Feather Webpack Plugin
Combine Feather icons into one using `<symbol>` elements which you may [`<use>` in your markup](https://css-tricks.com/svg-sprites-use-better-icon-fonts/).

Uses [svgstore](https://www.npmjs.com/package/svgstore) on the back to create the `<symbol>` element.

## Install

```
$ npm install --save feather-webpack-plugin
```

webpack.config.js

```javascript
const FeatherPlugin = require('feather-webpack-plugin');

module.exports = {
  plugins: {
    new FeatherPlugin({
      whitelist: [
        'home'
      ]
    })
  }
};
```

## Note

The template will only be generated on the first run. Additional webpack compilations (with the `--watch` flag) won't trigger the template creation script. This plugin is intended for production creation, and as the webpack config cannot be modified during runtime, there's no way for the plugin to get an options config change.

## Options

All the options supported by svgstore are passed to the new instance. Take a look at their [docs](https://www.npmjs.com/package/svgstore#options).



/// REMOVE, make table
/*Additionally, a `whitelist` and `blacklist` of icon names are supported. Please, only pass one of them, the other will be ignored.*/


