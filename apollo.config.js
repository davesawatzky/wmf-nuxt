module.exports = {
  client: {
    service: {
      name: 'wmf-nest',
      // URL to the GraphQL API
      url: 'https://wmf2024api.diatonic.ca/graphql',
      // url: 'http://localhost:3000/graphql',
    },
    // Files processed by the extension
    includes: ['**/*.vue', 'graphql/**/*.gql', 'graphql/**/*.graphql'],
  },
}
