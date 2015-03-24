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

  describe('time', function() {

    describe('decode', function() {

      it('decodes DHM zulu format', function() {
        var time = new Date();
        time.setUTCDate(9);
        time.setUTCHours(23);
        time.setUTCMinutes(45);
        time.setUTCSeconds(0);
        time.setUTCMilliseconds(0);
        assert.equal(Packet.decodeTime('092345z').getTime(), time.getTime());
      });

      it('decodes DHM local format', function() {
        var time = new Date();
        time.setDate(9);
        time.setHours(23);
        time.setMinutes(45);
        time.setSeconds(0);
        time.setMilliseconds(0);
        assert.equal(Packet.decodeTime('092345/').getTime(), time.getTime());
      });

      it('decodes HMS format', function() {
        var time = new Date();
        time.setUTCHours(23);
        time.setUTCMinutes(45);
        time.setUTCSeconds(17);
        time.setUTCMilliseconds(0);
        assert.equal(Packet.decodeTime('234517h').getTime(), time.getTime());
      });

      it('decodes MDHM format', function() {
        var time = new Date();
        time.setUTCMonth(10);
        time.setUTCDate(9);
        time.setUTCHours(23);
        time.setUTCMinutes(45);
        time.setUTCSeconds(0);
        time.setUTCMilliseconds(0);
        assert.equal(Packet.decodeTime('10092345').getTime(), time.getTime());
      });

      it('returns a default date', function() {
        var time = new Date();
        assert.closeTo(Packet.decodeTime().getTime(), time.getTime(), 500);
      })

    });

    describe('encode', function() {

      it('encodes DHM zulu format', function() {
        var time = new Date(Date.UTC(2014, 1, 2, 23, 45, 33));
        assert.equal(Packet.encodeTime(time, 'DHMZ'), '022345z');
      });

      it('encodes DHM local format', function() {
        var time = new Date(2014, 1, 2, 23, 45, 33);
        assert.equal(Packet.encodeTime(time, 'DHML'), '022345/');
      });

      it('encodes HMS format', function() {
        var time = new Date(Date.UTC(2014, 1, 2, 23, 45, 33));
        assert.equal(Packet.encodeTime(time, 'HMS'), '234533h');
      });

      it('encodes MDHM format', function() {
        var time = new Date(Date.UTC(2014, 1, 2, 23, 45, 33));
        assert.equal(Packet.encodeTime(time, 'MDHM'), '01022345');
      });

      it('returns DHM zulu default', function() {
        var time = new Date(Date.UTC(2014, 1, 2, 23, 45, 33));
        assert.equal(Packet.encodeTime(time), '022345z');
      });

    });

  });

});
