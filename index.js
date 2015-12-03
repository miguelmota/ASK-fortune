'use strict';

var AlexaSkill = require('./libs/AlexaSkill');
var intentHandlers = require('./intents');
var fortuneApp = require('./app');

fortuneApp.init();

fortuneApp.onError(function(error) {
  console.log(error);
});

// App ID for the skill
var APP_ID = '';

// App is a child of AlexaSkill
var App = function () {
  AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
App.prototype = Object.create(AlexaSkill.prototype);
App.prototype.varructor = App;

App.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
  console.log('App onSessionStarted requestId: ' + sessionStartedRequest.requestId + ', sessionId: ' + session.sessionId);
  // any initialization logic goes here
};

App.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
  console.log('App onLaunch requestId: ' + launchRequest.requestId + ', sessionId: ' + session.sessionId);

  fortuneApp.ready(function(app) {
    var speechOutput = app.getFortune();
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
  var app = new App();
  app.execute(event, context);
};
