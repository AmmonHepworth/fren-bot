module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['prettier'],
  rules: {
    // This app's only runtime output is console.log
    'no-console': 0,

    // We have methods that encode class logic that don't need `this`
    'class-methods-use-this': 0,

    // Without this eslint is angry at void callbacks
    'consistent-return': 0,

    // Error on format
    'prettier/prettier': 'error',
  },
};
