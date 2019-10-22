/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-22 15:26:13
 * @LastEditTime: 2019-08-22 15:26:13
 * @LastEditors: your name
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': [2, 'never'],
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': 'error',
    camelcase: 0,
    // 'vue/camelcase': ["error", {"ignoreDestructuring": true}],
    'vue/comma-dangle': 'error',
    'vue/component-name-in-template-casing': 'error',
    'vue/eqeqeq': 'error',
    'vue/key-spacing': 'error',
    'vue/match-component-file-name': 'error',
    'vue/object-curly-spacing': 'error',
    'vue/html-closing-bracket-newline': ["error", {
      "singleline": "never",
      "multiline": "never"
    }],
    'vue/max-attributes-per-line': ["error", {
      "singleline": 100,
      "multiline": {
        "max": 1,
      }
    }],
    "vue/singleline-html-element-content-newline": 0,
    "vue/html-self-closing": 0
  },
  'extends': [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/standard',
    '@vue/typescript'
  ]
}
