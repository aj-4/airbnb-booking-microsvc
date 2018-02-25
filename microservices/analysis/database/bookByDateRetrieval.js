var models = require('./iCassandraBooking');

var getBookingsByDate = (dateString) => {
    return new Promise(function (resolve, reject) {
        models.instance.bookeventdate.find({ date: dateString }, function (err, records) {
            if (err) {
                reject(err);
            } else {
                resolve(records);
            }
        });
    })
};

module.exports = getBookingsByDate;