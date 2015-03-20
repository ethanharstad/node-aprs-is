// Module under test
var Factory = require('../packetFactory');
var Packet = require('../packet');

var assert = require('chai').assert;

describe.only('PacketFactory', function() {

  describe('decode', function() {

    it('creates a packet object', function() {
      var p = Factory.decode('SOURCE>DESTIN,VIA,VIA:payload');
      assert.instanceOf(p, Packet);
    });

    it('parses the source field', function() {
      var p = Factory.decode('SOURCE>DESTIN,VIA,VIA:payload');
      assert.equal(p.sourceAddress, 'SOURCE');
    });

    it('parses the destination field', function() {
      var p = Factory.decode('SOURCE>DESTIN,VIA,VIA:payload');
      assert.equal(p.destinationAddress, 'DESTIN,VIA,VIA');
    });

    it('parses the payload field', function() {
      var p = Factory.decode('SOURCE>DESTIN,VIA,VIA:payload');
      assert.equal(p.payload, 'payload');
    });

  });

  describe('encode', function() {

    it('creates a packet object', function() {
      var p = Factory.encode();
      assert.instanceOf(p, Packet);
    });

  });

});

describe('Packet', function() {



});
