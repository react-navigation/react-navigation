// eslint-disable-next-line import/no-commonjs
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
  };
};
