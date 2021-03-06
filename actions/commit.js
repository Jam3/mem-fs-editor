'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var through = require('through2');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

function write(file) {
  mkdirp.sync(path.dirname(file.path));
  fs.writeFileSync(file.path, file.contents, {
    mode: file.stat ? file.stat.mode : null
  });
}

function remove(file) {
  rimraf.sync(file.path);
}

module.exports = function (filters, cb) {
  var store = this.store;

  if (arguments.length === 1) {
    cb = filters;
    filters = [];
  }

  var modifiedFilter = through.obj(function (file, enc, cb) {
    if (['modified', 'deleted'].indexOf(file.state) >= 0) {
      this.push(file);
    }
    cb();
  });

  var commitFilter = through.obj(function (file, enc, cb) {
    store.add(file);
    if (file.state === 'modified') {
      write(file);
    } else if (file.state === 'deleted') {
      remove(file);
    }
    delete file.state;
    cb();
  });

  filters.unshift(modifiedFilter);
  filters.push(commitFilter);

  var stream = filters.reduce(function (stream, filter) {
    return stream.pipe(filter);
  }, this.store.stream());

  stream.on('finish', cb);
};
