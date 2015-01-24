import _ from 'lodash'
import pathToReg from 'path-to-regexp'
import {parseHash} from './parse'

/**
 * Object that will be held by a router and consulted
 * about incoming requests
 *
 * @param  {string} path - the path that this handler should match
 * @param  {Function} fn - the handler function that will
 *                       eventually be called
 */
class Route {
  constructor(hash, fn) {
    this.fn = fn;

    if (hash == null) return;

    _.assign(this, parseHash(hash));
    this.keys = [];
    this.regexp = pathToReg(this.path, this.keys);
  }

  try(req, next) {
    var {fn, regexp, keys} = this;

    if (!regexp) {
      fn(req, next);
      return true;
    }

    var match = req.path.match(regexp);
    if (!match) return;

    req.route = this;
    req.params = _.transform(keys, function (vals, key, i) {
      vals[key.name] = match[i + 1];
      if (key.repeat) {
        vals[key.name] = String(vals[key.name]).split(key.delimiter);
      }
    }, {});

    fn(req, next);
    return true;
  }
}

export default Route;
