import _ from 'lodash'

export default multipleHandlers

const HANDLER_NAMES = [
  'initialState',
  'propsChanged',
  'beforeMount',
  'afterMount',
  'beforeUpdate',
  'afterUpdate',
  'beforeUnmount',
  'afterUnmount'
]

function multipleHandlers(Component) {
  Component._handlers = {};
  Component.addHandler = function (name, fn, capturing) {
    var handlers = Component._handlers[name] || (Component._handlers[name] = [])
    handlers[capturing ? 'unshift' : 'push'](fn)
  }

  HANDLER_NAMES.forEach((handler) => {
    if (!_.has(Component.prototype, handler)) return

    Component.addHandler(handler, Component.prototype[handler])
    delete Component.prototype[handler]
  })

  function dispatchGetter(name) {
    function dispatch() {
      var handlers = Component._handlers[name]
      if (!handlers) return

      var ret;
      for (let fn of handlers) {
        ret = fn.apply(this, arguments);
      }
      return ret;
    }

    dispatch.callBefore = function (fn) {
      Component.addHandler(name, fn, true);
    };

    dispatch.call = function (fn) {
      Component.addHandler(name, fn, true);
    };

    return function () {
      return dispatch;
    };
  }

  HANDLER_NAMES.forEach((name) => {
    Object.defineProperty(Component.prototype, name, {
      get: dispatchGetter(name),
      set: function (fn) {
        Component.addHandler(name, fn);
      }
    })
  })
}
