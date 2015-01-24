import _ from 'lodash'
import {dom} from 'deku'

var names = `
  a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption
  cite code col colgroup data datalist dd del details dfn div dl dt em embed fieldset figcaption
  figure footer form h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd keygen label
  legend li link main map mark math menu menuitem meta meter nav noscript object ol optgroup option
  output p param pre progress q rp rt ruby s samp script section select small source span strong
  style sub summary sup svg table tbody td template textarea tfoot th thead time title tr track
  u ul var video wbr
`.split(/\s+/)

var elements = {}
names.forEach(function (name) {
  if (!name) return

  elements[name] = function () {
    var kids = _.flatten(arguments)
    var props = isProps(kids[0]) ? kids.shift() : {}
    return dom(name, props, kids)
  }

  function isProps(kid) {
    // pre req
    if (!_.isPlainObject(kid)) return false;

    // element
    if (_.isString(kid.tagName)) return false;

    // component
    if (_.isFunction(kid.component)) return false;

    // text node
    if (kid.type === 'text' && _.isString(kid.data)) return false;

    return true;
  }
})

export default function (Component) {
  Component.prototype.dom = elements;
}
