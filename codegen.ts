import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'app/graphql/schema.gql',
  documents: ['app/graphql/**/*.gql', 'app/**/*.vue'],
  generates: {
    'app/graphql/gql/': {
      preset: 'client',
      config: {
        useTypeImports: true,
        nonOptionalTypename: true,
      },
      plugins: [],
    },
  },
  config: {
    namingConvention: 'keep',
  },
  verbose: true,
}

export default config
