/**
 * webpack 基本配置
 */
const path = require("path");
const webpack = require("webpack");

//plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const jsName = isDev ? "js/[name].js" : "js/[name]_[chunkhash:8].js";
const cssName = isDev ? "css/[name].css" : "css/[name]_[contenthash:8].css";
const cssClassName = "[name]_[local]_[contenthash:4]";

const PACKAGE_PATH = path.resolve(__dirname, "../packages");
const NODE_MODULE_PATH = path.resolve(__dirname, "../node_modules");
const TEMPLATE_PATH = path.join(__dirname, "../template");

module.exports = (packagePath) => {
  const SRC_PATH = path.resolve(packagePath, "src");
  const BUILD_PATH = path.resolve(packagePath, "dist");

  return {
    target: "web",
    entry: {
      app: path.resolve(SRC_PATH, "index.tsx"),
    },
    output: {
      filename: jsName,
      path: BUILD_PATH,
      publicPath: "./",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
      new ESLintWebpackPlugin({
        extensions: ["tsx", "ts", "js"],
      }),
      new HtmlWebpackPlugin({
        template: path.join(TEMPLATE_PATH, "index.html"),
        filename: path.resolve(BUILD_PATH, "index.html"),
        cache: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      }),
      new MiniCssExtractPlugin({ filename: cssName }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV), // 不明白为啥使用JSON.stringify
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js)$/,
          include: [SRC_PATH, PACKAGE_PATH], // 这里需要将其他package包也加入编译范围内
          use: ["cache-loader", "babel-loader"],
        },
        {
          test: /\.(less|css)$/,
          include: [SRC_PATH, PACKAGE_PATH],
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: cssClassName,
                },
                importLoaders: 2,
              },
            },
            "postcss-loader",
            "less-loader",
          ],
        },
        {
          // 处理antd的样式文件，不能使用css module
          test: /\.(less|css)$/,
          include: NODE_MODULE_PATH,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: false,
              },
            },
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/,
          include: [SRC_PATH, PACKAGE_PATH],
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
                name: "img/[name]_[contenthash:8].[ext]",
              },
            },
            {
              loader: "image-webpack-loader",
              options: {
                mozjpeg: {
                  progressive: true,
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
                gifsicle: {
                  interlaced: false,
                },
                webp: {
                  quality: 75,
                },
              },
            },
          ],
        },
      ],
    },
  };
};
