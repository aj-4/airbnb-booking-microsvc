var models = require('./indexCassandra');

var addBooking = async (hostId, listingId, date) => {
  let promises = [];
  let uuid = models.uuid();
  promises.push(new models.instance.bookevent({
    booking_id: uuid,
    host_id: hostId,
    listing_id: listingId,
    date: date ? Date(date).slice(4, 15) : Date().slice(4, 15),
    time: date ? new Date(date) : new Date()
  }).saveAsync());
  promises.push(new models.instance.bookeventdate({
    booking_id: uuid,
    host_id: hostId,
    listing_id: listingId,
    date: date ? Date(date).slice(4, 15) : Date().slice(4, 15),
    time: date ? new Date(date) : new Date()
  }).saveAsync());

  return Promise.all(promises);
};

module.exports = addBooking;