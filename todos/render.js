'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const fs = require('fs');
const qs = require('qs');
const dust = require('dustjs-helpers');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};

module.exports.render = (event, context, callback) => {

  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the todos.'));
      return;
    }

    // For no good reason, write results to a temp files
    fs.writeFile("/tmp/goof-todos-render." + Math.random(),JSON.stringify(result.Items));

    var templateFile = './todos/render.dust';
    fs.readFile(templateFile, function(err, data) {
      if (err) {
        callback("Error 404");
      } else {
        // Interpret the EJS template server side to produce HTML content
        console.log("data:" + JSON.stringify(result.Items));
        // Prepare the dust template (really should be stored ahead of time...)
        var compiled = dust.compile(data.toString(), "dustTemplate");
        dust.loadSource(compiled);

        // Parse the query string
        var params = qs.parse(event.query);
        console.log("Parsed parameters: " + JSON.stringify(params));
        // Invoke the template
        dust.render("dustTemplate",
          {
            title: 'Goof TODO',
            subhead: 'Vulnerabilities at their best',
            device: params.device,
            todos: result.Items
          },
          function(error, html) {
              if (err) {
                console.error(error);
              } else {
                // Return the HTML wrapped in JSON to preserve encoding
                callback(null, {data: html});
              }
          } );
      }
    } );
  } );
};
