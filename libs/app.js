'use strict';

var _ = require('lodash');
var store = require('./store');

var App = {
  handleError: function(error) {
    this.onErrorCallbacks.forEach(function(callback) {
      callback(error);
    }.bind(this));
  },

  onErrorCallbacks: [],

  onError: function(callback) {
    this.onErrorCallbacks.push(callback);
  },

  getFortune: function() {
    return store.read();
  },

  getLastReadFortune: function() {
    return store.read(_.last(store.used));
  }
};

module.exports = App;
