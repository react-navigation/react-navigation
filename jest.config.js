const path = require('path');

const { transform } = require('@react-native/jest-preset');

const transformIgnorePatterns = [
  'node_modules/(?!\\.pnpm|(@react-navigation|react-native-drawer-layout|react-native-tab-view|(jest-)?@react-native|react-native|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-safe-area-context|nanoid|escape-string-regexp|immer|standard-navigation)/)',
  'node_modules/.pnpm/(?!(?:@react-navigation\\+[^@]+|react-native-drawer-layout|react-native-tab-view|@react-native\\+[^@]+|react-native|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-safe-area-context|nanoid|escape-string-regexp|immer|standard-navigation)@)',
];

module.exports = {
  projects: [
    {
      preset: '@react-native/jest-preset',
      // Reanimated isn't a dependency of the root package
      // So we resolve its Jest resolver from a package that depends on it
      resolver: require.resolve('react-native-reanimated/jest/resolver', {
        paths: [path.join(__dirname, 'packages/react-native-drawer-layout')],
      }),
      setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
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
