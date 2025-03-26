import { defineConfig, globalIgnores } from 'eslint/config';
import satya164 from 'eslint-config-satya164';
import sort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  ...satya164,

  globalIgnores([
    '**/node_modules/',
    '**/coverage/',
    '**/dist/',
    '**/lib/',
    '**/.expo/',
    '**/.yarn/',
    '**/.vscode/',
  ]),

  {
    plugins: {
      'simple-import-sort': sort,
    },

    settings: {
      'react': {
        version: '16',
      },

      'import-x/core-modules': [
        '@react-navigation/core',
        '@react-navigation/native',
        '@react-navigation/routers',
        '@react-navigation/stack',
        '@react-navigation/native-stack',
        '@react-navigation/drawer',
        '@react-navigation/bottom-tabs',
        '@react-navigation/material-top-tabs',
        '@react-navigation/elements',
        '@react-navigation/devtools',
        'react-native-drawer-layout',
        'react-native-tab-view',
      ],
    },

    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@react-navigation/*/*'],

          paths: [
            {
              name: 'react-native',
              importNames: ['Text'],
              message:
                'Import `Text` from `@react-navigation/elements` instead.',
            },
            {
              name: '@react-navigation/core',
              message: 'Import from `@react-navigation/native` instead.',
            },
          ],
        },
      ],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-types': 'off',
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
    files: ['scripts/*.js', 'netlify/functions/**/*.js'],

    rules: {
      'import-x/no-commonjs': 'off',
    },
  },
  {
    files: ['**/*.config.{ts,mts,js,cjs,mjs}', '**/.*rc.{ts,mts,js,cjs,mjs}'],

    rules: {
      'import-x/no-default-export': 'off',
    },
  },
]);
