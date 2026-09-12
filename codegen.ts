import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'app/graphql/schema.gql',
  documents: [
    'app/graphql/**/*.gql',
    'app/**/*.{vue,ts}',
    '!app/graphql/gql/**/*',
  ],
  generates: {
    'app/graphql/gql/schema-types.ts': {
      plugins: ['typescript'],
      config: {
        useTypeImports: true,
        scalars: {
          DateTime: 'Date',
          Decimal: 'number',
        },
      },
    },
    'app/graphql/gql/graphql.ts': {
      plugins: [
        {
          add: {
            content: 'export * from \'./schema-types\';',
          },
        },
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        useTypeImports: true,
        nonOptionalTypename: true,
        importSchemaTypesFrom: 'app/graphql/gql/schema-types',
        namespacedImportName: 'Types',
        scalars: {
          DateTime: 'Date',
          Decimal: 'number',
        },
      },
    },
  },
  config: {
    namingConvention: 'keep',
  },
  verbose: true,
}

export default config
