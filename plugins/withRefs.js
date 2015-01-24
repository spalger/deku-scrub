import _ from 'lodash'
import {search} from './lib/DomTraversal.js'

export const PARENT_EL_SYM = Symbol('el')

export default withRefs

function withRefs(Component) {
  Component.addHandler('afterMount', function (el) {
    this[PARENT_EL_SYM] = el
  }, true)

  function factory(all) {
    return function (ref, prop) {
      var parent = this[PARENT_EL_SYM]
      var els = search(parent, ref, all)
      if (!prop) return all ? _.toArray(els) : els
      if (all) return _.pluck(els, prop);

      if (!els) return;
      if (_.isFunction(prop)) return prop(els);
      if (_.isArray(prop)) return _.pick(els, prop);
      return els[prop];
    }
  }

  Component.prototype.ref = factory(false)
  Component.prototype.refs = factory(true)
}
