import _ from 'lodash'
import deku from 'deku'

export default asCustomElement

function register(tagName, proto) {
  if (!tagName){
    throw new TypeError('Missing tag name for component');
  }

  try {
    var prototype = Object.create(HTMLElement.prototype, proto.dom)
    document.registerElement(tagName, { prototype })
  } catch (e) {
    console.log('failed to register', tagName)
  }
}

function asCustomElement(Component) {
  var proto = Component.prototype

  register(proto.tagName, proto);

  proto.renderContents = proto.render || _.noop
  proto.render = function render(props, state) {
    return deku.dom(this.tagName, {}, this.renderContents(props, state))
  }
}
