//post function
var insertView = require('../../../database/viewInsertion');

//config
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var queueURL = 'https://sqs.us-west-1.amazonaws.com/608151570921/viewQ';

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
  WaitTimeSeconds: 10
};

var receiveMessageLoop = function() {

  // console.log('loop beginning');
  sqs.receiveMessage(params, async (err, data) => {
    if (err) {
      console.log('error receiving message...')
    } else if (data.Messages) {
      console.log('got message: 📧');
      insertView(data.Messages[0].MessageAttributes.ListingId.StringValue, data.Messages[0].MessageAttributes.HostId.StringValue)
      .saveAsync()
        .then(function () {
          console.log('inserted to db ⛩');
          var deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: data.Messages[0].ReceiptHandle
          };
          sqs.deleteMessage(deleteParams, function (err, data) {
            if (err) {
              console.log('could not delete msg');
            } else {
              console.log('waiting for next message...');
              setTimeout(receiveMessageLoop, 1000);
            }
          });
        })
        .catch(function (err) {
          console.log('error in receive msg')
        });
    } else {
      console.log('none found, waiting... 💀');
      setTimeout(receiveMessageLoop, 1000);
    }
  });
};

receiveMessageLoop();

module.exports = receiveMessageLoop;