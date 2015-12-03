'use strict';

const _ = require('lodash');
const AlexaSkill = require('./libs/AlexaSkill');
const intentHandlers = require('./intents');
const fortuneApp = require('./app');

fortuneApp.init();

fortuneApp.onError(function(error) {
  console.log(error);
});

// App ID for the skill
const APP_ID = '';

// App is a child of AlexaSkill
const App = function () {
  AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
App.prototype = Object.create(AlexaSkill.prototype);
App.prototype.constructor = App;

App.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
  console.log('App onSessionStarted requestId: ' + sessionStartedRequest.requestId + ', sessionId: ' + session.sessionId);
  // any initialization logic goes here
};

App.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
  console.log('App onLaunch requestId: ' + launchRequest.requestId + ', sessionId: ' + session.sessionId);

  fortuneApp.ready(function(app) {
    const speechOutput = app.getFortune();
    response.ask(speechOutput);
  });

};

App.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
  console.log('App onSessionEnded requestId: ' + sessionEndedRequest.requestId + ', sessionId: ' + session.sessionId);
  // any cleanup logic goes here
};

App.prototype.intentHandlers = intentHandlers;

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  // Create an instance of the App skill.
  const app = new App();
  app.execute(event, context);
};
