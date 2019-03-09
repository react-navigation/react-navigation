// eslint-disable-next-line import/no-commonjs
module.exports = {
  presets: [
    '@babel/preset-react',
    '@babel/preset-flow',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/transform-block-scoping',
    // NOTE(brent): Intentionally leave ES6 imports alone, they supported and
    // recommended by Webpack
    // (https://webpack.js.org/api/module-methods/#es6-recommended) and of
    // course metro
    // '@babel/transform-modules-commonjs',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
};
