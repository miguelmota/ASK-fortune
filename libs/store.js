'use strict';

var _ = require('lodash');

var store = {
  cache: require(__dirname + '/data/fortunes.json'),
  used: [],

  read: function(index) {
    if (!_.isNumber(index)) {
      index = _.random(0, _.size(this.cache)-1);
      this.used.push(index);
    }

    return this.cache[index];
  }
};

module.exports = store;
