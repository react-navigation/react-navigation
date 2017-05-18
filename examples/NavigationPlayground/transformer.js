/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Note: This is a fork of the fb-specific transform.js
 * Specifically, it uses 'babel-plugin-module-resolver' to rewrite requires for
 * 'react-native' and 'react' to point to the passed in paths from the transformer
 * options, and also utilizes babel-preset-expo for other Exponent specific transforms.
 */

const path = require('path');
const babel = require('babel-core');
const reactTransformPlugin = require('babel-plugin-react-transform').default;

const hmrTransform = 'react-transform-hmr/lib/index.js';
const transformPath = require.resolve(hmrTransform);

const makeHMRConfig = function(options, filename) {
  const transform = filename
    ? './' + path.relative(path.dirname(filename), transformPath) // packager can't handle absolute paths
    : hmrTransform;

  return {
    plugins: [
      [
        reactTransformPlugin,
        {
          transforms: [
            {
              transform,
              imports: ['react-native'],
              locals: ['module'],
            },
          ],
        },
      ],
    ],
  };
};

const buildAliasPreset = (reactNativePath, reactPath) => ({
  plugins: [
    [
      require('babel-plugin-module-resolver').default,
      {
        alias: Object.assign(
          {},
          {
            'react-native': path.resolve(
              `${reactNativePath || './node_modules/react-native'}`
            ),
            react: path.resolve(`${reactPath || './node_modules/react'}`),
          },
          require('babel-preset-expo').plugins[0][1].alias
        ),
        cwd: path.resolve(__dirname, '..'),
      },
    ],
  ],
});

/**
 * Given a filename and options, build a Babel
 * config object with the appropriate plugins.
 */
function buildBabelConfig(filename, options) {
  const exponentBabelPreset = require('babel-preset-expo');
  const babelConfig = {
    presets: [
      ...exponentBabelPreset.presets,
      buildAliasPreset(options.reactNativePath, options.reactPath),
    ],
    plugins: [],
  };

  const extraConfig = {
    filename,
    sourceFileName: filename,
    babelrc: false,
  };

  let config = Object.assign({}, babelConfig, extraConfig);

  let extraPresets = [];

  if (options.hot) {
    const hmrConfig = makeHMRConfig(options, filename);
    extraPresets.push(hmrConfig);
  }

  config.presets = [...config.presets, ...extraPresets];

  return Object.assign({}, babelConfig, config);
}

function transform(src, filename, options) {
  options = options || {};

  const babelConfig = buildBabelConfig(filename, options);
  const result = babel.transform(src, babelConfig);

  return {
    ast: result.ast,
    code: result.code,
    map: result.map,
    filename,
  };
}

module.exports = function(data, callback) {
  let result;
  try {
    result = transform(data.sourceCode, data.filename, data.options);
  } catch (e) {
    callback(e);
    return;
  }

  callback(null, result);
};

// export for use in jest
module.exports.transform = transform;
