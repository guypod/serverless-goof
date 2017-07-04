'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const fs = require('fs');
//const ejs = require('ejs');
const dust = require('dustjs-linkedin');


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
        //var html = ejs.render(data.toString(),{
        dust.render("dustTemplate",
          {
            title: 'Goof TODO',
            subhead: 'Vulnerabilities at their best',
            todos: result.Items
          },
          function(error, html) {
              if (err) {
                console.log(error);
              } else {
                console.log("html: " + html);
                // Return the HTML wrapped in JSON to preserve encoding
                callback(null, {data: html});
              }
          } );
      }
    } );
  } );
};
