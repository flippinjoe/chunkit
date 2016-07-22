
var should = require('chai').should();
var chunkit = require('../index');
var Parser = chunkit.Parser;

describe('#initialize', function () {
    it('should default params', function () {
      (new Parser()).chunkSize.should.equal(1024 * 512);
    })

    it('should allow param overrides', function () {
      (new Parser({chunkSize: 100})).chunkSize.should.equal(100);
    })
})

describe('#chunkFile~events', function () {

  it('should succeed with valid params', function (done) {
    var parser = new Parser();

    parser
      .chunkFile(__dirname + '/../example/resources/big-image.jpg', {chunkSize: 1024})
      .on('end', function (err, count) {
        count.should.equal(958);
        done(err);
      })
  });


  it('should fail with invalid filepath', function (done) {
    var parser = new Parser();

    parser.chunkFile('notvalid')
      .on('err', function (err) {
        err.should.be.an('error');
        err.should.not.be.null;
      })
      .on('end', function () {
        done();
      })
  })

});

describe('#chunkFile~callback', function () {

  it('succeed with valid filepath', function (done) {
    var parser = new Parser();

    parser.chunkFile(__dirname + '/../example/resources/big-image.jpg', function (err, count) {
      count.should.equal(2);
      done(err);
    })
  });

  it('should fail with invalid file path', function (done) {
    (new Parser()).chunkFile('not-falid', function (err, count) {

      err.should.be.an('error');
      err.should.not.be.null;
      done();
    })
  })

})
