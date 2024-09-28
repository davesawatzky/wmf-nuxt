module.exports = {
  client: {
    service: {
      name: 'wmf-nest',
      // URL to the GraphQL API
      // url: 'https://wmfapi.diatonic.ca/graphql',
      url: process.env.NUXT_GRAPHQL_SERVER,
    },
    // Files processed by the extension
    includes: ['**/*.vue', 'graphql/**/*.gql', 'graphql/**/*.graphql'],
  },
}
