import path from 'path';
import fs from 'fs';

import FeatherPlugin from '../';

const HELPER_DIR = path.join(__dirname, 'helpers');

class MockCompiler {
  constructor() {
    this.options = {
      context: HELPER_DIR
    };
  }

  plugin(type, fn) {
    this.fn = fn;
  }
}

const compiler = new MockCompiler();
let instance;

describe('plugin initialization', () => {
  it('throws an error if no options are passed', done => {
    try {
      new FeatherPlugin();
      done('No exception was thrown');
    } catch (error) {
      done();
    }
  });

  it('creates the instance', () => {
    instance = new FeatherPlugin({
      template: 'template.ejs',
      output: 'output.ejs',
      line: 1,
      whitelist: ['home']
    });
  });

  it('apply function works', () => {
    instance.apply(compiler);
  });
});

describe('template generation', () => {
  const outputPath = path.resolve(HELPER_DIR, 'output.ejs');

  it('generates file', done => {
    compiler.fn(null, err => {
      if (err) {
        return done(err);
      }

      fs.exists(outputPath, exists => {
        if (exists) {
          done();
        } else {
          done(new Error(`Output file ${outputPath} doesn't exist`));
        }
      });
    });
  });

  it('creates valid content', done => {
    fs.readFile(outputPath, 'utf8', (err, output) => {
      if (err) {
        return done(err);
      }

      checkOutput(output, done);
    });
  })
})

function checkOutput(output, done) {
  fs.readFile(path.resolve(HELPER_DIR, 'expected.ejs'), 'utf8', (err, expected) => {
    if (err) {
      return done(err);
    }

    if (output === expected) {
      done();
    } else {
      done(new Error('Contents don\'t match'));
    }
  })
}