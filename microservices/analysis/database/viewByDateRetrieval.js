var models = require('./iCassandraView');

const getViewsByDate = (dateString) => {
    return new Promise((resolve, reject) => {
        models.instance.vieweventdate.find({ date: dateString }, (err, records) => {
            if (err) {
                reject(err);
            } else {
                resolve(records);
            }
        });
    })
}

module.exports = getViewsByDate;