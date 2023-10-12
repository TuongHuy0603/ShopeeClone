/* eslint-disable */
/* eslint-env node */
const path = require('path')
module.exports = {
  root: true,
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      node: {
        path: [path.resolve(__dirname)],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    ,
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname
  },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }]
  },
  ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts']
}
