const path = require('path');
const FeatherPlugin = require('../index.js');

const HELPER_DIR = path.join(__dirname, 'helpers');
const BUILD_DIR = path.join(__dirname, 'build');

function MockCompiler(options) {
  this.options = {
    context: HELPER_DIR,
    output: {
      path: options.outputPath || BUILD_DIR
    }
  };
}

MockCompiler.prototype.plugin = function(type, fn) {
  this.fn = fn;
}

let instance;

describe('create instance', function() {
  instance = new FeatherPlugin({
    template: 'template.ejs',
    output: 'output.ejs',
    line: 1,
    whitelist: ['home']
  });
});

describe('apply function', function() {
  const compiler = new MockCompiler();

  instance.apply(compiler);
});