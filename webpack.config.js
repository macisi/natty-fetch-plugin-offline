
module.exports = {
  entry: './src/natty-fetch-plugin-offline',
  output: {
    path: __dirname + '/dist',
    filename: 'natty-fetch-plugin-offline.js',
    library: 'nattyFetchPluginOffline',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
          test: /\.js$/,
          loader: 'uglify',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
    ]
  },
  externals: {
    'localforage': true,
    'natty-fetch': {
      root: 'nattyFetch',
      var: 'nattyFetch',
      commonjs: 'natty-fetch',
      commonjs2: 'natty-fetch',
      amd: 'natty-fetch'
    },
  },
};