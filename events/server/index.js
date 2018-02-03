const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const bookInsert = require('../database/bookInsertion');
const viewInsert = require('../database/viewInsertion');

//send to queues
const addToBookingQueue = require('./book_queue/sqs_sendmessage');
const addToViewQueue = require('./view_queue/sqs_sendmessage');

const initCassandra = require('../database/indexCassandra');

app.use(bodyParser.json());

const PORT = 3000;

app.get('/', (req, res) => res.send('Event Handler'));

app.post('/pageview', (req, res) => {
  if (req.body.viewId && req.body.hostId) {
    viewInsert(req.body.viewId, req.body.hostId, req.body.time)   
    .saveAsync()
      .then(function () {
        res.status(200).send('Inserted');
      })
      .catch(function () {
        console.log('failed to insert');
      })    
  } else {
    res.status(400).send('Send to queue failed');
  }
});

app.post('/booking', (req, res) => {
  if (req.body.bookId && req.body.hostId) {
    console.log('inserting booking')
    bookInsert(req.body.bookId, req.body.hostId, req.body.time)
    .saveAsync()
      .then(function () {
        res.status(200).send('Inserted');
      })
      .catch(function () {
        console.log('failed to insert');
        res.status(400).send('failed to insert');
      })
  } else {
    res.status(400).send('Missing Params');
  }
});

app.listen(PORT, () => console.log(`Example app listening on ${PORT}`));

module.exports = app;