const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: `./src/index.js`,
    output: {
        filename: `bundle.js`,
        path: path.resolve(__dirname, `public`)
    },
    devServer: {
        contentBase: path.resolve(__dirname, `public`),
        open: false,
        port: 1337
        
    },
    module: {
        rules: [
          {
            test: /\.s?css$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader'
            ]
          },
          { 
            test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
            use: ['url-loader?limit=100000'] 
          }
        ],
      },
    resolve: {
      extensions: [`.js`, '.css', '.scss']
    },
    devtool: `source-map`,
    plugins: [
      new MiniCssExtractPlugin({filename: 'style.css'})
    ]
};