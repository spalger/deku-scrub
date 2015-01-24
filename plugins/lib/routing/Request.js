import {parseHash} from './parse'

class Request {
  constructor(h) {
    var {hash, path} = parseHash(h)

    this.hash = hash
    this.path = path
  }

  // called when the router refuses to process this request
  abandoned() {
    throw new Error('request for ' + this.hash + ' ABANDONED')
  }

  // called when the does not know how to process this request
  unhandled() {
    throw new Error('request for ' + this.hash + ' UNHANDLED')
  }
}

export default Request
