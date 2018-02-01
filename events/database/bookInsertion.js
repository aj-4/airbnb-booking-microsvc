var models = require('./indexCassandra');

var addBooking = (bookingId, hostId) => {
  var booking = new models.instance.bookevent({
    id: models.uuid(),
    booking_id: bookingId,
    host_id: hostId,
    created: models.timeuuid()
  });
  booking.saveAsync()
    .then(function () {
      console.log('Event Saved!');
    })
    .catch(function (err) {
      console.log(err);
    });
};

module.exports = addBooking;