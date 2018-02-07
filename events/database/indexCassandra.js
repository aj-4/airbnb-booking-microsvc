var ExpressCassandra = require('express-cassandra');

var models = ExpressCassandra.createClient({
  clientOptions: {
    // contactPoints: ['172.18.0.2'],
    contactPoints: ['127.0.0.1'],
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
    superhost: 'boolean'
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
    superhost: 'boolean'
  },
  // query changes to get bookings by host by day
  // enter DATE as simple 2000-01-01 string
  key: [['host_id', 'date'], 'time'],
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

module.exports = models;