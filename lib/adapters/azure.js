

var Adapter = require('../adapter');
var util = require('util');
var azure = require('azure-storage');


/**
 * Instantiate here
*/
function AzureStreamAdapter (opts) {
  opts = Object.assign({
    storageAccount: process.env.AZURE_STORAGE_ACCOUNT,
    storageKey: process.env.AZURE_STORAGE_ACCESS_KEY
  }, opts)

  /// Validate that these are given.  Otherwise we can't do anything
  if (opts.storageAccount == null || opts.storageKey == null) {
    throw new Error('Invalid configuration for azure streaming.  Please reference the installation guide');
  }

  Adapter.call(this, opts);
}

util.inherits(AzureStreamAdapter, Adapter);

AzureStreamAdapter.prototype.options = {
  folder: 'chunkedit'
};

AzureStreamAdapter.prototype.service = function () {
  return azure.createBlobService(this.options.storageAccount, this.options.storageKey);
}
/**
/// Steps to get this right
// 1.  Create container if necessary
// 2.  Create blockBlob
// 3.  Commit Blocks if necessary
// 4.  Done
*/
AzureStreamAdapter.prototype.processChunk = function (stream, config, cb) {
  var blobService = this.service();
  var blobId = config.name;
  var containerName = this.options.folder || config.container;
  var chunkNumber = config.chunkIndex;
  var isLastChunk = config.isLast || false;
  var size = stream._length || stream._readableState.buffer.length;
  var blockId = blobService.getBlockId(blobId, chunkNumber);

  // TODO:  Document this
  config = Object.assign({
    containerPermissions: {publicAccessLevel: 'container'}
  }, config);

  var opts = config.containerPermissions;
  blobService.createContainerIfNotExists(containerName, opts, function (err, cData) {
    if (err) return cb(err, null);

    blobService.createBlockFromStream(blockId, containerName, blobId, stream, size, function (err, bData) {
      if (err) return cb(err, null);

      if (isLastChunk) {
        azCommitBlocks(blobService, containerName, blobId, cb);
      } 
      else {
        cb(null, bData);
      }
    });
  });
}


function azCommitBlocks (service, containerName, blobId, cb) {
  service.listBlocks(
    containerName,
    blobId,
    azure.BlobUtilities.BlockListFilter.ALL,
    function (err, data) {
      if (err) return cb(err, null);

      var blockList = {
        LatestBlocks: data.UncommittedBlocks.map(function (d) { return d.Name; })
      };
      service.commitBlocks(containerName, blobId, blockList, cb);
  });
}


module.exports = AzureStreamAdapter;
