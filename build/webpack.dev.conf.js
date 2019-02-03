'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

/**
 *
 *     1.VUE开发请求本地数据的配置，早期的vue-lic下面有dev-server.js和dev-client.js两文件，请求本地数据在dev-server.js里配置，最新的vue-webpack-template 中已经去掉了dev-server.js和dev-client.js 改用webpack.dev.conf.js代替，所以 配置本地访问在webpack.dev.conf.js里配置即可。
 *
 *   2.读取本地json数据
 *      目前的vue-cli2.0已经放弃dev-server.js , 只需在webpack.dev.conf.js配置就行
 *     在const portfinder = require('portfinder')后面加上以下代码
 *
 */

// 1.创建express,导入express模块
const express = require('express')
// 2.调用方法,返回app
const app = express()

// 1.模拟获取后台数据,获取对应的本地数据
var appData = require('../data.json')  //加载本地数据文件
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings
// 获取一个 express 的路由实例
var apiRoutes = express.Router()
// 3.通过路由请求数据
app.use('/api',apiRoutes);

// vue-cli3 在 dev-server.js配置本地数据访问
// apiRoutes.get( '/seller',function( req,res ){
//       // 1.接口返回json数据,上面配置的数据appData就赋值给data请求后调用
//      res.json({
//          errno : 0,
//          data:seller
//      },function(){
//           console.log("访问数据失败!");
//      });
// });
// apiRoutes.get( '/goods',function( req,res ){
//     // 1.接口返回json数据,上面配置的数据appData就赋值给data请求后调用
//     res.json({
//           errno : 0,
//           data:goods
//     },function(){
//       console.log("访问数据失败!");
//     });
// });
// apiRoutes.get( '/ratings',function( req,res ){
//     // 1.接口返回json数据,上面配置的数据appData就赋值给data请求后调用
//     res.json({
//           errno : 0,
//           data:ratings
//     },function(){
//       console.log("访问数据失败!");
//     })
// });


const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    // 在devServer配置这个before参数
    before(app){
      app.get( '/api/seller', ( req, res) => {
          res.json({
            errno: 0,
            data: seller
          })
      }),
      app.get( '/api/goods', ( req, res) => {
        res.json({
            errno: 0,
            data: goods
        })
      }),
      app.get( '/api/ratings', ( req, res) => {
        res.json({
            errno: 0,
            data: ratings
        })
      })
    },
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
