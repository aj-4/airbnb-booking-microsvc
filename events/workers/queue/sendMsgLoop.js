var sendView = require('../../server/view_queue/sqs/sqs_sendmessage');
var sendBook = require('../../server/book_queue/sqs/sqs_sendmessage');

var viewIndex = 0;

setInterval(e => {sendView(++viewIndex, Math.floor(Math.random() * 10000)), 10});