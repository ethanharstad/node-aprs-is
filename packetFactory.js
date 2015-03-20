var Packet = require('./packet');

var PacketFactory = {
  decode: function(packet) {
    var destinationIndex = packet.indexOf('>');
    var payloadIndex = packet.indexOf(':');
    var source = packet.slice(0, destinationIndex);
    var destination = packet.slice(destinationIndex + 1, payloadIndex);
    var payload = packet.slice(payloadIndex + 1);
    return new Packet(source, destination, payload);
  },

  encode: function() {
    return new Packet();
  }
}

module.exports = PacketFactory;
