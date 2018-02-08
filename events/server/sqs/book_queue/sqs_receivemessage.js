//post function
var insertBook = require('../../../database/bookInsertion');

//config
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var queueURL = 'https://sqs.us-west-1.amazonaws.com/608151570921/bookingQ';

const params = {
  AttributeNames: [
    'SentTimestamp'
  ],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
    'All'
  ],
  QueueUrl: queueURL,
  VisibilityTimeout: 60,
  WaitTimeSeconds: 10
};

let counter = 0;

const receiveMessage = (cb) => {
  sqs.receiveMessage(params, async (err, data) => {
    if (err) {
      console.log('error receiving message...')
    } else if (data.Messages) {
      var deleteParams = {
        Entries: [],
        QueueUrl: queueURL
      };
      //array of db promises
      let promises = [];
      data.Messages.forEach((msg, i) => {
        deleteParams.Entries.push({ Id: msg.MessageId, ReceiptHandle: msg.ReceiptHandle });
        promises.push(insertBook(msg.MessageAttributes.HostId.StringValue, msg.MessageAttributes.ListingId.StringValue));
      });
      await Promise.all(promises);
      sqs.deleteMessageBatch(deleteParams, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          cb(data.Messages.length);
        }
      });
    }
  });
}

const receiveMessageLoop = () => {
  sqs.receiveMessage(params, async (err, data) => {
    if (err) {
      console.log('error receiving message...')
    } else if (data.Messages) {
      console.time('process batch')
      var deleteParams = {
        Entries: [],
        QueueUrl: queueURL
      };
      console.log('inserting ✉ ', counter += data.Messages.length);
      //array of db promises
      let dbreqs = [];
      data.Messages.forEach((msg, i) => {
        deleteParams.Entries.push({ Id: msg.MessageId, ReceiptHandle: msg.ReceiptHandle });
        dbreqs.push(insertBook(msg.MessageAttributes.HostId.StringValue, msg.MessageAttributes.ListingId.StringValue));
      });
      await Promise.all(dbreqs);
      console.timeEnd('process batch');
      console.time('delete batch');
      sqs.deleteMessageBatch(deleteParams, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          console.timeEnd('delete batch');
          receiveMessageLoop();
        }
      });
    } else {
      console.log('none found, waiting...');
      receiveMessageLoop();
    }
  });
};

module.exports = {
  receiveMessage,
  receiveMessageLoop
}