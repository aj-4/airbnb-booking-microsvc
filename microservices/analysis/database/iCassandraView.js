var ExpressCassandra = require('express-cassandra');
const CASSANDRA_VIEW_IP = process.env.CASSANDRA_VIEW_IP || '127.0.0.2';

var models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: [CASSANDRA_VIEW_IP],
    protocolOptions: { port: 9042 },
    keyspace: 'events',
    queryOptions: { consistency: ExpressCassandra.consistencies.one }
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: 'NetworkTopologyStrategy',
      datacenter1: 2
    },
    migration: 'safe',
  }
});

var ViewEvent = models.loadSchema('viewevent', {
  fields: {
    view_id: 'uuid',
    host_id: 'text',
    listing_id: 'text',
    date: 'text',
    time: 'timestamp',
  },
  key: [['host_id', 'date'], 'time'],
  clustering_order: { "time": "desc" }
});

var BookEvent = models.loadSchema('bookevent', {
  fields: {
    booking_id: 'uuid',
    host_id: 'text',
    listing_id: 'text',
    date: 'text',
    time: 'timestamp',
  },
  // query changes to get bookings by host by day
  // enter DATE as simple 2000-01-01 string
  key: [['host_id', 'date'], 'time'],
  clustering_order: { "time": "desc" }
});

var BookEventByDate = models.loadSchema('bookeventdate', {
  fields: {
    booking_id: 'uuid',
    host_id: 'text',
    listing_id: 'text',
    date: 'text',
    time: 'timestamp',
  },
  // query changes to get bookings by host by day
  // enter DATE as simple 2000-01-01 string
  key: [['date'], 'time'],
  clustering_order: { "time": "desc" }
});

var ViewEventByDate = models.loadSchema('vieweventdate', {
  fields: {
    view_id: 'uuid',
    host_id: 'text',
    listing_id: 'text',
    date: 'text',
    time: 'timestamp',
  },
  // query changes to get bookings by host by day
  // enter DATE as simple 2000-01-01 string
  key: [['date'], 'time'],
  clustering_order: { "time": "desc" }
});

// key: [['host_id'], 'booking_id', 'created'],

BookEvent.syncDB(function (err, result) {
  if (err) { throw err; }
  // result == true if any database schema was updated
  // result == false if no schema change was detected in your models
});

ViewEvent.syncDB(function (err, result) {
  if (err) { throw err; }
  // result == true if any database schema was updated
  // result == false if no schema change was detected in your models
});

BookEventByDate.syncDB(function (err, result) {
  if (err) { throw err; }  
})

ViewEventByDate.syncDB(function (err, result) {
  if (err) { throw err; }  
})

module.exports = models;