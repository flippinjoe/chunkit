
/**
 * Chunkit streamer is used to stream files to external
 * sources
*/

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');

var logger = util.debuglog('chunkit');

/**
 * @param {Object} opts - Optional configuration options for parsing
 * @constructor
*/
function ChunkitStreamer (opts) {
    EventEmitter.call(this, opts);
}

module.exports = util.inherits(ChunkitStreamer, EventEmitter);
