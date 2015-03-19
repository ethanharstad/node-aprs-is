var net = require('net');

module.exports = {

  state: 'disconnected',
  username: null,
  passcode: null,
  serverName: null,
  serverSoftwareName: null,
  serverSoftwareVersion: null,
  socket: null,

  connect: function(user, pass) {
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
  },

  disconnect: function() {
    this.socket.end();
  },

  changeState: function(state) {
    console.log('State changed:', state);
    this.state = state;
  },

  parse: function(data) {
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
      console.log('!>', data);
    }
  },

  filter: function(filter) {
    var packet = '# filter ' + filter;
    this.socket.write(packet + '\r\n');
  },

  login: function(user, pass, name, version) {
    var pass = pass || '-1';
    var name = name || 'node-aprs-is';
    var version = version || '0.0.1';
    var packet = 'user ' + user + ' pass ' + pass + ' vers ' + name + ' ' + version;
    this.socket.write(packet + '\r\n');
  }

};
