
var chunkit = require('../index');

var parser = new chunkit.Parser();
parser.chunkFile(__dirname + '/resources/big-image.jpg')
  .on('chunk', function (idx) {
    console.log("Chunk: ", idx);
  })
  .on('end', function () {
    console.log("done");
  });
