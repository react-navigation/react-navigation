import type { OxlintConfig } from 'oxlint';
import { compose } from 'oxlint-config-satya164';
import jest from 'oxlint-config-satya164/jest';
import react from 'oxlint-config-satya164/react';
import recommended from 'oxlint-config-satya164/recommended';

const config: OxlintConfig = compose(recommended, react, jest, {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@react-navigation/*/*',
              '!@react-navigation/elements/internal',
              '!@react-navigation/native/server',
            ],
          },
        ],
        paths: [
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
    'import/no-default-export': 'error',
    'react/display-name': 'off',
    'react/jsx-pascal-case': 'off',
    'react/jsx-no-constructed-context-values': 'off',
    'react/style-prop-object': 'off',
    'unicorn/no-thenable': 'off',
    'react/exhaustive-deps': [
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
        'typescript/consistent-type-imports': 'off',
        'typescript/no-explicit-any': 'off',
        'typescript/no-empty-object-type': 'off',
        'typescript/no-require-imports': 'off',
      },
    },
    {
      files: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.test.{js,jsx,ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  '@react-navigation/*/*',
                  '!@react-navigation/native/server',
                ],
              },
            ],
            paths: [
              {
                name: '@react-navigation/core',
                message: 'Import from `@react-navigation/native` instead.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['packages/{native,devtools}/src/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [{ group: ['@react-navigation/*/*'] }],
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
        'import/no-commonjs': 'off',
      },
    },
    {
      files: ['jest/**/*.js'],
      env: {
        node: true,
      },
    },
    {
      files: ['scripts/**', 'example/e2e/**'],
      rules: {
        'no-await-in-loop': 'off',
      },
    },
    {
      files: ['**/*.config.{ts,mts,js,cjs,mjs}', '**/.*rc.{ts,mts,js,cjs,mjs}'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules',
    'coverage',
    'dist',
    'lib',
    '.expo',
    '.pnpm-store',
    '.vscode',
  ],
});

export default config;
