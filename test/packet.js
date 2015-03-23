// Module under test
var Packet = require('../packet');

var assert = require('chai').assert;

describe.only('Packet', function() {

  describe('constructor', function() {

    describe('decode form', function() {
      it('creates a packet object', function() {
        var p = new Packet('SOURCE>DESTIN,VIA,VIA:payload');
        assert.instanceOf(p, Packet);
      });

      it('parses the source field', function() {
        var p = new Packet('SOURCE>DESTIN,VIA,VIA:payload');
        assert.equal(p.sourceAddress, 'SOURCE');
      });

      it('parses the destination field', function() {
        var p = new Packet('SOURCE>DESTIN,VIA,VIA:payload');
        assert.equal(p.destinationAddress, 'DESTIN,VIA,VIA');
      });

      it('parses the payload field', function() {
        var p = new Packet('SOURCE>DESTIN,VIA,VIA:payload');
        assert.equal(p.payload, 'payload');
      });
    });

    describe('encode form', function() {

      it('creates a packet object', function() {
        var p = new Packet();
        assert.instanceOf(p, Packet);
      });

    });

  });

  describe('base91', function() {

    it('decodes base91', function() {
      assert.equal(Packet.base91decode('1Cmi'), 12345678);
    });

    it('encodes base91', function() {
      assert.equal(Packet.base91encode(12345678), '1Cmi');
    });

  });

});
