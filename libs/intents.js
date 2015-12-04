'use strict';

var fortuneApp = require('./app');

module.exports = {
  HelpIntent: function (intent, session, response) {
    response.tell('Ask me for a fortune.');
  },

  KeepAliveIntent: function (intent, session, response) {
    session.attributes.keepAlive = true;
    response.ask('Ok.');
  },

  ReadFortuneIntent: function (intent, session, response) {
    var tell = session.attributes.keepAlive ? 'ask' : 'tell';

    response[tell](fortuneApp.getFortune());
  },

  RepeatFortuneIntent: function (intent, session, response) {
    var tell = session.attributes.keepAlive ? 'ask' : 'tell';
    var message = fortuneApp.getLastReadFortune();

    if (message) {
      response[tell](message);
    } else {
      response[tell]('I don\'t remember the last fortune.');
    }
  },

  QuitIntent: function (intent, session, response) {
    session.attributes.keepAlive = false;
    response.tell('Goodbye.');
  }
};
