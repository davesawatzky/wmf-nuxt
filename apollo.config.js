module.exports = {
  client: {
    service: {
      name: 'wmf-nest',
      // URL to the GraphQL API
      // url: 'https://wmf-diatonic-be.netlify.app/graphql',
      url: 'http://localhost:3000/graphql',
    },
    // Files processed by the extension
    includes: ['**/*.vue', 'graphql/**/*.gql', 'graphql/**/*.graphql'],
  },
}
