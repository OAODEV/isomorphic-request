/**
 * Tests
 */

define(function(require) {
    let registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');

    registerSuite({
      'passing test': function () {
        var result = 2 + 3;

        assert.equal(result, 5,
          'Addition operator should add numbers together');
      },
      'failing test': function () {
        var result = 2 * 3;

        assert.equal(result, 5,
          'Addition operator should add numbers together');
      }
    });
});
