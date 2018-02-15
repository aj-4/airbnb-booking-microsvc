var send = require('./sqs_sendmessage');

// var counter = 0;

// for (let i = 0; i < 50000; i++) {
//     send(
//         String(Math.floor(Math.random() * 10000)), 
//         String(Math.floor(Math.random() * 10000))
//     );
// }

// //infinity testing
setInterval(e => {
    send(
        String(Math.floor(Math.random() * 10000)), 
        //host id
        String(Math.floor(Math.random() * 10000)))
    
    }, 
        //interval
        0
);