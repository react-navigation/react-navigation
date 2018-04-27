/**
 * This file is needed to hijack asset imports so that test files don't attempt
 * to import them as JavaScript modules.
 * See https://github.com/facebook/jest/issues/2663#issuecomment-317109798
 */
const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
  },
};
