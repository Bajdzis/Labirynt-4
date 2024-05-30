/* eslint-disable */
const path = require("path");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/game/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "./public/build"),
    filename: "[name]-bundle.js", // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
};
