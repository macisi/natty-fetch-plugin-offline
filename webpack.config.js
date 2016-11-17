
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
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
    ]
  },
  externals: {
    'natty-fetch': {
      root: 'nattyFetch',
      var: 'nattyFetch',
      commonjs: 'natty-fetch',
      commonjs2: 'natty-fetch',
      amd: 'natty-fetch'
    },
    'a-storage': true,
  },
};