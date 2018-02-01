var sendView = require('../server/view_queue/sqs_sendmessage');
var sendBook = require('../server/book_queue/sqs_sendmessage');

setInterval(e => sendView('1', '1'), 1000);