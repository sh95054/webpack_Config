const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const fs = require('fs');

const common = {
  entry: {
    vendors: ['vue','vue-resource']
  },
  output: {},
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader,"css-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          { loader: "sass-loader" },
          {
            loader: "postcss-loader",
            options: {
                ident: 'postcss',
                plugins: [
                    require("autoprefixer")({
                      'browsers': ['> 1%', 'last 2 versions']
                    })
                ]
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      },
      {
        test: /\.(jpe?g|png|gif)\??.*$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit:4096,
              // mimetype: 'image/png',
              name: 'image/[hash:8].[name].[ext]',
              publicPath: '../',
              outputPath: "../dist/"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\\/]node_modules[\\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}

module.exports = (env, argv)=>{
    const dir = `/public/${argv.dir}/`,
          isDev = argv.mode === 'development',
          list = fs.readdirSync(__dirname+dir+'src/template/');
    let config;

    //目录多页面
    list.forEach((htmlFile)=>{
        const filename = htmlFile.replace('.html','');
        common.entry[filename] =  `.${dir}src/js/${filename}.js`;
        common.plugins.push(
          new HtmlWebpackPlugin({
            template: './'+dir+'src/template/'+htmlFile,
            filename: (isDev ? '../':'./')+htmlFile,
            inject: true,
            cache: isDev ? false : true,
            chunks: ['vendors',filename]
          })
        );
    })

    //合并config
    config = merge(common,{
        output:{
          filename: `js/[name]${isDev?'':'.[contenthash]'}.js`,
          path: path.resolve(__dirname+dir, 'dist'),
          publicPath: './dist/'
        },
        plugins:[
          new MiniCssExtractPlugin({
            filename: `css/[name]${isDev?'':'.[hash:8]'}.css`
          })
        ]
    })

    return config;
}
