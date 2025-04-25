module.exports = {
  client: {
    service: {
      name: 'wmf-nest',
      // URL to the GraphQL API
      url: 'https://wmfapi.diatonic.ca/graphql',
      // url: 'http://localhost:3000/graphql',
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
