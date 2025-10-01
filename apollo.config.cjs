module.exports = {
  client: {
    service: {
      name: 'wmf-nest',
      // URL to the GraphQL API
      url: process.env.NUXT_GRAPHQL_SERVER,
    },
    // Files processed by the extension
    includes: [
      'app/**/*.vue',
      'app/graphql/**/*.gql',
      'app/graphql/**/*.graphql',
    ],
    excludes: ['node_modules/**/*'],
  },
}
