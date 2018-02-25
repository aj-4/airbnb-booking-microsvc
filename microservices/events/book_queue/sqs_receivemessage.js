const API_KEY = require('./hg_api');
const cassandra = require('./db/indexCassandra');
const insertBook = require('./db/bookInsertion');

//track stats
const statsD = require('node-statsd');
const statsDClient = new statsD({
  host: 'statsd.hostedgraphite.com',
  port: 8125,
  prefix: API_KEY
});

//config
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-1'
});
const sqs = new AWS.SQS({
  apiVersion: '2012-11-05'
});

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
        deleteParams.Entries.push({
          Id: msg.MessageId,
          ReceiptHandle: msg.ReceiptHandle
        });
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
  let totalLatencyBegin = Date.now();
  sqs.receiveMessage(params, async (err, data) => {
    if (err) {
      console.log('error receiving message...')
    } else if (data.Messages) {
      statsDClient.timing('.q.book.latency.sqspull', Date.now() - totalLatencyBegin, 0.25);
      let batchLatencyBegin = Date.now();
      var deleteParams = {
        Entries: [],
        QueueUrl: queueURL
      };
      console.log('inserting ✉ ', counter += data.Messages.length);
      //array of db promises
      let dbreqs = [];
      data.Messages.forEach((msg, i) => {
        deleteParams.Entries.push({
          Id: msg.MessageId,
          ReceiptHandle: msg.ReceiptHandle
        });
        dbreqs.push(insertBook(msg.MessageAttributes.HostId.StringValue, msg.MessageAttributes.ListingId.StringValue));
      });
      await Promise.all(dbreqs);
      statsDClient.increment('.q.book.throughput', dbreqs.length, 0.25);
      statsDClient.timing('.q.book.latency.batch', Date.now() - batchLatencyBegin, 0.25);
      let deleteLatencyBegin = Date.now();
      sqs.deleteMessageBatch(deleteParams, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          statsDClient.timing('.q.book.latency.delete', Date.now() - deleteLatencyBegin, 0.25);
          statsDClient.timing('.q.book.latency.total', Date.now() - totalLatencyBegin, 0.25);
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