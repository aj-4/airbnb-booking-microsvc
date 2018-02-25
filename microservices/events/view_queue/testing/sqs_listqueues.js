var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1' });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var params = {};

module.exports = () => {
  return new Promise((resolve, reject) => {
    sqs.listQueues(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (process.env.NODE_ENV !== 'test') {
          console.log('Success', data.QueueUrls);          
        }
        resolve(data.QueueUrls);
      }
    });
  })
}