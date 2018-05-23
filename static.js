'use strict'

/**
 * Module dependencies.
 */

const debug = require('debug')('koa-static');
const { resolve } = require('path');
const assert = require('assert');
const send = require('koa-send');

/**
 * Expose `serve()`.
 */

module.exports = serve;

/**
 * Serve static files from `root`.
 *
 * @param {String} root
 * @param {Object} [opts]
 * @return {Function}
 * @api public
 */

function serve (root, opts) {
  opts = Object.assign({}, opts);
  
  assert(root, 'root directory is required to serve files')
  
  // options
  debug('static "%s" %j', root, opts)
  opts.root = resolve(root)
  if (opts.index !== false) opts.index = opts.index || 'index.html'
  
  if (!opts.defer) {
    return async function serve (ctx, next) {
      let done = false
      
      if (ctx.method === 'HEAD' || ctx.method === 'GET') {
        try {
          done = await send(ctx, ctx.path, opts)
        } catch (err) {
          if (err.status === 404 && opts.historyApiFallback) {
            await historyApiFallback(ctx, opts);
          } else if (err.status !== 404) {
            throw err
          }
        }
      }
      
      if (!done) {
        await next()
      }
    }
  }
  
  return async function serve (ctx, next) {
    await next()
    
    if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return
    // response is already handled
    if (ctx.body != null || ctx.status !== 404) return // eslint-disable-line
    
    try {
      await send(ctx, ctx.path, opts)
    } catch (err) {
      if (err.status === 404 && opts.historyApiFallback) {
        await historyApiFallback(ctx, opts);
      } else if (err.status !== 404) {
        throw err
      }
    }
  }
}

/**
 * historyApiFallback support
 * @param ctx
 * @param opts
 * @returns {Promise<void>}
 *
 * @from: 匹配URI的规则
 * @to: 指向到哪个目录的地址 相对地址 相对于URL
 */
async function historyApiFallback(ctx, opts) {
  if (opts.historyApiFallback === true) opts.historyApiFallback = [{ from: /^\/(.+)/, to: '/' }];
  if (!Array.isArray(opts.historyApiFallback)) opts.historyApiFallback = [opts.historyApiFallback];
  for (let i = 0; i < opts.historyApiFallback.length; i++) {
    if (opts.historyApiFallback[i].from.test(ctx.path)) {
      await send(ctx, opts.historyApiFallback[i].to, opts);
    }
  }
}