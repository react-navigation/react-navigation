// eslint-disable-next-line import/no-commonjs
module.exports = {
  presets: [
    '@babel/preset-react',
    '@babel/preset-flow',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/transform-block-scoping',
    '@babel/transform-modules-commonjs',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
};
