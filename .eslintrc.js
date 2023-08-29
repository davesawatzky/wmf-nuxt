const process = require('node:process')

process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: ['@antfu', '@nuxtjs/eslint-config-typescript', 'prettier'],
  rules: {
    'unused-imports/no-unused-vars': 'off',
    'no-console': process.env.NODE_ENV === 'development' ? 'off' : '',
    '@typescript-eslint/no-console':
      process.env.NODE_ENV === 'development' ? 'off' : 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-setup-props-destructure': 'off',
  },
  overrides: [
    {
      files: ['*.gql'],
      parser: '@graphql-eslint/eslint-plugin',
      plugins: ['@graphql-eslint'],
      rules: {
        '@graphql-eslint/known-type-names': 'error',
      },
      parserOptions: {
        schema: './graphql/schema.gql',
      },
    },
  ],
}
