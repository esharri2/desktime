require("postcss-nested"),
  (module.exports = (ctx) => ({
    map: ctx.options.map,
    plugins: {
      "postcss-nested": {},
      "postcss-import": {},
      autoprefixer: {},
      cssnano: ctx.env === "production" ? {} : false,
    },
  }));
