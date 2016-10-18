
/**
 * Adapter is meant to be an abstract item to be inherited from
*/

var EventEmitter = require('events').EventEmitter;
var StreamBuffer = require('./buffer-stream');
var util = require('util');
var fs = require('fs');

var logger = util.debuglog('chunkit');

/**
 * @param {Object} opts - Optional configuration options for parsing
 * @param {String} opts.folder - The folder to store images under
 * @constructor
*/
function ChunkitAdapter (opts) {
    EventEmitter.call(this, opts);

    this.options = Object.assign({}, opts);
}

/**
 * Process a chunk of data
 * @param {ReadableStream} stream - The stream to process
 * @param {String} name - The name of the chunk
 * @param {Number} chunkNumber - The chunk index
 * @param {Boolean} isLast - Whether or not this is the last chunk
 * @param {callback} [cb] - Optional callback when finished
*/
ChunkitAdapter.prototype.processChunk = function (stream, name, chunkNumber, isLast, cb) {
  throw Error('Should not call this directly');
}

// TODO:  Should we add this
// ChunkitAdapter.prototype.commit = function (name, opts) {
//     var opts = Object.assign({}, this.options, opts);
//     azCommitBlocks(opts.folder, name, function () {});
// }


util.inherits(ChunkitAdapter, EventEmitter);
module.exports = ChunkitAdapter;
