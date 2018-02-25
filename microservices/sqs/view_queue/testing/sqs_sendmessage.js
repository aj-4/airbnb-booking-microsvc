const API_KEY = require('../../hg_api');

var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1' });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

//track stats
const statsD = require('node-statsd');
const statsDClient = new statsD({
  host: 'statsd.hostedgraphite.com',
  port: 8125,
  prefix: API_KEY
});

var params = {};
var counter = 0;

var sendMsg = function(listingId, hostId, cb) {
  let begin = Date.now();
  var params = {
    DelaySeconds: 0,
    MessageAttributes: {
      'ListingId': {
        DataType: 'String',
        StringValue: listingId
      },
      'HostId': {
        DataType: 'String',
        StringValue: hostId
      }
    },
    MessageBody: 'View',
    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/608151570921/viewQ'
  };
  return sqs.sendMessage(params, (err, data) => {
    if (err) {
      throw new Error('send failed');
    } else {
      if (process.env.NODE_ENV !== 'test') {
        console.log('sent view msg ☄ ', ++counter);  
        statsDClient.increment('.q.view.send.throughput', 1, 0.1);
        statsDClient.timing('.q.view.send.latency', Date.now() - begin, 0.1);
      } else {
        cb(true);        
      }
    }
  });
};


module.exports = sendMsg;