/**
 * webpack prod 基本配置
 */
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
// 分析打包体积的时候开启这个插件
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const getBaseConfig = require("./baseConfig.js");
const plugins = [new CleanWebpackPlugin()];
if (process.env.volume) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = (packagePath) => {
  return merge(getBaseConfig(packagePath), {
    mode: "production",
    devtool: "cheap-module-source-map",
    plugins: plugins,
    optimization: {
      minimizer: [
        new CssMinimizerWebpackPlugin(),
        new TerserWebpackPlugin({
          extractComments: false,
          terserOptions: {
            compress: { pure_funcs: ["console.log"] },
          },
        }),
      ],
    },
  });
};
