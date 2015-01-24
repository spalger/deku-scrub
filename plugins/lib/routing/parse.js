const HOME_PATH = '/'
const HOME_HASH = '#' + HOME_PATH

export function parseHash(hash) {
  if (!hash) {
    hash = HOME_HASH
  } else {
    let pre = HOME_HASH
    while (pre.length) {
      if (hash[0] === pre[0]) hash = hash.substr(1)
      pre = pre.substr(1)
    }
    hash = HOME_HASH + hash
  }

  var path = hash.substr(HOME_HASH.length) || HOME_PATH
  return {hash, path}
}
