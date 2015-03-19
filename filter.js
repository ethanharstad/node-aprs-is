// http://www.aprs-is.net/javAPRSFilter.aspx

var Filter = {
  rangeFilter: function(point, range) {
    return 'r/' + point[1] + '/' + point[0] + '/' + range;
  },

  prefixFilter: function(prefixes) {
    var filter = 'p';
    if(prefixes.constructor === Array) {
      var length = prefixes.length;
      for(var i = 0; i < length; i++) {
        filter += '/' + prefixes[i];
      }
    } else {
      filter += '/' + prefixes;
    }
    return filter;
  },

  friendFilter: function(calls) {
    return this;
  },

  objectFilter: function(objects) {
    return this;
  },

  typeFilter: function(types, call, range) {
    return this;
  },

  symbolFilter: function(primary, alternate, overlay) {
    return this;
  },

  digipeaterFilter: function(digis) {
    return this;
  },

  areaFilter: function(area) {
    return this;
  },

  myRangeFilter: function(dist) {
    return this;
  },

  friendRangeFilter: function(call, dist) {
    return this;
  }
}

module.exports = Filter;
