const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function override(config, env) {
    config.plugins.push(new NodePolyfillPlugin());
    return config;
    };