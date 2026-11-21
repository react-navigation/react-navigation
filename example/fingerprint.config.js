/** @type {import('expo/fingerprint').Config} */
module.exports = {
  extraSources: [
    {
      type: 'dir',
      filePath: 'assets/symbols',
      reasons: ['react-native-nano-icons symbols'],
    },
  ],
};
