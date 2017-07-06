'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

module.exports.backup = (event, context, callback) => {

  console.log("Performing Backup");

  // create a response
  const response = {
    statusCode: 200,
    body: "Backup Complete",
  };
  callback(null, response);
};
