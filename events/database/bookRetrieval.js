var models = require('./indexCassandra');

var getBookings = (hostId, dateString) => {
    return new Promise(function(resolve, reject) {
        models.instance.bookevent.find({ host_id: hostId, date: dateString }, function (err, records) {
            if (err) {
                reject(err);
            } else {
                resolve(records);                
            }
        });
    }) 
};

module.exports = getBookings;