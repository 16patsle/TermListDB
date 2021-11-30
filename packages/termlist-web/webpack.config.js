/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { RelativeCiAgentWebpackPlugin } = require('@relative-ci/agent')
const { VueLoaderPlugin } = require('vue-loader')
require('dotenv').config()

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: './src/main.ts',
  mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(j|t)s$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode
            ? 'style-loader' // creates style nodes from JS strings
            : MiniCssExtractPlugin.loader, // extracts CSS to files
          'css-loader', // translates CSS into JS modules
          'sass-loader', // compiles Sass to CSS
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml',
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.EnvironmentPlugin([
      'FIREBASE_API_KEY',
      'FIREBASE_AUTH_DOMAIN',
      'FIREBASE_PROJECT_ID',
    ]),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(false),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    }),
    new HtmlWebpackPlugin({
      title: 'termlist',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: !devMode ? 'static' : 'server',
      openAnalyzer: false,
      defaultSizes: 'stat',
    }),
    new RelativeCiAgentWebpackPlugin(),
  ].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
  },
  performance: {
    hints: false,
  },
  devtool: devMode ? 'eval-source-map' : 'source-map', // http://vue-loader.vuejs.org/en/workflow/production.html
}
