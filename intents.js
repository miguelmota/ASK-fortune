'use strict';

var fortuneApp = require('./app');

module.exports = {
  ReadFortuneIntent: function (intent, session, response) {
    response.ask(fortuneApp.getFortune());
  },

  RepeatFortuneIntent: function (intent, session, response) {
    var message = fortuneApp.getLastFortune();

    if (message) {
      response.ask(message);
    } else {
      response.ask('I don\'t remember the last fortune.');
    }
  },

  HelpIntent: function (intent, session, response) {
    response.tell('Ask me for a fortune.');
  },

  QuitIntent: function (intent, session, response) {
    response.tell('Ok');
  }
};
