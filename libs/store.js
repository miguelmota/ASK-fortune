'use strict';

var path = require('path');
var _ = require('lodash');

var store = {
  cache: require(path.resolve(__dirname + '/../data/fortunes.json')),
  used: [],

  read: function(index) {
    var size = _.size(this.cache);

    if (!(_.isNumber(index) && index <= size)) {
      index = _.random(0, size-1);
      this.used.push(index);
    }

    return this.cache[index];
  }
};

module.exports = store;
