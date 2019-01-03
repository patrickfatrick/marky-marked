const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    postcssImport,
    postcssPresetEnv({
      stage: 0,
    }),
    cssnano({
      autoprefixer: false,
    }),
  ],
};
