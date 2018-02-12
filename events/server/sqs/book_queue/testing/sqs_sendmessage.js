var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1' });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var params = {};
var counter = 0;

var sendMsg = function (listingId, hostId, cb) {
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
    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/608151570921/bookingQ'
  };
  return sqs.sendMessage(params, (err, data) => {
    if (err) {
      throw new Error('send failed');
    } else {
      if (process.env.NODE_ENV !== 'test') {
        console.log('sent book msg ☄ ', ++counter);
      } else {
        cb(true);
      }
    }
  });
};


module.exports = sendMsg;