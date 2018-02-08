var models = require('./indexCassandra');

var addView = async (hostId, listingId, date) => {
  let promiseArr = [];
  let uuid = models.uuid();
  promiseArr.push(new models.instance.vieweventdate({
    booking_id: uuid,
    host_id: hostId,
    listing_id: listingId,
    date: date ? Date(date).slice(4, 15) : Date().slice(4, 15),
    time: date ? new Date(date) : new Date()
  }).saveAsync());
  promiseArr.push(new models.instance.viewevent({
    booking_id: uuid,
    host_id: hostId,
    listing_id: listingId,
    date: date ? Date(date).slice(4, 15) : Date().slice(4, 15),
    time: date ? new Date(date) : new Date()
  }).saveAsync());

  return Promise.all(promiseArr);
};

module.exports = addView;