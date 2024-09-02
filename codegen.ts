import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'graphql/schema.gql',
  documents: ['graphql/**/*.gql', 'src/**/*.vue'],
  generates: {
    'graphql/gql/': {
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
