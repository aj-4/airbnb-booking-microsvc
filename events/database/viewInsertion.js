var models = require('./indexCassandra');

var addView = (viewId, hostId) => {
  return new models.instance.viewevent({
    id: models.uuid(),
    view_id: viewId,
    host_id: hostId,
    created: models.timeuuid()
  });
};

module.exports = addView;