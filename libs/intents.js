'use strict';

var fortuneApp = require('./app');
var text = require('./text');

module.exports = {
  'AMAZON.HelpIntent': HelpIntent,

  'AMAZON.CancelIntent': CancelIntent,

  'AMAZON.NoIntent': NoIntent,

  'AMAZON.StopIntent': StopIntent,

  'AMAZON.YesIntent': YesIntent,

  ReadFortuneIntent: ReadFortuneIntent,

  RepeatFortuneIntent: RepeatFortuneIntent
};

function CancelIntent(intent, session, response) {
  NoIntent(intent, session, response);
}

function HelpIntent(intent, session, response) {
    response.ask(text.help);
  }

function NoIntent(intent, session, response) {
  response.tell(text.exit);
}

function StopIntent(intent, session, response) {
  response.tell(text.exit);
}

function YesIntent(intent, session, response) {
  ReadFortuneIntent(intent, session, response);
}

function ReadFortuneIntent(intent, session, response) {
  response.ask(text.fortuneIs + ', ' + fortuneApp.getFortune() + '. ' + text.askForAnotherFortune);
}

function RepeatFortuneIntent(intent, session, response) {
  var message = fortuneApp.getLastReadFortune();

  if (message) {
    response.ask(text.fortuneWas + ', ' + message + '. ' + text.askForAnotherFortune);
  } else {
    response.ask(text.dontRememberLast + ' ' + text.askForAnotherFortune);
  }
}
