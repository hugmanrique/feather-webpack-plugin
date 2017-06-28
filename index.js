const path = require('path');
const fs = require('fs');

const svgstore = require('svgstore');

const iconDir = path.join(__dirname, 'node_modules/feather-icons/icons');

function FeatherPlugin(options) {
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
  const outputPath = path.resolve(context, this.output);
  const line = this.lineNumber;

  compiler.plugin('before-run', function(compilation, callback) {
    try {
      const icons = getIcons(whitelist);

      icons.forEach(function(icon) {
        generator.add(icon);
      });

      saveTemplate(templatePath, line, generator, outputPath);
    } catch (err) {
      callback(err);
    }
  });
}

function saveTemplate(template, line, generator, outputPath) {
  const contents = fs.readFileSync(template).toString().split('\n');

  contents.splice(line, 0, generator);

  fs.writeFileSync(outputPath, contents.join('\n'));
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