#! /usr/bin/env node
const { existsSync } = require("fs");
const { resolve } = require("path");
const { name } = require("../package.json");

const dev = existsSync(resolve(__dirname, "..", "src"));

if (dev && process.env.DEV !== "false") {
  console.log(`>> Running \x1b[35m${name}\x1b[0m in development mode.\n`);
  require("./babel");
  require("../src/index.ts");
} else {
  require("../dist.js");
}
