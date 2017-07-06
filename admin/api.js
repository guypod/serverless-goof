'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const qs = require('qs');

const adminSecret = "ea29cbdb-a562-442a-8cc2-adbc6081d67c";

module.exports.api = (event, context, callback) => {

  if (!event.queryStringParameters ||
    !event.queryStringParameters.secret ||
    event.queryStringParameters.secret != adminSecret) {
      // Return an unauthorized response
      const errResponse = {
        statusCode: 401,
        body: "Invalid admin token",
      };
      callback(null,errResponse);
    }

    // We're authorised, let's call the admin action
    var lambda = new AWS.Lambda();

    // Choose the action to perform
    var action = event.pathParameters.action;
    var funcName = "serverless-goof-dev-internalBackup";
    if (action == "restore") {
      funcName = "serverless-goof-dev-internalRestore";
    }
    // Invoke it!
    console.log("invoking " + funcName);
    lambda.invoke({
      FunctionName: funcName,
      Payload: JSON.stringify(event, null, 2) // pass params
    }, function(error, data) {
      if (error) {
        console.log("Got error on invoke of " + funcName + " : " +
        JSON.stringify(error));
        const errResponse = {
          statusCode: 500,
          body: JSON.stringify(error),
        };
        callback(null,error);
      }
      else if(data && data.Payload){
        console.log("Successfully invoked " + funcName);
        // create a response
        const response = {
          statusCode: 200,
          body: "API call Complete",
        };
        callback(null, response);
      }
    } );
  }
