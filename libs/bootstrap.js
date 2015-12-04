'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var concatStream = require('concat-stream');

var bootstrap = {
  filesPath: path.resolve(__dirname + '/../data/fortunes'),

  init: function() {
    fs.readdir(this.filesPath, this.gotFiles.bind(this));
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

    fileStream.pipe(concatStream(this.gotFileData.bind(this)));
  },

  gotFileData: function(buffer) {
    var body = buffer.toString();
    var separator = /[\r\n]%[\r\n]/i
    var matches = body.split(separator);

    if (matches) {
      var filtered = matches.filter(function(string) {
        return _.size(string) > 0;
      }).map(function(string) {
        return string.trim();
      });


      this.write(filtered);
    } else {
      console.log(new Error('Failed to load fortunes.'));
    }
  },

  storeFile: path.resolve(__dirname + '/../data/fortunes.json'),

  write: function(data) {
    var store = fs.createWriteStream(this.storeFile);
    store.write(JSON.stringify(data, null, 2));
    store.end();
    console.log('File written');
  }
};

bootstrap.init();
