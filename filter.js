// http://www.aprs-is.net/javAPRSFilter.aspx

var Filter = function() {
  this.filterString = '';
}

Filter.prototype.rangeFilter = function(point, range) {
  if(this.filterString.length > 0) {
    this.filterString += ' ';
  }
  this.filterString += 'r/' + point[1] + '/' + point[0] + '/' + range
  return this;
}

Filter.prototype.prefixFilter = function(prefixes) {
  if(this.filterString.length > 0) {
    this.filterString += ' ';
  }
  this.filterString += 'p';
  if(prefixes.constructor === Array) {
    var length = prefixes.length;
    for(var i = 0; i < length; i++) {
      this.filterString += '/' + prefixes[i];
    }
  } else {
    this.filterString += '/' + prefixes;
  }
  return this;
}

Filter.prototype.friendFilter = function(calls) {
  return this;
}

Filter.prototype.objectFilter = function(objects) {
  return this;
}

Filter.prototype.typeFilter = function(types, call, range) {
  return this;
}

Filter.prototype.symbolFilter = function(primary, alternate, overlay) {
  return this;
}

Filter.prototype.digipeaterFilter = function(digis) {
  return this;
}

Filter.prototype.areaFilter = function(area) {
  return this;
}

Filter.prototype.myRangeFilter = function(dist) {
  return this;
}

Filter.prototype.friendRangeFilter = function(call, dist) {
  return this;
}

module.exports = Filter;
