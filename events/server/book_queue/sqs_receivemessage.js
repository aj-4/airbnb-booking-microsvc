//post function
var insertBook = require('../../database/bookInsertion');

//config
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var queueURL = 'https://sqs.us-west-1.amazonaws.com/608151570921/bookingQ';

var receiveMessageLoop = function() {
  var params = {
    AttributeNames: [
      'SentTimestamp'
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
      'All'
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 1
  };

  sqs.receiveMessage(params, function (err, data) {
    if (err) {
      console.log('Receive Error', err);
    } else if (data.Messages) {
      console.log('message is: ', data.Messages[0]);
      var deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      sqs.deleteMessage(deleteParams, function (err, data) {
        if (err) {
          console.log('Delete Error', err);
        } else {
          console.log('Message Deleted', data);
          receiveMessage();
        }
      });
    }
  });
};

module.exports = receiveMessageLoop;