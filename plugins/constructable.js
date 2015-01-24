import _ from 'lodash'

export default constructable

function constructable(constructor) {
  if (!constructor) return _.noop;
  return function (Component) {
    Component.prototype.initialState.callBefore(function () {
      constructor.apply(this, arguments);
    });
  };
}
