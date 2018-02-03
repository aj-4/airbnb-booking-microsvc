const newrelic = require('newrelic');

//Express Config
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

//DB helper functions
const db = require('../database/index');

//Queue helper functions
const sqs = require('./sqs/queues');

//Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

const PORT = 3000;

app.get('/', (req, res) => res.send('Event Handler'));

app.post('/pageview', async(req, res) => {
  if (req.body.viewId && req.body.hostId) {
    await db.addView(req.body.viewId, req.body.hostId, req.body.time).saveAsync();
    res.status(200).send('Inserted');
  } else {
    res.status(400).send('Send to queue failed');
  }
});

app.post('/booking', async(req, res) => {
  if (req.body.bookId && req.body.hostId) {
    await db.addBook(req.body.bookId, req.body.hostId, req.body.time).saveAsync();
    res.status(200).send('Inserted');
  } else {
    res.status(400).send('Missing Params');
  }
});

app.get('/booking/:hostId', async(req, res) => {
  if (req.body.hostId || req.params.hostId) {
    const hostId = req.body.hostId || req.params.hostId;
    const data = await db.getBook(hostId);
    res.status(200).send(data);
  } else {
    res.status(404).send('not found');
  }
});

app.listen(PORT, () => console.log(`Events Service listening on ${PORT}`));

module.exports = app;