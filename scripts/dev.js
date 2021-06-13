/**
 * dev环境构建脚本
 * 构建命令格式：yarn dev -p [packageName]
 */
const minimist = require("minimist");
const chalk = require("chalk");
const logSymbols = require("log-symbols");
const path = require("path");
const fs = require("fs-extra");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

const { HOST, PORT, WEBPACK_DEV_FILE_PATH } = require("./constants.js");

const args = minimist(process.argv.slice(2));
const packageName = args.p;

if (!packageName) {
  console.log(
    logSymbols.error,
    `请确定需要构建的包，格式：${chalk.green("yarn dev -p [packageName]")}`
  );
  process.exit(0);
}

const root = path.resolve(__dirname, "../");
const packagePath = path.resolve(root, `packages/${packageName}`);
if (!fs.pathExistsSync(packagePath)) {
  console.log(logSymbols.error, "当前包不存在！");
  process.exit(0);
}

let webpackConfig = require("../config/devConfig")(packagePath, PORT);
const devPath = path.resolve(packagePath, WEBPACK_DEV_FILE_PATH);
if (fs.pathExistsSync(devPath)) {
  webpackConfig = require(devPath);
}
const compiler = webpack(webpackConfig);
const devServerConfig = webpackConfig.devServer;
const devServer = new WebpackDevServer(compiler, devServerConfig);

devServer.listen(devServerConfig.port || PORT, HOST, (err) => {
  if (err) {
    return console.log(err);
  }
});
