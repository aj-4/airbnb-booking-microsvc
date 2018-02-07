var models = require('./indexCassandra');

var addView = (hostId, listingId, date) => {
  return new models.instance.viewevent({
    view_id: models.uuid(),
    host_id: hostId,
    listing_id: listingId,
    date: date ? Date(date).slice(4, 15) : Date().slice(4, 15),
    time: date ? new Date(date) : new Date(),
    superhost: false
  });
};

module.exports = addView;