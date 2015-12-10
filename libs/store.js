'use strict';

var path = require('path');
var _ = require('lodash');

var store = {
  cache: require(path.resolve(__dirname + '/../data/fortunes.json')),
  used: [],

  getAvailable: function() {
    return this.cache.map(function(message, i) {
      return {
        message: message,
        index: i
      };
    }).filter(function(item) {
      return this.used.indexOf(item.index) === -1;
    }.bind(this));
  },

  getRandomIndex: function() {
    var available = this.getAvailable();
    var size = _.size(available);

    if (size === 0) {
      this.used = [];
      return this.getRandomIndex();
    }

    var index = _.get(_.get(available, _.random(0, size - 1)), 'index');

    return index;
  },

  read: function(index) {
    var size = _.size(this.cache);

    if (!(_.isNumber(index) && index <= size)) {
      index = this.getRandomIndex();
      this.used.push(index);
    }

    return this.cache[index];
  }
};

module.exports = store;
