#!/usr/bin/env node

const Builder = require('../lib/builder');

var args = require('minimist')(process.argv.slice(2), {
  alias: {
    'n': 'name',
    'a': 'author',
    's': 'source-dir',
    'o': 'output-dir'
  },

  string: ['name', 'author', 'source-dir', 'output-dir']
});

var sourceDir = args['source-dir'];
var outputDir = args['output-dir'];
var name = args['name'];
var author = args['author'];

if (!sourceDir) {
  console.error('Missing source directory!');
  process.exit(1);
}

if (!outputDir) {
  console.error('Missing output directory!');
  process.exit(1);
}

var builder = new Builder(sourceDir, outputDir, name, author);

builder.copyFiles();
builder.buildMeta();