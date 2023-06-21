module.exports = {
  client: {
    service: {
      name: 'wmf-nest',
      // URL to the GraphQL API
      // url: 'https://wmf-registration-38bfy.ondigitalocean.app/graphql',
      url: 'http://localhost:3000/graphql',
    },
    // Files processed by the extension
    includes: [
      'src/**/*.vue',
      'src/**/*.js',
      'src/**/*.gql',
      'src/**/*.graphql',
    ],
  },
}
