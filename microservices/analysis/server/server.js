//Express Config
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

//DB helper functions
const db = require('../database/index');

//Queue helper functions
// const sqs = require('./sqs/queues');
// const sendViewMsg = require('./sqs/view_queue/sqs_sendmessage');

//Postgres
const pg = require('../database/pg/superhosts')

//Redis cache
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const redisCl = redis.createClient(REDIS_PORT);

//Middleware
app.use(bodyParser.json());
//hide logs in test mode
// if (process.env.NODE_ENV !== 'test') {
//     app.use(morgan('dev'));    
// }

app.get('/', (req, res) => res.send('Conversion Analysis'));

//sample message queue add - replace with workers
app.post('/pageview', async(req, res) => {
  if (req.body.listingId && req.body.hostId) {
    sendViewMsg(req.body.hostId, req.body.listingId);
    res.status(202).send('Inserted');
  } else {
    res.status(400).send('Send to queue failed');
  }
});

//get all view data per date 
app.get('/allviews/:date', async (req, res) => {
    if (req.params.date) {
        let results = await db.getViewByDate(req.params.date);
        res.status(200).send(results);
    } else {
        res.status(404).send('Not Found')
    }
})

//get all booking data per date 
app.get('/allbookings/:date', async (req, res) => {
    if (req.params.date) {
        let results = await db.getBookByDate(req.params.date);
        res.status(200).send(results);
    } else {
        res.status(404).send('Not Found')
    }
})

//get event data by host + date
app.get('/view/:hostId/:date', async (req, res) => {
    if (req.params.hostId && req.params.date) {
        let results = await db.getView(String(req.params.hostId), String(req.params.date))
        res.status(200).send(results);
    } else {
        res.status(404).send('Not found');
    }
});

app.get('/booking/:hostId/:date', async (req, res) => {
    if (req.params.hostId && req.params.date) {
        let results = await db.getBook(String(req.params.hostId), String(req.params.date))
        res.status(200).send(results);
    } else {
        res.status(404).send('Not found');
    }
});

//cache for read slave
const cache = (req, res, next) => {
    const hostId = req.params.hostId;
    redisCl.get(hostId, (err, data) => {
        if (err) throw err;
        if (data != null) {
            res.status(200).send(data);
        } else {
            next();
        }
    });
}

//read superhost date from slave
app.get('/superhost/:hostId', cache, async(req, res) => {
    if (req.params.hostId) {
        //get DATE postgres for HOSTID
        try {
            const fromDb = await pg.getShDate(req.params.hostId);
            if (fromDb) {
                redisCl.set(fromDb.rows[0].host_id, fromDb.rows[0].date);
                res.status(200).send(fromDb.rows[0].date);
            } else {
                res.status(404).send();
            }
        } catch(err) {
            res.status(404).send(err);
        }
    }
})

module.exports = app;