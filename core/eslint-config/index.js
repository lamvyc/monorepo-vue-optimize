module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  rules: {
    'vue/no-unused-components': 'error',
    'vue/prefer-import-from-vue': 'error',
    'vue/multi-word-component-names': 'off',
  },
}; 