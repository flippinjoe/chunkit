

var buffer = new Buffer("I'm a string!", "utf-8");

var chunkSize = 10;
for (var i = 0; i < buffer.length; i += chunkSize) {

  var read = buffer.slice(i, i + chunkSize);

  console.log("Val: ", i, read.toString());
}
