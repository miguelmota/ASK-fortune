'use strict';

var fs = require('fs');
var _ = require('lodash');
var concatStream = require('concat-stream');

var App = {
  filesPath: __dirname + '/fortunes',

  statuses: {
    ready: 1,
    loading: 2,
    loadingFail: 3
  },

  status: null,

  init: function() {
    this.status = this.statuses.loading;

    Store.load(function(data) {
      if (_.size(data) <= 0) {
        fs.readdir(this.filesPath, this.gotFiles.bind(this));
      } else {
        this.status = this.statuses.ready;
        this.handleReady();
      }
    }.bind(this));
  },

  readyCallbacks: [],

  handleReady: function() {
    this.readyCallbacks.forEach(function(callback) {
      callback(this);
    }.bind(this));
  },

  ready: function(callback) {
    this.readyCallbacks.push(callback);
  },

  handleError: function(error) {
    this.onErrorCallbacks.forEach(function(callback) {
      callback(error);
    }.bind(this));
  },

  onErrorCallbacks: [],

  onError: function(callback) {
    this.onErrorCallbacks.push(callback);
  },

  gotFiles: function(error, files) {
    if (error) {
      console.trace(error);
      return false;
    }

    var fileStreams = [];

    files.forEach(function(file, i) {
      var filePath = this.filesPath + '/' + file;

      fs.stat(filePath, function(error, stats) {
        var fileNameRegex = /^[\w-_]+$/gi;

        if (error) {
          console.trace(error);
          return false;
        }

        if (stats.isFile() && fileNameRegex.test(file)) {
          fileStreams.push(fs.createReadStream(filePath));
        }
        if (i === _.size(files) - 1) {
          fileStreams.forEach(this.splitIntoQuotes.bind(this));
        }
      }.bind(this));
    }.bind(this));
  },

  splitIntoQuotes: function(fileStream) {
    fileStream.on('error', function(error) {
      console.trace(error);
    });

    fileStream.pipe(concatStream(this.gotFileData.bind()));
  },

  gotFileData: function(buffer) {
    var body = buffer.toString();
    var separator = /^[^%][^\r\n]+/gim;
    var matches = body.match(separator);

    if (matches) {
      var filtered = matches.filter(function(string) {
        return _.size(string) > 0;
      }).map(function(string) {
        return string.trim();
      });


      Store.write(filtered);
      this.status = this.statuses.ready;
      this.handleReady();
    } else {
      this.status = this.statuses.loadingFail;
      this.handleError(new Error('Failed to load fortunes.'));
    }
  },

  getFortune: function() {
    return Store.read();
  },

  getLastReadFortune: function() {
    return Store.read(_.last(Store.used));
  }
};

var Store = {
  storeFile: __dirname + '/cache/fortunes.json',
  cache: [],
  used: [],

  load: function(callback) {
    var store = fs.createReadStream(this.storeFile);
    store.on('error', function() {
    })
    store.pipe(concatStream(function(buffer) {
      var body = buffer.toString();

      try {
        this.cache = JSON.parse(body);
      } catch(error) {
        console.trace(error);
      }

      callback(this.cache);
    }.bind(this)));
  },

  write: function(data) {
    this.cache = data;
    var store = fs.createWriteStream(this.storeFile);
    store.write(JSON.stringify(data));
    store.end();
  },

  read: function(index) {
    if (!_.isNumber(index)) {
      index = _.random(0, _.size(this.cache)-1);
      this.used.push(index);
    }

    return this.cache[index];
  }
};

module.exports = App;
