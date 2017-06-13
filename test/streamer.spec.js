var chunkit = require('../index');

describe('#callback', function () {
  it('should upload', function (done) {
    var container = 'localhost-images';
    var parser = new chunkit.Parser();
    var streamer = new chunkit.Streamer('azure', {
        storageAccount: process.env.STORAGE_NAME,
        storageKey: process.env.STORAGE_KEY,
        folder: container
    });



    parser
      .chunkFile(__dirname + '/../example/resources/big-image.jpg', {chunkSize: 1024 * 1024})
      .on('chunk', function (idx, isLast, buffer) {
        var originalFileName = 'IMG_0011.JPG';
        var ext = originalFileName.split('.').pop();
        var fileKey = 'test@blah.com-' + (new Date()).getTime() + '.' + ext;


        streamer.processChunk(buffer, fileKey, idx, isLast, function (err) {
            if (err) {
                // TODO:  Normalize the error
                console.log(err);
                return;
            }

            console.log("Success: ", idx, isLast);
            // if (!isLast) { return res.status(200).end(); }
            if (isLast) {
              done();
            }

            /// Now create an image for this thing

        });
      })
      .on('end', function (err, count) {
        count.should.equal(1);
      });
  });
});
