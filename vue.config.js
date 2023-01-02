const merge = require('deepmerge');

module.exports = {
    chainWebpack: (config) => {
      config.resolve.alias.set('vue', '@vue/compat');

      config.module
        .rule('vue')
        .use('vue-loader')
        .tap((options) => merge(options, {
          loaders: {
            i18n: '@kazupon/vue-i18n-loader'
          }
        }));
      }
  };

