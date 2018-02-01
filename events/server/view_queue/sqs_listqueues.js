var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1' });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var params = {};

sqs.listQueues(params, function (err, data) {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Success', data.QueueUrls);
  }
});