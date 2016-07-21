/**
 * Chunkit parser is used to parse data into chunks
*/

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var path = require('path');
var fs = require('fs');

var logger = util.debuglog('chunkit');


////////////////// Callback Definitions

/**
 * Callback used when receiving chunks of data
 * @callback ChunkParser~finished
 * @param {Error} err - If there was an error
 * @param {number} chunkCount - The number of chunks processed
 * @param {string} responseMessage
 */



/**
 * @param {Object} opts - Optional configuration options for parsing
 * @constructor
*/
function ChunkitParser (opts) {
    EventEmitter.call(this, opts);
}

ChunkitParser.prototype.chunkSize = 1024 * 512;  // 512kb

/**
 * Chunk a given file at the filePath
 *
 * @param {String} filePath - The path to the file for chunking
 * @param {Object} [opts=] - Optional configuration options
 * @param {number} [opts.chunkSize] - Override for global chunkSize
 * @param {ChunkParser~chunkCallback} [callback] - Callback when finished
*/
ChunkitParser.prototype.chunkFile = function (filePath, opts, callback) {
  filePath = path.resolve(filePath);

  if (typeof opts == 'function') {
    callback = opts;
    opts = null;
  }

  var self = new EventEmitter();
  opts = Object.assign({chunkSize: this.chunkSize}, opts);

  // TODO:  Should we get expected chunks up front?
  function cbWrap (err, count) {
    if (callback) {
      callback(err, count);
    }
  }

  self.on('err', function (err, index) {
    cbWrap(err, index);
  })

  logger('Starting: ', filePath);
  fs.open(filePath, 'r', function(err, fd) {
    if (err) { return self.emit('err', err); }   // TODO: Custom error?

    /// Create our operating buffer
    var _chunkIndex = 0;

    /// Setup internal listeners here
    self.on('chunk', function (index, count, dataBuffer) {
        logger('Processing chunk: ', dataBuffer.length);
    })

    self.on('end', function (count) {
        cbWrap(null, count);
    })

    //// Start the actual work here
    self.emit('start', {file: filePath});

    function processNextChunk () {
      var _buffer = new Buffer(opts.chunkSize);
      fs.read(fd, _buffer, 0, opts.chunkSize, null, function (err, nread) {
        if (err) { return self.emit('err', err); } // TODO:  Custom Error?
        _chunkIndex++;

        var data = (nread < opts.chunkSize) ? _buffer.slice(0, nread) : _buffer;
        self.emit('chunk', _chunkIndex, (nread < opts.chunkSize), data);

        if (nread < opts.chunkSize) {
          fs.close(fd, function (err) {
            if (err) { return self.emit('err', err); } // TODO:  Custom Error?

            self.emit('end', _chunkIndex);
          })
        }
        else {
          setTimeout(processNextChunk, 100);
        }
      })
    }
    processNextChunk();
  });

  return self;
}

util.inherits(ChunkitParser, EventEmitter);

module.exports = ChunkitParser;
