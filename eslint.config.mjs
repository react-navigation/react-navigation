import { defineConfig, globalIgnores } from 'eslint/config';
import { jest, react, recommended } from 'eslint-config-satya164';
import sort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  recommended,
  react,
  jest,

  globalIgnores([
    '**/node_modules/',
    '**/coverage/',
    '**/dist/',
    '**/lib/',
    '**/.expo/',
    '**/.pnpm-store/',
    '**/.vscode/',
  ]),

  {
    plugins: {
      'simple-import-sort': sort,
    },

    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@react-navigation/*/*',
            '!@react-navigation/elements/internal',
            '!@react-navigation/native/server',
          ],

          paths: [
            {
              name: 'react-native',
              importNames: ['Text'],
              message:
                'Import `Text` from `@react-navigation/elements` instead.',
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

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',

      'import-x/no-default-export': 'error',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'react-hooks/exhaustive-deps': [
        'error',
        {
          additionalHooks: '(useAnimatedStyle|useAnimatedProps)',
        },
      ],
    },
  },
  {
    files: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.test.{js,jsx,ts,tsx}'],

    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@react-navigation/*/*',
            '!@react-navigation/native/server',
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
          patterns: ['@react-navigation/*/*'],
          paths: [],
        },
      ],
    },
  },
  {
    files: ['**/*.config.{ts,mts,js,cjs,mjs}', '**/.*rc.{ts,mts,js,cjs,mjs}'],

    rules: {
      'import-x/no-default-export': 'off',
    },
  },
]);
