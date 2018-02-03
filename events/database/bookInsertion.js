var models = require('./indexCassandra');

var addBooking = (bookingId, hostId, time) => {
  return new models.instance.bookevent({
    booking_id: bookingId,
    host_id: hostId,
    created: time
  })
};

module.exports = addBooking;