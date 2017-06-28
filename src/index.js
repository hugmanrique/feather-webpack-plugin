import path from 'path';
import fs from 'fs';

import svgstore from 'svgstore';

const iconDir = getIconDir();

export default class FeatherPlugin {
  constructor(options) {
    if (!options instanceof Array) {
      throw new Error('An options array is required');
    }

    const { copyAttrs, cleanObjects, svgAttrs, symbolAttrs, whitelist, template, line, output } = options;

    this.generator = svgstore({
      inline: true,
      copyAttrs: copyAttrs || [
        'fill',
        'stroke-width',
        'stroke-linecap',
        'stroke-linejoin'
      ],
      cleanObjects,
      svgAttrs,
      symbolAttrs
    });

    this.whitelist = whitelist;
    this.templateName = template;
    this.lineNumber = line || 0;
    this.output = output;
    this.first = true;
  }

  apply(compiler) {
    const { context } = compiler.options;
    const { generator, whitelist, lineNumber } = this;

    const templatePath = path.resolve(context, this.templateName);
    const outputPath = path.resolve(context, this.output);

    compiler.plugin('emit', (compilation, callback) => {
      if (!this.first) {
        return;
      }

      const icons = getIcons(whitelist);

      icons.forEach(icon => {
        generator.add(icon[0], icon[1]);
      });

      writeOutput(templatePath, lineNumber, generator, outputPath);
      this.first = false;

      callback();
    })
  }
}

function writeOutput(template, line, generator, output) {
  const contents = fs.readFileSync(template, 'utf8').split('\n');

  contents.splice(line, 0, generator);

  fs.writeFileSync(output, contents.join('\n'));
}

function getIcons(whitelist) {
  const icons = [];

  fs.readdirSync(iconDir).forEach(category => {
    const dir = path.join(iconDir, category);

    const files = fs.readdirSync(dir);
    const names = filterNames(whitelist, files);

    names.forEach(name => {
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
  return files.filter(file => {
    const name = file.replace('.svg', '');

    return whitelist.indexOf(name) !== -1;
  });
}

function getIconDir() {
  const test = fs.existsSync(path.join(__dirname, '../node_modules'));

  return path.join(__dirname, `../${test ? 'node_modules' : '..'}/feather-icons/icons`);
}

const transform = (svg) => svg.replace(/ stroke="#000"/g, '');
