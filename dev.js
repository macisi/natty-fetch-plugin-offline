let config = require('./webpack.config');
let webpackDevServer = require('webpack-dev-server');
let webpack = require('webpack');
let assign = require('object-assign');

let demoConfig = assign(config, {
  entry: {
    demo: './demo/demo'
  },
  output: {
    path: __dirname + 'demo',
    filename: 'demo.js'
  },
  resolve: {
    alias: {
      'natty-fetch': 'natty-fetch/dist/natty-fetch',
      'localforage': 'localforage/dist/localforage',
    },
  },
  externals: {},
  devtool: 'eval-source-map',
});

let compiler = webpack(demoConfig);
let server = new webpackDevServer(compiler, {
  contentBase: './demo',
});

server.listen(8080);