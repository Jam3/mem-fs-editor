'use strict';

function EditionInterface(store) {
  this.store = store;
}

EditionInterface.prototype.read = require('./actions/read.js');
EditionInterface.prototype.readJSON = require('./actions/read-json.js');
EditionInterface.prototype.exists = require( './actions/exists' );
EditionInterface.prototype.write = require('./actions/write.js');
EditionInterface.prototype.delete = require('./actions/delete.js');
EditionInterface.prototype.copy = require('./actions/copy.js').copy;
EditionInterface.prototype._copySingle = require('./actions/copy.js')._copySingle;
EditionInterface.prototype.copyTpl = require('./actions/copy-tpl.js');
EditionInterface.prototype.commit = require('./actions/commit.js');

exports.create = function (store) {
  return new EditionInterface(store);
};
