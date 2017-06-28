const path = require('path');
const FeatherPlugin = require('../index.js');

const HELPER_DIR = path.join(__dirname, 'helpers');
const BUILD_DIR = path.join(__dirname, 'build');

function MockCompiler(options) {
  this.options = {
    context: HELPER_DIR,
    output: {
      path: BUILD_DIR
    }
  };
}

MockCompiler.prototype.plugin = function(type, fn) {
  this.fn = fn;
}

let instance;

describe('create instance', function() {
  it('throws an error if no options are passed', function(done) {
    try {
      new FeatherPlugin();
      done('No exception was thrown');
    } catch (error) {
      done();
    }
  });

  it('creates the instance', function(done) {
    instance = new FeatherPlugin({
      template: 'template.ejs',
      output: 'output.ejs',
      line: 1,
      whitelist: ['home']
    });

    done();
  });
});

describe('apply function', function() {
  it('generates file', function(done) {
    const compiler = new MockCompiler();

    instance.apply(compiler);
    done();
  });
});