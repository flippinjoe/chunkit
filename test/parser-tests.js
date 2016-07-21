
var should = require('chai').should();
var chunkit = require('../index');
var Parser = chunkit.Parser;


describe('#chunkFile', function () {

  it('should chunk properly with events', function (done) {
    var parser = new Parser();

    parser
      .chunkFile(__dirname + '/../example/resources/big-image.jpg', {chunkSize: 1024})
      .on('err', done)
      .on('end', function (count) {
        count.should.equal(958);
        done();
      })
  });

  it('should chunk properly with callback', function (done) {
    var parser = new Parser();

    parser.chunkFile(__dirname + '/../example/resources/big-image.jpg', function (err, count) {
      count.should.equal(2);
      done(err);
    })
  });

})
