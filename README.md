# Feather Webpack Plugin
Combine Feather icons into one using `<symbol>` elements which you may [`<use>` in your markup](https://css-tricks.com/svg-sprites-use-better-icon-fonts/).

Uses [svgstore](https://www.npmjs.com/package/svgstore) on the back to create the `<symbol>` element.

## Install

```
$ npm install --save feather-webpack-plugin
```

## Usage

webpack.config.js

```javascript
const FeatherPlugin = require('feather-webpack-plugin');

module.exports = {
  plugins: {
    new FeatherPlugin({
      template: 'template.ejs',
      output: 'output.ejs',
      line: 1,
      whitelist: [
        'home'
      ]
    })
  }
};
```

template.ejs

```html
<a>Before</a>
<b>After</b>
```

## Note

The template will only be generated before Webpack runs (by using the `before-run` plugin callback). Additional webpack compilations (with the `--watch` flag) won't trigger the template creation script. This plugin is intended for templates ready for production, and as the Webpack config cannot be modified during runtime, there's no way for the plugin to check for config changes.

## Options

```javascript
new FeatherPlugin(options: object)
```

| Name | Type | Description |
|:---------------:|:-----------:|---------------------------------------------------------------------------------------|
| **`template`** | `{String}` | The path where your template to be modified is stored. Relative to Webpack's context. |
| **`output`** | `{String}` | The path where the generated template will be stored. Relative to Webpack's context. |
| **`line`** | `{Integer}` | Line number where the SVG element is going to be inserted in the template file. |
| **`whitelist`** | `{Array}` | Contains the names of Feather's icons you want to insert |

Additionally, all the options supported by svgstore are passed to the internal plugin instance. Take a look at their [docs](https://www.npmjs.com/package/svgstore#options).

[npm]: https://img.shields.io/npm/v/feather-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/feather-webpack-plugin

[node]: https://img.shields.io/node/v/feather-webpack-plugin.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/hugmanrique/feather-webpack-plugin.svg
[deps-url]: https://david-dm.org/hugmanrique/feather-webpack-plugin

[tests]: http://img.shields.io/travis/hugmanrique/feather-webpack-plugin.svg
[tests-url]: https://travis-ci.org/hugmanrique/feather-webpack-plugin

[cover]: https://coveralls.io/repos/github/hugmanrique/feather-webpack-plugin/badge.svg
[cover-url]: https://coveralls.io/github/hugmanrique/feather-webpack-plugin