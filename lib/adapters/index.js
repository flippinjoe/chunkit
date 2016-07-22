
var AbstractAdapter = require('../adapter');

var globalAdapters = {};

module.exports.adapter = function (adapter, definition) {
  console.log("Registering adapter: ", adapter, typeof(definition));

  globalAdapters[adapter] = definition;
}

module.exports.get = function (id, opts) {
  var Adapter = globalAdapters[id];
  if (!Adapter) { throw new Error('No registered adapter for id = ' + id); }
  
  return new Adapter(opts);
}



///// Register our default adapters here
globalAdapters['azure'] = require('./azure');
