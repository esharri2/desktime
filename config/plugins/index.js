// const metagen = require("eleventy-plugin-metagen");
const svgContents = require("eleventy-plugin-svg-contents");

module.exports = (eleventyConfig) => {
  // eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(svgContents);
};
