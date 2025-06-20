module.exports = {
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  rules: {
    'vue/no-unused-components': 'error',
    'vue/prefer-import-from-vue': 'error',
    'vue/multi-word-component-names': 'off',
    semi: ['error', 'always'],
    'func-style': ['error', 'expression'],
    'arrow-body-style': ['error', 'always'],
    curly: ['error', 'all'],
    'prefer-arrow-callback': 'error',
    'arrow-parens': ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': 'error',
    eqeqeq: ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
    ],
    'brace-style': ['error', '1tbs'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
  },
};
