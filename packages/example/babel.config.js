/* eslint-disable import/no-commonjs */
/* eslint-env node */

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
