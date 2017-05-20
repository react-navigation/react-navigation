const path = require('path');

module.exports = {
  getProvidesModuleNodeModules: () => [
    // `${path.resolve(__dirname)}/node_modules/react-native`,
    'react-native'
  ],
  getAliases: () => ({
    'react-native': `${path.resolve(__dirname)}/node_modules/react-native`,
  })
}
