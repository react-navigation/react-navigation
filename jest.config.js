const { transform } = require('@react-native/jest-preset');

const transformIgnorePatterns = [
  'node_modules/(?!\\.pnpm|(@react-navigation|react-native-drawer-layout|react-native-tab-view|(jest-)?@react-native|react-native|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-safe-area-context|nanoid|query-string|decode-uri-component|filter-obj|split-on-first|escape-string-regexp|immer|standard-navigation)/)',
  'node_modules/.pnpm/(?!(?:@react-navigation\\+[^@]+|react-native-drawer-layout|react-native-tab-view|@react-native\\+[^@]+|react-native|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-safe-area-context|nanoid|query-string|decode-uri-component|filter-obj|split-on-first|escape-string-regexp|immer|standard-navigation)@)',
];

module.exports = {
  projects: [
    {
      preset: '@react-native/jest-preset',
      setupFilesAfterEnv: [
        '<rootDir>/jest/setup.js',
        '<rootDir>/jest/setup.native.js',
      ],
      testEnvironment: 'node',
      testEnvironmentOptions: {
        customExportConditions: ['react-native', '@react-navigation/source'],
      },
      testMatch: ['<rootDir>/**/__tests__/**/*.test.tsx'],
      testPathIgnorePatterns: ['\\.web\\.test\\.tsx$'],
      transformIgnorePatterns,
    },
    {
      haste: {
        defaultPlatform: 'web',
      },
      setupFilesAfterEnv: [
        '<rootDir>/jest/setup.js',
        '<rootDir>/jest/setup.web.js',
      ],
      globals: {
        IS_REACT_ACT_ENVIRONMENT: true,
      },
      moduleNameMapper: {
        '^react-native$': 'react-native-web',
      },
      testEnvironment: 'node',
      testEnvironmentOptions: {
        customExportConditions: ['browser', '@react-navigation/source'],
      },
      testMatch: ['<rootDir>/**/__tests__/**/*.web.test.tsx'],
      transform,
      transformIgnorePatterns,
    },
  ],
};
