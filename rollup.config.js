import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";

const dev = process.env.NODE_ENV !== "production";

export default [
  {
    input: "scripts/main.js",
    output: {
      file: !dev ? "_site/main.js" : "_temp/main.js",
      format: "iife",
    },
    plugins: [
      resolve({
        mainFields: ["main"],
      }),
      postcss({
        extract: true,
        extract: "index.css",
      }),
      !dev && terser(),
    ],
  },
  {
    input: "scripts/timer.js",
    output: {
      file: !dev ? "_site/timer.js" : "_temp/timer.js",
      format: "es",
    },
    plugins: [!dev && terser()],
  },
];
