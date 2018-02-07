var send = require('./sqs_sendmessage');

var counter = 0;

setInterval(e => {
    send(
        String(Math.floor(Math.random() * 10000)), 
        //host id
        String(Math.floor(Math.random() * 10000)))}, 
        //interval
        0
);