var Packet = function(content, options) {
  if(typeof content === 'string') {
    // Decode the string
    var destinationIndex = content.indexOf('>');
    var payloadIndex = content.indexOf(':');
    this.sourceAddress = content.slice(0, destinationIndex);
    this.destinationAddress = content.slice(destinationIndex + 1, payloadIndex);
    this.payload = content.slice(payloadIndex + 1);
  } else {
    // Unpack the options
    
  }
}

module.exports = Packet;
