import { defineConfig } from 'oxlint';
import jest from 'oxlint-config-satya164/jest';
import react from 'oxlint-config-satya164/react';
import recommended from 'oxlint-config-satya164/recommended';

export default defineConfig({
  extends: [recommended, react, jest],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@react-navigation/*/*',
              '!@react-navigation/elements/internal',
            ],
          },
        ],
        paths: [
          {
            name: 'color',
            message:
              'Import `Color` from `@react-navigation/elements` instead.',
          },
          {
            name: 'react-native',
            importNames: ['Text'],
            message: 'Import `Text` from `@react-navigation/elements` instead.',
          },
          {
            name: 'react-native-safe-area-context',
            importNames: ['useSafeAreaFrame'],
            message:
              'Import `useFrameSize` from `@react-navigation/elements` instead.',
          },
          {
            name: '@react-navigation/core',
            message: 'Import from `@react-navigation/native` instead.',
          },
        ],
      },
    ],
    'import-x/no-default-export': 'error',
    'react/jsx-pascal-case': 'off',
    'react/style-prop-object': 'off',
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks:
          '(useIsomorphicLayoutEffect|useAnimatedStyle|useAnimatedProps)',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.{ts,mts,tsx}'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
    {
      files: ['packages/native/src/**', 'packages/devtools/src/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@react-navigation/*/*'],
              },
            ],
          },
        ],
      },
    },
    {
      files: ['scripts/*.js', 'netlify/functions/**/*.js'],
      env: {
        node: true,
      },
      rules: {
        'import-x/no-commonjs': 'off',
      },
    },
    {
      files: ['scripts/**', 'example/e2e/**'],
      rules: {
        'no-await-in-loop': 'off',
      },
    },
    {
      files: [
        '**/*.config.ts',
        '**/*.config.mts',
        '**/*.config.js',
        '**/*.config.cjs',
        '**/*.config.mjs',
        '**/.*rc.ts',
        '**/.*rc.mts',
        '**/.*rc.js',
        '**/.*rc.cjs',
        '**/.*rc.mjs',
      ],
      rules: {
        'import-x/no-default-export': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules',
    'coverage',
    'dist',
    'lib',
    '.expo',
    '.yarn',
    '.vscode',
  ],
});
