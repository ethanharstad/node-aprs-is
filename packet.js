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
        this.packetType = 'position';
        this.time = Packet.decodeTime(this.payload.slice(1,8));
        break;
      case '!': // Position, w/o timestamp, w/o messaging
      case '=': // Position, w/o timestamp, w/ messaging
        this.packetType = 'position';
        this.time = Packet.decodeTime();
        break;
    }

  } else {
    // Unpack the options

  }
}

Packet.decodeCoordinate = function(value) {
  var position = value.slice(0, -1);
  var hemisphere = value.slice(-1);
  var tokens = position.split('.');
  var deg = Number(tokens[0].slice(0, -2));
  var min = Number(tokens[0].slice(-2));
  min += Number(tokens[1]) / 100;
  var coordinate = deg + min / 60;
  if(hemisphere === 'S' || hemisphere === 'W') {
    coordinate *= -1;
  }
  return coordinate;
};

Packet.encodeCoordinate = function(value, type) {
  type = type || 'latitude';
  var coordinate = '';
  var deg = ~~value;
  var min = (Math.abs(value - deg) * 60);
  var intMin = ~~ min;
  var decMin = ~~((min - intMin) * 100);
  var pad = '000';
  if(type === 'longitude') {
    coordinate += String(pad + deg).slice(-3);
  } else {
    coordinate += String(pad + deg).slice(-2);
  }
  coordinate += String(pad + intMin).slice(-2) + '.';
  coordinate += String(pad + decMin).slice(-2);
  if(value >= 0) {
    if(type === 'longitude') {
      coordinate += 'E';
    } else {
      coordinate += 'N';
    }
  } else {
    if(type === 'longitude') {
      coordinate += 'W';
    } else {
      coordinate += 'S';
    }
  }
  return coordinate;
};

Packet.decodeTime = function(value) {
  var time = new Date();
  if(typeof value === 'string') {
    switch(value.slice(-1)) {
      case 'z':
        time.setUTCDate(Number(value.slice(0,2)));
        time.setUTCHours(Number(value.slice(2, 4)));
        time.setUTCMinutes(Number(value.slice(4, 6)));
        time.setUTCSeconds(0);
        time.setUTCMilliseconds(0);
        break;
      case '/':
        time.setDate(Number(value.slice(0,2)));
        time.setHours(Number(value.slice(2, 4)));
        time.setMinutes(Number(value.slice(4, 6)));
        time.setSeconds(0);
        time.setMilliseconds(0);
        break;
      case 'h':
        time.setUTCHours(Number(value.slice(0,2)));
        time.setUTCMinutes(Number(value.slice(2,4)));
        time.setUTCSeconds(Number(value.slice(4,6)));
        time.setUTCMilliseconds(0);
        break;
      default:
        time.setUTCMonth(Number(value.slice(0,2)));
        time.setUTCDate(Number(value.slice(2,4)));
        time.setUTCHours(Number(value.slice(4,6)));
        time.setUTCMinutes(Number(value.slice(6,8)));
        time.setUTCSeconds(0);
        time.setUTCMilliseconds(0);
    }
  }
  return time;
};

Packet.encodeTime = function(value, format) {
  var time = '';
  switch(format) {
    case 'HMS':
      // Hour
      var token = value.getUTCHours().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      // Minute
      token = value.getUTCMinutes().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      // Second
      token = value.getUTCSeconds().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      time += 'h';
      break;
    case 'MDHM':
      // Month
      var token = value.getUTCMonth().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      // Date
      var token = value.getUTCDate().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      // Hour
      token = value.getUTCHours().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      // Minute
      token = value.getUTCMinutes().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      break;
    case 'DHML':
      // Date
      var token = value.getDate().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      // Hour
      token = value.getHours().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      // Minute
      token = value.getMinutes().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      time += '/';
      break;
    case 'DHMZ':
    default:
      // Date
      var token = value.getUTCDate().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      // Hour
      token = value.getUTCHours().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      // Minute
      token = value.getUTCMinutes().toString();
      if(token.length < 2) {
        token = '0' + token;
      }
      time += token;
      time += 'z';
  }
  return time;
};

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
