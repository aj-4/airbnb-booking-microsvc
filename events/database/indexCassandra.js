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
      class: 'SimpleStrategy',
      replication_factor: 1
    },
    migration: 'safe',
  }
});

var ViewEvent = models.loadSchema('viewevent', {
  fields: {
    id: 'uuid',
    view_id: 'text',
    host_id: 'text',
    created: 'timeuuid'
  },
  key: ['id']
});

var BookEvent = models.loadSchema('bookevent', {
  fields: {
    id: 'uuid',
    booking_id: 'text',
    host_id: 'text',
    created: 'timeuuid'
  },
  key: ['id']
});

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