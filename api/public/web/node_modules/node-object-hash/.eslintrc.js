module.exports = {
  extends: ['eslint:recommended', 'google'],
  parserOptions: {
    ecmaVersion: 5
  },
  env: {
    es6: true,
    node: true
  },
  rules: {
    'indent': ['error', 2],
    'spaced-comment': ['error', 'always', {markers: ['/']}],
    'no-console': 'warn',
    'no-var': 'off',
    'comma-dangle': ['error', 'never'],
    'max-len': [
      'error',
      {
        code: 100,
        ignoreComments: true
      }
    ]
    // 'valid-jsdoc': 'off',
    // 'require-jsdoc': 'off',
  }
};
