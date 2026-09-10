import withNuxt from './.nuxt/eslint.config.mjs'
import antfu from '@antfu/eslint-config'

export default withNuxt(
  antfu({
    vue: true,
    typescript: true,
    rules: {
      'no-console': 'off',
      'ts/no-console':
        process.env.NODE_ENV === 'development' ? 'off' : 'off',
    },
  }),

  {
    files: ['*.gql'],
    parser: '@graphql-eslint/eslint-plugin',
    plugins: ['@graphql-eslint'],
    rules: {
      '@graphql-eslint/known-type-names': 'error',
    },
    parserOptions: {
      schema: '~/graphql/schema.gql',
    },
  }
)
