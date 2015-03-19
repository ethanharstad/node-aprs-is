// Module under test
var Filter = require('../filter');

var assert = require('chai').assert;

describe('Filter', function() {

  describe('rangeFilter', function() {
    it('returns well formatted string', function() {
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

  describe('prefixFilter', function() {});

  describe('friendFilter', function() {});

  describe('objectFilter', function() {});

  describe('typeFilter', function() {});

  describe('symbolFilter', function() {});

  describe('digipeaterFilter', function() {});

  describe('areaFilter', function() {});

  describe('myRangeFilter', function() {});

  describe('friendRangeFilter', function() {});

});
