/**
 * babel.config.js 会全局生效
 * https://developers.weixin.qq.com/community/develop/article/doc/0008a6df750c20b698485c53e56413
 */
module.exports = {
  presets: [
    ["@babel/env", { useBuiltIns: "usage", corejs: "3.14.0" }],
    "@babel/react",
    "@babel/typescript",
  ],
  plugins: [
    ["import", { libraryName: "antd", style: true }],
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-runtime",
  ],
};
