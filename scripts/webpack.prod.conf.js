const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.conf.js');
const config = require('./config');

const webpackConfig = {
  mode: 'production',
  output: {
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[id].[chunkhash].js',
    path: config.build.path,
    publicPath: config.build.publicPath,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new OptimizeCSSAssetsPlugin({}),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
        },
      },
    },
    // minimizer: [
    //   new UglifyJSPlugin({
    //     uglifyOptions: {
    //       output: {
    //         comments: false,
    //       },
    //     },
    //     cache: true,
    //     parallel: true,
    //   }),
    // ],
  },
};

module.exports = merge(baseWebpackConfig, webpackConfig);
