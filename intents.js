'use strict';

const _ = require('lodash');
const fortuneApp = require('./app');

module.exports = {
  ReadFortuneIntent: function (intent, session, response) {
    response.ask(fortuneApp.getFortune());
  },

  RepeatFortuneIntent: function (intent, session, response) {
    response.ask(fortuneApp.getLastFortune());
  },

  HelpIntent: function (intent, session, response) {
    response.tell('Ask me for a fortune.');
  },

  QuitIntent: function () {
    response.tell('Ok');
  }
};
