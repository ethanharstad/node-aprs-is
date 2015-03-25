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

  describe('coordinates', function() {

    describe('decode', function() {

      it('decodes a positive latitude', function() {
        assert.closeTo(Packet.decodeCoordinate('1212.34N'), 12.20567, .00001);
      });

      it('decodes a negative latitude', function() {
        assert.closeTo(Packet.decodeCoordinate('1212.34S'), -12.20567, .00001);
      });

      it('decodes a positive longitude', function() {
        assert.closeTo(Packet.decodeCoordinate('12312.34E'), 123.20567, .00001);
      });

      it('decodes a negative longitude', function() {
        assert.closeTo(Packet.decodeCoordinate('12312.34W'), -123.20567, .00001);
      });

    });

    describe('encode', function() {

      it('encodes a positive latitude', function() {
        assert.equal(Packet.encodeCoordinate(12.20567, 'latitude'), '1212.34N');
      });

      it('encodes a negative latitude', function() {
        assert.equal(Packet.encodeCoordinate(-12.20567, 'latitude'), '1212.34S');
      });

      it('encodes a positive longitude', function() {
        assert.equal(Packet.encodeCoordinate(123.20567, 'longitude'), '12312.34E');
      });

      it('encodes a negative longitude', function() {
        assert.equal(Packet.encodeCoordinate(-123.20567, 'longitude'), '12312.34W');
      });

      it('encodes latitudes with zero padding', function() {
        assert.equal(Packet.encodeCoordinate(0.0, 'latitude'), '0000.00N');
      });

      it('encodes longitudes with zero padding', function() {
        assert.equal(Packet.encodeCoordinate(0.0, 'longitude'), '00000.00E');
      });

      it('encodes latitude by default', function() {
        assert.equal(Packet.encodeCoordinate(12.20567).slice(-1), 'N');
      })

    });

  });

  describe('uncompressed position', function() {

    it('decodes a position string', function() {
      var p = Packet.decodePosition('4903.50N/07201.75W-');
      assert.equal(p.symbolTable, '/', 'symbolTable');
      assert.equal(p.symbolCode, '-', 'symbolCode');
      assert.closeTo(p.latitude, 49.05833, 0.0001, 'latitude');
      assert.closeTo(p.longitude, -72.029167, 0.0001, 'longitude');
    });

    it('encodes a position string', function() {
      var p = Packet.encodePosition(49.05834, -72.029167, '/', '-');
      assert.equal(p, '4903.50N/07201.75W-');
    })

  });

  describe('compressed position', function() {

    it('compresses latitude', function() {
      assert.equal(Packet.compressLatitude(12.12), 'HBL^');
    });

    it('compresses longitude', function() {
      assert.equal(Packet.compressLongitude(-72.75), '<*e7');
    });

    it('decompresses latitude', function() {
      assert.closeTo(Packet.decompressLatitude('HBL^'), 12.12, 0.00001);
    });

    it('decompresses longitude', function() {
      assert.closeTo(Packet.decompressLongitude('<*e7'), -72.75, 0.00001)
    });

  })

});
