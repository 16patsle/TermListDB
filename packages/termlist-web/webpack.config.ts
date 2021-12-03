/* eslint-env node */
import ci from 'ci-info'
import path from 'path'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// @ts-expect-error Has no declaration file
import { RelativeCiAgentWebpackPlugin } from '@relative-ci/agent'
import { VueLoaderPlugin } from 'vue-loader'
import { config as configureDotenv } from 'dotenv'
configureDotenv()

const devMode = process.env.NODE_ENV !== 'production'

const config: webpack.Configuration = {
  entry: './src/main.ts',
  mode: !devMode ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  target: 'browserslist',
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        vue: {
          test: /[\\/]node_modules[\\/]@vue[\\/]/,
          name: 'vue',
          chunks: 'all',
        },
        firebaseInitial: {
          test: /[\\/]node_modules[\\/]@?firebase[\\/]/,
          name: 'firebase-initial',
          chunks: 'initial',
        },
        firebaseAsync: {
          test: /[\\/]node_modules[\\/]@?firebase[\\/]/,
          name: 'firebase-async',
          chunks: 'async',
        },
      },
    },
  },
  cache: {
    type: 'filesystem',
    // This makes all dependencies of this file - build dependencies
    buildDependencies: {
      config: [__filename],
      browserslist: ['./.browserslistrc'],
      babelrc: ['./.babelrc'],
    },
    version: 'v1',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(j|t)s$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
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
  ]
    .concat(devMode ? [] : [new MiniCssExtractPlugin()])
    .concat(ci.isCI ? [] : [new webpack.ProgressPlugin()]),
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

export default config
