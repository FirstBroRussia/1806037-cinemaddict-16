// path — встроенный в Node.js модуль
const path = require("path")

module.exports = {
  // указываем путь до входной точки
  entry: "./src/main.js",
  // описываем куда следует поместить результат работы
  output: {
    // путь до директории (важно использовать path.resolve)
    path: path.resolve(__dirname, "public"),
    // имя файла со сборкой
    filename: "bundle.js"
  },
  devtool: "source-map",
  devServer: {
    hot: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      }
    ]
  }
};
