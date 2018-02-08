const receiveViews = require('./view_queue/sqs_receivemessage');

receiveViews.receiveMessageLoop();