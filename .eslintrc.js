module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'prettier',
    'standard',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    es6: true,
    node: true,
    jest: true
  },
  rules: {
    'no-useless-constructor': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
}
