var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1' });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var params = {};

var sendMsg = function(bookingId, hostId) {
  var params = {
    DelaySeconds: 1,
    MessageAttributes: {
      'BookingId': {
        DataType: 'String',
        StringValue: bookingId
      },
      'HostId': {
        DataType: 'String',
        StringValue: hostId
      }
    },
    MessageBody: 'Booking',
    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/608151570921/bookingQ'
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
