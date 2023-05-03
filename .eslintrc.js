process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: ['@antfu', '@nuxtjs/eslint-config-typescript', 'prettier'],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-console': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    'vue/multi-word-component-names': 'off',
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
