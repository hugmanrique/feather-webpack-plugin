const path = require('path');
const fs = require('fs');
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

const compiler = new MockCompiler();
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

  it('apply function works', function() {
    instance.apply(compiler);
  });
});

describe('plugin call', function() {
  const outputPath = path.resolve(HELPER_DIR, 'output.ejs');

  it('generates file', function(done) {
    compiler.fn(null, function(err) {
      if (err) {
        return done(err);
      }

      fs.exists(outputPath, function(exists) {
        if (exists) {
          done();
        } else {
          done(new Error('Output file doesn\'t exist'));
        }
      });
    });
  });

  it('creates valid content', function(done) {
    fs.readFile(outputPath, function(err, data) {
      if (err) {
        return done(err);
      }

      const output = data.toString('utf8');

      getExpectedOutput(function(expected) {
        if (output === expected) {
          done();
        } else {
          done(new Error('Contents don\'t match'));
        }
      });
    });
  });
});

function getExpectedOutput(callback) {
  fs.readFile(path.resolve(HELPER_DIR, 'expected.ejs'), function(err, buffer) {
    if (err) {
      throw err;
    }

    callback(buffer.toString('utf8'));
  });
}