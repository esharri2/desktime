const addPlugins = require("./config/plugins");
const addPassThroughCopies = require("./config/passthroughs");
const addFilters = require("./config/filters");

module.exports = function (eleventyConfig) {
  addPlugins(eleventyConfig);
  addPassThroughCopies(eleventyConfig);
  addFilters(eleventyConfig);
  eleventyConfig.addWatchTarget("./_temp/");
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strict_filters: true,
  });
  eleventyConfig.setUseGitIgnore(false);
  return {
    dir: {
      data: "../_data",
      includes: "../_includes",
      layouts: "../_layouts",
      input: "./pages",
    },
  };
};
