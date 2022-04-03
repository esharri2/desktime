/**
 * For inling minified JS using includes
 */

const { minify } = require("terser");

const jsmin = (eleventyConfig) => {
  eleventyConfig.addFilter("jsmin", async function (code) {
    try {
      const minified = await minify(code);
      return minified.code;
    } catch (err) {
      console.error("Terser error: ", err);
    }
  });
};

module.exports = jsmin;
