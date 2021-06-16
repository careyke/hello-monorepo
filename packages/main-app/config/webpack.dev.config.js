const path = require("path");
const { merge } = require("webpack-merge");

const getDefaultDevConfig = require("../../../config/devConfig");

const root = path.resolve(__dirname, "../");
const port = 8000;

module.exports = merge(getDefaultDevConfig(root, port));
