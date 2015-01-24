import _ from 'lodash'

var getAttribute = (el, attr) => {
  return el.getAttribute(attr);
}

var {getFirstChild, getNextSibling} = (function () {
  var test = document.createElement('div')
  var findEl = function (el) {
    while (el && el.nodeType !== Node.ELEMENT_NODE) el = el.nextSibling;
    return el;
  }

  if (_.has(test, 'firstElementChild') && _.has(test, 'nextElementSibling')) {
    return {
      getFirstChild (el) { return el.firstElementChild },
      getNextSibling (el) { return el.nextElementSibling }
    }
  }

  if (_.has(test, 'firstChild') && _.has(test, 'nextSibling')) {
    return {
      getFirstChild (el) { return findEl(el.firstChild); },
      getNextSibling (el) { return findEl(el); }
    }
  }

  throw new Error('unable to find sufficient methods for DOM Traversal');
}())

/**
 * search the tree, in order, with a quick escape
 * if we are only interested in a single element.
 *
 * prevent searching branches that are owned by a
 * sub component
 */
export function search(root, ref, all, entityId) {
  if (!all) all = undefined
  else if (!_.isArray(all)) all = [];

  if (entityId == null) entityId = root.__entity__;

  let el = getFirstChild(root)
  do {
    if (!el || el.__entity__ !== entityId) {
      // don't search other components
      continue
    }

    if (getAttribute(el, 'ref') === ref) {
      if (all) all.push(el)
      else return el
    }

    let desc = getFirstChild(el)
    if (desc) {
      var match = search(el, ref, all, entityId);
      if (!all && match) return match;
    }
  } while ((el = getNextSibling(el)))

  return all;
}
