var models = require('./indexCassandra');

var addBooking = (hostId, listingId, date) => {
  return new models.instance.bookevent({
    booking_id: models.uuid(),
    host_id: hostId,
    listing_id: listingId,
    date: date ? Date(date).slice(4, 15) : Date().slice(4, 15),
    time: date ? new Date(date) : new Date(),
    superhost: false
  });
};

module.exports = addBooking;