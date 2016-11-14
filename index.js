
// much λ, much UX.
module.exports = function λ(fn) {
  return function(e, ctx, cb) {
    // Process do finish when cb is invoked
    ctx.callbackWaitsForEmptyEventLoop = false

    try {
      var v = fn(e, ctx, cb)

      if (v && typeof v.then == 'function') {
        v.then(function (val) {
            cb(null, val)
        }).catch(cb)
        return
      }

      cb(null, v)
    } catch (err) {
      cb(err)
    }
  }
}
