var models = require('./indexCassandra');

var getBookings = (hostId) => {
    return new Promise(function(resolve, reject) {
        models.instance.bookevent.find({ host_id: hostId, $limit: 10 }, function (err, records) {
            if (err) {
                reject(err);
            } else {
                resolve(records);                
            }
        });
    }) 
};

module.exports = getBookings;