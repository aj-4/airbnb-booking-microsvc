var models = require('./indexCassandra');

const getViewsByDate = (hostId, dateString) => {
    return new Promise((resolve, reject) => {
        models.instance.bookevent.find({ host_id: hostId, date: dateString, $limit: 10 }, (err, records) => {
            if (err) {
                reject(err);
            } else {
                resolve(records);
            }
        });
    })
}

module.exports = getViewsByDate;