const path = require('path');
const fs = require('fs');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const isProduction = process.env.NODE_ENV === 'production';

function resolve(dir) {
  if (fs.existsSync(path.join(__dirname, '..', dir))) {
    return path.join(__dirname, '..', dir);
  }
  return '';
}

module.exports = {
  entry: {
    app: ['@babel/polyfill', './src/main.js'],
  },
  resolve: {
    modules: [
      resolve('src/core'),
      'node_modules',
    ],
    extensions: ['.js', '.json', '.vue', '.less', '.css'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      assets: resolve('src/assets'),
      components: resolve('src/components'),
      core: resolve('src/core'),
      style: resolve('src/style'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true,
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        include: [resolve('src')],
        loader: 'babel-loader',
      },
      {
        test: /\.(le|c)ss$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[local]_[hash:base64:8]',
                  },
                },
              },
              'postcss-loader',
              'less-loader',
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: [resolve('src/style/utils.less')],
                },
              },
            ],
          },
          {
            use: [
              isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
              'css-loader',
              'postcss-loader',
              'less-loader',
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: [resolve('src/style/utils.less')],
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'img/[name].[hash:7].[ext]',
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'media/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'fonts/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('src/index.html'),
      favicon: resolve('src/favicon.ico'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode: 'auto',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash].css',
      chunkFilename: 'css/[id].[chunkhash].css',
    }),
    new CopyWebpackPlugin([
      {
        from: resolve('src/static'),
        to: 'static',
        ignore: ['.*'],
      },
      {
        from: resolve('projectConfig.js') || resolve('projectConfig/index.js'),
        to: './projectConfig.js',
      },
    ]),
    new HtmlWebpackTagsPlugin({
      tags: [
        {
          path: 'projectConfig.js',
        },
      ],
      append: false,
    }),
  ],
  externals: {
    $projectConfig: '$projectConfig',
  },
};
