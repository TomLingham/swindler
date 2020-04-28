import commonJs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";

const extensions = [".ts", ".tsx", ".js", ".jsx"];

export default {
  input: "./src/index.ts",
  output: {
    format: "cjs",
    file: "dist.js",
  },
  plugins: [
    babel({ extensions }),
    nodeResolve({ extensions, preferBuiltins: true }),
    commonJs(),
  ],
};
