
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const CleanWebpackPlugin = require('clean-webpack-plugin');
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  //entry: "./src/index.html",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, "./dist/index.html"),
      template: path.resolve(__dirname, "./public/index.html"),
      inject: true,// 注入选项 有四个值 true,body(script标签位于body底部),head,false(不插入js文件)
      hash: true,//回给script标签中的js文件增加一个随机数 防止缓存 bundle.js?22b9692e22e7be37b57e
    }),
    new NodePolyfillPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(cesiumSource, cesiumWorkers), to: 'Cesium/Workers' },
        { from: path.join(cesiumSource, 'Assets'), to: 'Cesium/Assets' },
        { from: path.join(cesiumSource, 'Widgets'), to: 'Cesium/Widgets' },
        { from: path.join(cesiumSource, 'ThirdParty'), to: 'Cesium/ThirdParty' }
      ]
    }),
  ],
  devServer: {
    // static: {
    //   directory: resolve(__dirname, ""),
    //   watch: true
    // },
    static: __dirname,
    port: 8010,
    open: true,
    hot: true,
    proxy: {
      "/arcgis": {
        target: "http://192.168.99.56:6080", // 目标代理接口地址
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/arcgis/": "/arcgis/"
        }
      },
      // compress: true,
    },
  },
  mode: 'development',
  resolve: {
    alias: {
      '@': path.join(__dirname, './src/')
    }
  },
  module: {
    rules: [
      // {
      //   test: /.jsx?$/,
      //   exclude: /node_modules/,
      //   loader: 'babel-loader'
      // },
      {
        test: /.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader"
          }
        ]
      }
    ]
  }
}
