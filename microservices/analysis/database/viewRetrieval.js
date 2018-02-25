var models = require('./iCassandraView');

var getViews = (hostId, dateString) => {
    return new Promise(function (resolve, reject) {
        models.instance.viewevent.find({ host_id: hostId, date: dateString }, function (err, records) {
            if (err) {
                reject(err);
            } else {
                resolve(records);
            }
        });
    })
};

module.exports = getViews;