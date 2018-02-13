var models = require('./indexCassandra');
const PRIVATE_IP = process.env.PRIVATE_IP || '127.0.0.1';

var addView = async (hostId, listingId, date) => {
  // return new models.instance.vieweventdate({
  //   view_id: models.uuid(),
  //   host_id: hostId,
  //   listing_id: listingId,
  //   date: date ? Date(date).slice(4, 15) : Date().slice(4, 15),
  //   time: date ? new Date(date) : new Date()
  // }).saveAsync()
  let promiseArr = [];
  let uuid = models.uuid();
  promiseArr.push(new models.instance.vieweventdate({
    view_id: uuid,
    host_id: hostId,
    listing_id: listingId,
    date: date ? Date(date).slice(4, 15) : Date().slice(4, 15),
    time: date ? new Date(date) : new Date()
  }).saveAsync());
  promiseArr.push(new models.instance.viewevent({
    view_id: uuid,
    host_id: hostId,
    listing_id: listingId,
    date: date ? Date(date).slice(4, 15) : Date().slice(4, 15),
    time: date ? new Date(date) : new Date()
  }).saveAsync());

  return Promise.all(promiseArr);
};

module.exports = addView;