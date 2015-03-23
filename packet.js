var Packet = function(content, options) {
  if(typeof content === 'string') {
    // Decode the string
    var destinationIndex = content.indexOf('>');
    var payloadIndex = content.indexOf(':');
    this.sourceAddress = content.slice(0, destinationIndex);
    this.destinationAddress = content.slice(destinationIndex + 1, payloadIndex);
    this.payload = content.slice(payloadIndex + 1);

    // Determine packet type
    switch(this.payload.charAt(0)) {
      case '\x1c':  // Current mic-e
      case '\x1d':  // Old mic-e
      case '`':     // Current mic-e
      case '\'':    // Old mic-e or new TM-D700
        this.packetType = 'mic-e';
        break;
      case '/': // Position, w/ timestamp, w/o messaging
      case '@': // Position, w/ timestamp, w/ messaging
      case '!': // Position, w/o timestamp, w/o messaging
      case '=': // Position, w/o timestamp, w/ messaging
        this.packetType = 'position';
        break;
    }

  } else {
    // Unpack the options

  }
}

Packet.base91decode = function(value) {
  var ret = 0;
  var len = value.length;
  for(var n = 0; n < len; n++) {
    var x = value.charCodeAt(len - n - 1) - 33;
    ret += x * Math.pow(91, n);
  }
  return ret;
};

Packet.base91encode = function(value) {
  var ret = '';
  var n = 1;
  while(Math.pow(91, n) <= value) {
    n++;
  }
  for(; n >= 1; n--) {
    var div = Math.pow(91, n - 1);
    var x = Math.floor(value / div);
    value = value % div;
    ret += String.fromCharCode(x + 33);
  }
  return ret;
};

module.exports = Packet;
