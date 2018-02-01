var models = require('./indexCassandra');

var addBooking = (bookingId, hostId) => {
  return new models.instance.bookevent({
    id: models.uuid(),
    booking_id: bookingId,
    host_id: hostId,
    created: models.timeuuid()
  })
};

module.exports = addBooking;