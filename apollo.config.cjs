module.exports = {
  client: {
    service: {
      name: 'wmf-nest',
      // URL to the GraphQL API
      url: 'http://localhost:3001/graphql',
    },
    // Files processed by the extension
    includes: ['**/*.vue', 'graphql/**/*.gql', 'graphql/**/*.graphql'],
  },
}
