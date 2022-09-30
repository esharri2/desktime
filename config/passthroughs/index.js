module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({ "./_temp/index.css": "./index.css" });
  eleventyConfig.addPassthroughCopy({ "./_temp/*.js": "./" });
  eleventyConfig.addPassthroughCopy({ "./assets/*": "./" });
};
