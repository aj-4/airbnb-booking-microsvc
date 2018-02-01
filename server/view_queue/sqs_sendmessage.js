var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1' });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var params = {};

var sendMsg = function(viewId, hostId) {
  var params = {
    DelaySeconds: 1,
    MessageAttributes: {
      'ViewId': {
        DataType: 'String',
        StringValue: viewId
      },
      'HostId': {
        DataType: 'String',
        StringValue: hostId
      }
    },
    MessageBody: 'View',
    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/608151570921/viewQ'
  };
  sqs.sendMessage(params, function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Added to Queue, Id: ', data.MessageId);
    }
  });
};

module.exports = sendMsg;
