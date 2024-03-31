import process from 'node:process'
import antfu from '@antfu/eslint-config'

// const process = require('node:process')

process.env.ESLINT_TSCONFIG = 'tsconfig.json'

export default antfu(
  { typescript: { tsconfigPath: 'tsconfig.json' }, vue: true },
  {
    rules: {
      'unused-imports/no-unused-vars': 'off',
      'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'warn',
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
  }
)
