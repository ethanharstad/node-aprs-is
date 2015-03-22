var net = require('net');
var PacketFactory = require('./packetFactory');

var APRS = function() {
  this.state = 'disconnected';
  this.username = null;
  this.passcode = null;
  this.serverName = null;
  this.serverSoftwareName = null;
  this.serverSoftwareVersion = null;
  this.socket = null;
};


APRS.prototype.connect = function(user, pass) {
  this.username = user;
  this.passcode = pass || null;
  var _this = this;
  var socket = net.connect({
    host: 'noam.aprs2.net',
    port: 14580
  });
  socket.on('connect', function() {
    _this.socket = this;
    _this.changeState('connected');
  });
  socket.on('end', function() {
    _this.socket = null;
    _this.serverSoftwareName = null;
    _this.serverSoftwareVersion = null;
    _this.changeState('disconnected');
  });
  socket.on('data', _this.parse.bind(_this));
};

APRS.prototype.disconnect = function() {
  this.socket.end();
};

APRS.prototype.changeState = function(state) {
  console.log('State changed:', state);
  this.state = state;
};

APRS.prototype.parse = function(data) {
  data = data.toString().slice(0, -2);

  if(data.charAt(0) === '#') {
    var tokens = data.split(' ');
    if(tokens[1] === 'logresp') {
      this.serverName = tokens[5];
      this.changeState(tokens[3]);
    } else if(tokens.length === 3) {
      this.serverSoftwareName = tokens[1];
      this.serverSoftwareVersion = tokens[2];
      this.login(this.username, this.passcode);
    }
  } else {
    var packet = PacketFactory.decode(data);
    console.log('From: ', packet.sourceAddress);
    console.log('Dest: ', packet.destinationAddress);
    console.log('Data: ', packet.payload);
  }
};

APRS.prototype.filter = function(filter) {
  var filterstring;
  if(Array.isArray(filter)) {
    filterstring = filter.join(' ');
  } else {
    filterstring = filter;
  }
  var packet = '# filter ' + filterstring;
  this.socket.write(packet + '\r\n');
};

APRS.prototype.login = function(user, pass, name, version) {
  var pass = pass || '-1';
  var name = name || 'node-aprs-is';
  var version = version || '0.0.1';
  var packet = 'user ' + user + ' pass ' + pass + ' vers ' + name + ' ' + version;
  this.socket.write(packet + '\r\n');
};

module.exports = APRS;
