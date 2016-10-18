
/**
 * Chunkit streamer is used to stream files to external
 * sources
*/

var EventEmitter = require('events').EventEmitter;
var StreamBuffer = require('./buffer-stream');
var util = require('util');
var fs = require('fs');

var logger = util.debuglog('chunkit');
var adapters = require('./adapters/index');

/**
 * @param {String} adapter - The adapter to use for streaming
 * @param {Object} opts - Optional configuration options for parsing
 * @constructor
*/
function ChunkitStreamer (adapter, opts) {
  var adp = adapters.get(adapter, opts);

  EventEmitter.call(this, opts);

  this.options = Object.assign({}, opts);
  this.adapter = adp;
}

ChunkitStreamer.prototype.options = {}

/**
 * Process a chunk of data
*/
ChunkitStreamer.prototype.processChunk = function (stream, name, chunkIndex, last, opts, cb) {
  if (Buffer.isBuffer(stream)) {
    stream = new StreamBuffer(stream);
  }

  if (typeof(opts) === 'function') {
    cb = opts;
    opts = null;
  }
  else {
    opts = Object.assign({}, this.options, opts);
  }

  this.adapter.processChunk(stream, Object.assign({
    name: name,
    chunkIndex: chunkIndex,
    isLast: last
  }, opts), cb);
}

util.inherits(ChunkitStreamer, EventEmitter);
module.exports = ChunkitStreamer;
