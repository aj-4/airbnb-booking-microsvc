var models = require('./indexCassandra');

var addView = (viewId, hostId, time) => {
  return new models.instance.viewevent({
    view_id: viewId,
    host_id: hostId,
    created: time
  });
};

module.exports = addView;