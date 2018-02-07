const newrelic = require('newrelic');

//Express Config
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

//DB helper functions
const db = require('../database/index');

//Queue helper functions
// const sqs = require('./sqs/queues');
const sendViewMsg = require('./sqs/view_queue/sqs_sendmessage');

//Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

const PORT = 3000;

app.get('/', (req, res) => res.send('Event Handler'));

//import worker processes 

//sample message queue add - replace with workers
// app.post('/pageview', async(req, res) => {
//   // setTimeout(function () { res.status(500).send(); }, 150);
//   if (req.body.listingId && req.body.hostId) {
//     sendViewMsg(req.body.hostId, req.body.listingId);
//     // await db.addView(req.body.hostId, req.body.listingId).saveAsync();
//     res.status(200).send('Inserted');
//   } else {
//     res.status(400).send('Send to queue failed');
//   }
// });

//not using http anymore

// app.post('/booking', async(req, res) => {
//   let sent = false;
//   //rejects long requests to increase latency + throughput
//   setTimeout(function () { 
//     if (!sent) {
//       sent = true;
//       res.status(500).send(); 
//     }
//   }, 150);
//   //parameter check
//   if (req.body.listingId && req.body.hostId) {
//     try {
//       let booking = await db.addBook(req.body.hostId, req.body.listingId);
//       if (!sent) {
//         await booking.saveAsync()
//       }
//       if (!sent) {
//         sent = true;
//         res.status(202).send('Inserted');
//       }
//     } catch(error) {
//       console.log('request timeout');
//     }
//   } else {
//     res.status(400).send('Missing Params');
//   }
// });


//** refactor to get by HOST_ID + DATE */
app.get('/booking/:hostId', async(req, res) => {
  if (req.body.hostId || req.params.hostId) {
    const hostId = req.body.hostId || req.params.hostId;
    const data = await db.getBook(hostId);
    res.status(200).send(data);
  } else {
    res.status(404).send('not found');
  }
});

app.listen(PORT, () => console.log(`Events Service listening on ${PORT} 👂 `));

module.exports = app;