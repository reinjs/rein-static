const Mount = require('koa-mount');
const Static = require('./static');
const path = require('path');
const Convert = require('koa-convert');
module.exports = async (app, plugin) => {
  if (!plugin.config) plugin.config = {};
  const configs = !Array.isArray(plugin.config) ? [plugin.config] : plugin.config;
  
  app.routing(() => {
    configs.forEach(config => {
      const dir = path.resolve(app.config.cwd, config.path);
      const _config = merge(config);
      if (!config.prefix) {
        app.use(Convert(Static(dir, _config)));
      } else {
        app.use(Convert(Mount(config.prefix, Static(dir, _config))));
      }
    })
  });
};

function merge(options) {
  const result = {};
  if (options.maxage) result.maxage = options.maxage;
  if (options.hidden) result.hidden = options.hidden;
  result.index = options.index || 'index.html';
  if (options.defer) result.defer = options.defer;
  if (options.gzip) result.gzip = options.gzip;
  if (options.br) result.br = options.br;
  if (options.extensions) result.extensions = options.extensions;
  if (typeof options.setHeaders === 'function') result.setHeaders = options.setHeaders;
  if (options.historyApiFallback) result.historyApiFallback = options.historyApiFallback;
  return result;
}
