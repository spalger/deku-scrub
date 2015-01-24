import _ from 'lodash'

import Route from './Route'
import Request from './Request'

class Router {
  constructor(container) {
    this.container = container
    this.routes = []
    this.fallback = []
  }

  /**
   * Setup a handler(s) for a path
   *
   * @param  {string} path - the path to attach to
   * @param  {...function|Component} - any number of middleware elements to process for this route
   */
  on(path, ...fns) {
    this._makeRoutes(this.routes, path, fns)
  }


  /**
   * Setup a 404/not found handler(s)
   *
   * @param  {...function|Component} - any number of middleware elements to process for this route
   */
  otherwise(...fns) {
    this._makeRoutes(this.fallback, null, fns)
  }

  /**
   * start listening for hash changes and
   * dispatch the first route
   *
   * @return {undefined}
   */
  start() {
    window.addEventListener('hashchange', ()=> {
      this.route(window.location.hash)
    })

    return this.route(window.location.hash)
  }

  /**
   * Route to a specific hash value
   *
   * @param  {string} hash - probably window.location.hash
   * @return {undefined}
   */
  route(hash) {
    var req = this.req = new Request(hash)

    if (req.hash !== window.location.hash) {
      window.location.hash = req.hash
      req.abandoned()
      return req
    }

    this._dispatch(req, this.routes, this.fallback)

    return req
  }

  /**
   * Flumbing for .on() and .otherwise()
   *
   * @param {array} where - array to add routes to
   * @param {string|null} path - the path for these routes, or null
   * @param {array} fns - the routes to add
   */
  _makeRoutes(where, path, fns) {
    var q = fns.slice(0)

    while(q.length) {
      let fn = q.shift()
      if (!fn) continue

      if (_.isArray(fn)) {
        q = q.concat(fn)
        break
      }

      if (_.isFunction(fn.render)) {
        fn = this._wrapView(fn);
      }

      where.push(new Route(path, fn))
    }
  }

  _wrapView(View) {
    return (req) => {
      req.View = View;
      this.container.setState({ req });
    }
  }

  /**
   * Send a req to the routes that accept it.
   *
   * @param  {Route} req -
   * @param  {[type]} routes  [description]
   * @param  {[type]} fallback [description]
   * @return {[type]}           [description]
   */
  _dispatch(req, ...routeSets) {
    var q = _.flatten(routeSets)

    var next = () => {
      if (req !== this.req) {
        req.abandoned()
        return
      }

      if (!q.length) {
        req.unhandled()
        return
      }

      if (q.shift().try(req, next)) {
        // fork the req object to keep history via prototype chain
        req = this.req = Object.create(req)
      } else {
        setImmediate(next)
      }
    }

    setImmediate(next)
  }
}

export default Router
