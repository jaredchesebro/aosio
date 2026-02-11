import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  eslintPluginPrettier,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }]
    }
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }]
    }
  }
];
