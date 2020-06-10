const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const mode = process.env.NODE_ENV || 'development'

module.exports = {
  mode,
  entry: './index.js',
  devtool: mode === 'development' ? 'source-map' : 'none',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'site.js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          // {
          //   loader: 'style-loader' // creates style nodes from JS strings
          // },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'less-loader' // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          // {
          //   loader: 'style-loader' // creates style nodes from JS strings
          // },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          }
        ]
      },
      {
        test: /\.pug$/,
        use: 'pug-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'site.css'
    }),
    new HtmlWebpackPlugin({
      template: './index.pug'
    })
  ],
  watchOptions: {
    aggregateTimeout: 200,
    ignored: /node_modules/
  },
  resolve: {
    alias: {
      // jquery: 'jquery/src/jquery'
    },
    extensions: ['.js', '.less', '.pug']
  }
}
