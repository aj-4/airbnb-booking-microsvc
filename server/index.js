var nr = require('newrelic');
const initCassandra = require('../database/indexCassandra');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const bookInsert = require('../database/bookInsertion');
const viewInsert = require('../database/viewInsertion');

app.use(bodyParser.json());

const PORT = 3000;

app.get('/', (req, res) => res.send('Event Handler'));

app.post('/pageview', (req, res) => {
  if (req.body.viewId && req.body.hostId) {
    viewInsert(req.body.viewId, req.body.hostId);    
    res.status(200).send('Page viewed');    
  } else {
    res.status(400).send('Query failed');
  }
});

app.post('/booking', (req, res) => {
  if (req.body.bookId && req.body.hostId) {
    console.log('book insert is ', bookInsert);
    console.log('viewId: ', req.body.viewId, 'hostId: ', req.body.hostId);
    bookInsert(req.body.bookId, req.body.hostId);
    res.status(200).send('Page booked');
  } else {
    console.log('book insert is ', bookInsert);
    console.log('viewId is ', req.body.bookId, 'hostId is ', req.body.hostId);
    res.status(400).send('Query failed');
  }
});

app.listen(PORT, () => console.log(`Example app listening on ${PORT}`));

module.exports = app;
