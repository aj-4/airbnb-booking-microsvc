var models = require('./indexCassandra');

var addView = (viewId, hostId) => {
  var view = new models.instance.viewevent({
    id: models.uuid(),
    view_id: viewId,
    host_id: hostId,
    created: models.timeuuid()
  });
  view.saveAsync()
    .then(function () {
      console.log('Event Saved!');
    })
    .catch(function (err) {
      console.log(err);
    });
};

module.exports = addView;
