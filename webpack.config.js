const path = require('path');

module.exports = {
  entry: './index.js',
  target:'node',
  experiments:{
    outputModule:true
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: "commonjs2"
  },
  mode:'production',
//   mode:'development',
};