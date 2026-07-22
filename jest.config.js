const transformIgnorePatterns = [
  'node_modules/(?!\\.pnpm|(@react-navigation|react-native-drawer-layout|react-native-tab-view|(jest-)?@react-native|react-native|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-safe-area-context|nanoid|query-string|decode-uri-component|filter-obj|split-on-first|escape-string-regexp|immer|standard-navigation)/)',
  'node_modules/.pnpm/(?!(?:@react-navigation\\+[^@]+|react-native-drawer-layout|react-native-tab-view|@react-native\\+[^@]+|react-native|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-safe-area-context|nanoid|query-string|decode-uri-component|filter-obj|split-on-first|escape-string-regexp|immer|standard-navigation)@)',
];

const common = {
  rootDir: __dirname,
  prettierPath: 'prettier-2',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
  transformIgnorePatterns,
};

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'native',
      preset: '@react-native/jest-preset',
      testEnvironmentOptions: {
        customExportConditions: [
          'require',
          'react-native',
          '@react-navigation/source',
        ],
      },
      testPathIgnorePatterns: ['\\.web\\.(test|spec)\\.'],
      testRegex: '/__tests__/.*\\.(test|spec)\\.(js|tsx?)$',
    },
    {
      ...common,
      displayName: 'web',
      moduleNameMapper: {
        '^react-native$': 'react-native-web',
      },
      testEnvironment: 'jsdom',
      testEnvironmentOptions: {
        customExportConditions: [
          'require',
          'browser',
          '@react-navigation/source',
        ],
        url: 'https://example.com',
      },
      testMatch: ['<rootDir>/**/__tests__/**/*.web.test.{js,ts,tsx}'],
      transform: {
        '^.+\\.(js|ts|tsx)$': 'babel-jest',
      },
    },
  ],
};
