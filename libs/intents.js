'use strict';

var fortuneApp = require('./app');

module.exports = {
  'AMAZON.HelpIntent': function (intent, session, response) {
    response.ask('You can ask me for a fortune, by saying things like, "Alexa, open Fortune", and I will read you a read a random, hopefully interesting, adage.');
  },

  'AMAZON.StopIntent': function (intent, session, response) {
    session.attributes.keepAlive = false;
    response.tell('Goodbye.');
  },

  KeepAliveIntent: function (intent, session, response) {
    session.attributes.keepAlive = true;
    response.ask('Ok, just ask me for a fortune when you\'re ready.');
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
      response[tell]('Sorry, I don\'t remember the last fortune.');
    }
  }
};
