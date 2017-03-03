function replaceErrors(key, value) {
  if (value instanceof Error) {
    var error = {};

    Object.getOwnPropertyNames(value).forEach(function (key) {
      error[key] = value[key];
    });

    return error;
  }

  return value;
}

function logError(err) {
  console.log('Error catch', JSON.stringify(err, replaceErrors))
}

// much λ, much UX.
module.exports = function λ(fn) {
  return function(e, ctx, cb) {
    // Force process to finish when cb is invoked
    ctx.callbackWaitsForEmptyEventLoop = false

    try {
      var v = fn(e, ctx, cb)

      if (v && typeof v.then == 'function') {
        v.then(function (val) {
          cb(null, val)
        }).catch(function (err) {
          logError(err)
          cb(err)
        })
        return
      }

      cb(null, v)
    } catch (err) {
      logError(err)
      cb(err)
    }
  }
}
