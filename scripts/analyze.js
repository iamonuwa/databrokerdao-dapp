process.env.BABEL_ENV = 'production';
process.env.NDOE_ENV = 'production';

process.on('unhandledRejection', (err) => {
    throw err
});

require('../config/env');
const bundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpackConfigProd = require('../config/webpack.config.prod');

webpackConfigProd
    .plugins
    .push(new BundleAnalyzer())

require('./build');