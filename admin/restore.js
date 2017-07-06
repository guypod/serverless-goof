'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

module.exports.restore = (event, context, callback) => {

  console.log("Performing Restore");

  // create a response
  const response = {
    statusCode: 200,
    body: "Restore Complete",
  };
  callback(null, response);
};
