const config = require('./webpack.config');
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const assign = require('object-assign');

const demoConfig = assign(config, {
  entry: {
    demo: './demo/demo'
  },
  output: {
    path: __dirname + 'demo',
    filename: 'demo.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /localforage/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
    ]
  },
  resolve: {
    alias: {
      'natty-fetch': 'natty-fetch/dist/natty-fetch',
      'a-storage': 'a-storage/src/index'
    },
  },
  externals: {},
  devtool: 'eval-source-map',
});

const compiler = webpack(demoConfig);
const server = new webpackDevServer(compiler, {
  contentBase: './demo',
});

server.listen(8080);