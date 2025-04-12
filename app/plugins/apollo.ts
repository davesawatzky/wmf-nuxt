import { provideApolloClient } from '@vue/apollo-composable'

export default defineNuxtPlugin((nuxtApp) => {
  provideApolloClient(useApollo().clients!.default)
})
