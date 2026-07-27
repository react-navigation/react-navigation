module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-explicit-resource-management',
    'react-native-worklets/plugin',
  ],
};
