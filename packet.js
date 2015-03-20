var Packet = function(source, destination, payload) {
  this.sourceAddress = source,
  this.destinationAddress = destination,
  this.payload = payload
}

module.exports = Packet;
