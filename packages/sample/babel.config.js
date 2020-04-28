module.exports = require("@toml.dev/scripts/config/babel.config.json");
module.exports.plugins.push([
  "babel-plugin-module-resolver",
  {
    root: ["./src"],
    alias: {
      "@swindler/core": "../core/src",
    },
  },
]);
