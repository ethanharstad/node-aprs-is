// Module under test
var Filter = require('../filter');

var assert = require('chai').assert;

describe('Filter', function() {

  describe('rangeFilter', function() {
    it('returns a well formatted string', function() {
      var f = Filter.rangeFilter([-93,42], 100);
      assert.notEqual(f.search('^r/-?[0-9]{1,2}\.?[0-9]{0,}/-?[0-9]{1,3}\.?[0-9]{0,}/[0-9]{1,}$'), -1);
    });

    it('generates correctly', function() {
      var f = Filter.rangeFilter([-93,42], 100);
      var tokens = f.split('/');
      assert.equal(tokens[0], 'r', 'filter key');
      assert.equal(tokens[1], '42', 'latitude');
      assert.equal(tokens[2], '-93', 'longitude');
      assert.equal(tokens[3], '100', 'range');
    });
  });

  describe('prefixFilter', function() {
    it('returns a well formatted string');

    it('generates correctly for a single input');

    it('generates correctly for multiple inputs');
  });

  describe('friendFilter', function() {
    it('returns a well formatted string');

    it('generates correctly for a single input');

    it('generates correctly for multiple inputs');
  });

  describe('objectFilter', function() {
    it('returns a well formatted string');

    it('generates correctly for a single input');

    it('generates correctly for multiple inputs');
  });

  describe('typeFilter', function() {
    it('returns a well formatted string');

    it('generates correctly');
  });

  describe('symbolFilter', function() {
    it('returns a well formatted string');

    it('generates correctly');
  });

  describe('digipeaterFilter', function() {
    it('returns a well formatted string');

    it('generates correctly for a single input');

    it('generates correctly for multiple inputs');
  });

  describe('areaFilter', function() {
    it('returns a well formatted string');

    it('generates correctly');
  });

  describe('myRangeFilter', function() {
    it('returns a well formatted string');

    it('generates correctly');
  });

  describe('friendRangeFilter', function() {
    it('returns a well formatted string');

    it('generates correctly');
  });

});
