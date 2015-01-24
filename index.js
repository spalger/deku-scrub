import _ from 'lodash'
import deku from 'deku'

import multipleHandlers from './plugins/multipleHandlers'
import constructable from './plugins/constructable'
import asCustomElement from './plugins/asCustomElement'
import withRefs from './plugins/withRefs'
import dom from './plugins/dom'

export default scrub

function scrub(spec) {
  var DekuComponent = deku.component(_.omit(spec, 'constructor'))

  /**
   * custom plugins
   */

  // allow registering multiple handlers for initialState, beforeMount, etc.
  DekuComponent.use(multipleHandlers)

  // call the constructor before initialState
  DekuComponent.use(constructable(spec.constructor))

  // create a customElement for each scrub with a tagName
  DekuComponent.use(asCustomElement)

  // provide access to sub-elements
  DekuComponent.use(withRefs)

  // helpers for dom elements
  DekuComponent.use(dom)

  return DekuComponent
}

scrub.el = deku.dom
scrub.dom = dom

var use = deku.component().use;
scrub.is = function (any) {
  return (any && any.use === use);
}
