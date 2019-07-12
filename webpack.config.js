var createVendorChunk = require('webpack-create-vendor-chunk');
var webpack = require('webpack');
var path = require("path");

module.exports = {
  mode: "development",
  entry: {
    ui: './src/ui/index.tsx',
    agent: './src/agent/index.js',
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".less"]
  },

  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, "chrome-extension/build/"),
    publicPath: 'build',
    filename: '[name].bundle.js'
  },

  // plugins: [
  //   createVendorChunk({
  //     name: 'vendor',
  //     chunks: ['ui'],
  //   }),
  // ],
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         test: /node_modules/,
  //         chunks: "initial",
  //         name: 'vendor',
  //         enforce: true
  //       },
  //     }
  //   }
  // },

  module: {
    rules: [
      {
        test: /\.(ts|js|tsx|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },

      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader"
      },

      {
        test: /(?:\.woff2?$|\.ttf$|\.svg$|\.eot$)/,
        loader: 'file-loader',
        query: {
          name: '/build/font/[hash].[ext]'
        }
      },
    ]
  }
};
