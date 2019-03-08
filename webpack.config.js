var path = require( "path" );

module.exports = {
  entry: "./src/element-predictor.ts",
  output: {
    path: path.resolve( __dirname, "dist/umd" ),
    filename: "element-predictor.js",
    library: "elementPredictor",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },
};
