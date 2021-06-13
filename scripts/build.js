/**
 * prod环境构建脚本
 * 构建命令格式：yarn build -p [packageName]
 */
const minimist = require("minimist");
const chalk = require("chalk");
const logSymbols = require("log-symbols");
const path = require("path");
const fs = require("fs-extra");
const webpack = require("webpack");

// react-dev-utils
// format stats
const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = require("react-dev-utils/FileSizeReporter");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const printBuildError = require("react-dev-utils/printBuildError");

const { WEBPACK_BUILD_FILE_PATH } = require("./constants.js");

const args = minimist(process.argv.slice(2));
const packageName = args.p;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

if (!packageName) {
  console.log(
    logSymbols.error,
    `请确定需要构建的包，格式：${chalk.green("yarn build -p [packageName]")}`
  );
  process.exit(0);
}

const root = path.resolve(__dirname, "../");
const packagePath = path.resolve(root, `packages/${packageName}`);
if (!fs.pathExistsSync(packagePath)) {
  console.log(logSymbols.error, "当前包不存在！");
  process.exit(0);
}

let webpackConfig = require("../config/buildConfig")(packagePath);
const devPath = path.resolve(packagePath, WEBPACK_BUILD_FILE_PATH);
if (fs.pathExistsSync(devPath)) {
  webpackConfig = require(devPath);
}
const compiler = webpack(webpackConfig);
const currentBuildPath = path.join(packagePath, "dist");

const build = (previousFileSizes) => {
  compiler.run((err, stats) => {
    let messages;
    if (err) {
      messages = formatWebpackMessages({
        errors: [err.message],
        warnings: [],
      });
    } else {
      messages = formatWebpackMessages(
        stats.toJson({ all: false, warnings: true, errors: true })
      );
    }

    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      const error = new Error(messages.errors.join("\n\n"));
      console.log(chalk.red("Failed to compile.\n"));
      printBuildError(error);
      process.exit(1);
    }

    if (messages.warnings.length) {
      console.log(chalk.yellow("Compiled with warnings.\n"));
      console.log(warnings.join("\n\n"));
    } else {
      console.log(chalk.green("Compiled successfully.\n"));
    }
    console.log("File sizes after gzip:\n");
    printFileSizesAfterBuild(
      stats,
      previousFileSizes,
      currentBuildPath,
      WARN_AFTER_BUNDLE_GZIP_SIZE,
      WARN_AFTER_CHUNK_GZIP_SIZE
    );
    process.exit(0);
  });
};

// 构建之前，先获取上次的构建文件体积
measureFileSizesBeforeBuild(currentBuildPath).then((previousFileSizes) => {
  build(previousFileSizes);
});
