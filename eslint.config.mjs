import process from 'node:process'
import withNuxt from '.nuxt/eslint.config.mjs'

process.env.ESLINT_TSCONFIG = 'tsconfig.json'

export default withNuxt(
  { typescript: { tsconfigPath: 'tsconfig.json' }, vue: true },
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'warn',
      '@typescript-eslint/no-console':
        process.env.NODE_ENV === 'development' ? 'off' : 'off',
    },
  },
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
)
