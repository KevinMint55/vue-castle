const path = require('path');

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['plugin:vue/essential', 'airbnb-base'],
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname, './scripts/webpack.base.conf.js'),
      },
    },
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': 'off',
    'no-mixed-operators': 'off',
    'max-len': [1, 200],
    'default-case': 0,
    'func-names': 0,
    'no-param-reassign': 0,
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-lonely-if': 0,
    'import/no-extraneous-dependencies': 0,
    'global-require': 0,
    'guard-for-in': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-restricted-globals': ['error', 'event'],
    'no-restricted-syntax': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
