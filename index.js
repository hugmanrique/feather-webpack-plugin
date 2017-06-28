'use strict';

const path = require('path');
const fs = require('fs');

const svgstore = require('svgstore');
const iconDir = path.join(__dirname, '../feather-icons/icons');

function FeatherPlugin(options) {
  if (!options) {
    throw new Error('Some options are required');
  }

  this.generator = svgstore({
    inline: true,
    copyAttrs: options.copyAttrs || [
      'fill',
      'stroke-width',
      'stroke-linecap',
      'stroke-linejoin'
    ],
    cleanObjects: options.cleanObjects,
    svgAttrs: options.svgAttrs,
    symbolAttrs: options.symbolAttrs
  });

  this.whitelist = options.whitelist;
  this.templateName = options.template;
  this.lineNumber = options.line;
  this.output = options.output;
}

FeatherPlugin.prototype.apply = function(compiler) {
  const whitelist = this.whitelist;
  const generator = this.generator;

  const context = compiler.options.context;

  const templatePath = path.resolve(context, this.templateName);
  const output = this.output;
  const line = this.lineNumber;

  compiler.plugin('emit', function(compilation, callback) {
    try {
      const icons = getIcons(whitelist);

      icons.forEach(function(icon) {
        generator.add(icon[0], icon[1]);
      });

      const template = getTemplate(templatePath, line, generator);

      compilation.assets[output] = {
        source: function() {
          return template;
        },
        size: function() {
          return template.length;
        }
      };

      callback();
    } catch (err) {
      callback(err);
    }
  });
}

function getTemplate(template, line, generator) {
  const contents = fs.readFileSync(template).toString().split('\n');

  contents.splice(line, 0, generator);

  return contents.join('\n');
}

function getIcons(whitelist, callback) {
  const icons = [];

  fs.readdirSync(iconDir).forEach(function(category) {
    const dir = path.join(iconDir, category);

    const files = fs.readdirSync(dir);
    const names = filterNames(whitelist, files);

    names.forEach(function(name) {
      const svg = fs.readFileSync(path.join(dir, name), 'utf8');

      icons.push([
        name,
        transform(svg)
      ]);
    });
  });

  return icons;
}

function filterNames(whitelist, files) {
  return files.filter(function(file) {
    const name = file.replace('.svg', '');

    return whitelist.indexOf(name) !== -1;
  });
}

function transform(svg) {
  return svg.replace(/ stroke="#000"/g, '');
}

FeatherPlugin['default'] = FeatherPlugin;
module.exports = FeatherPlugin;