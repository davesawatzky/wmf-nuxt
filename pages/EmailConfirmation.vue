<script setup lang="ts">
  import process from 'node:process'

  const route = useRoute()
  const confirming = ref(true)
  const verificationError = ref()

  onMounted(async () => {
    try {
      const tokenParam = route.query.token
      const tokenBody = { token: tokenParam }

      console.log('Token: ', tokenBody)

      const { data, pending, error } = await useFetch(
        'http://localhost:3000/email-confirmation/confirm',
        {
          method: 'POST',
          body: tokenBody,
        }
      )
      confirming.value = pending.value
      verificationError.value = error.value
    } catch (err) {
      console.log('Error in Email Verification')
      console.log(err)
    }
  })

  async function login() {
    await navigateTo('/login')
  }
</script>

<template>
  <div class="text-center">
    <div v-if="confirming">
      <h3>Confirming Email</h3>
      <br />
      <div>
        <Icon
          class="animate-spin text-3xl"
          name="icomoon-free:spinner9" />
      </div>
    </div>
    <div v-if="!confirming && !verificationError">
      <h3>Email Confirmed</h3>
      <br />
      <button
        class="btn btn-blue"
        @click="login">
        Proceed to Login
      </button>
    </div>
    <div v-if="verificationError">
      <h3>Error Verifying Email Address</h3>
      <br />
      <button
        class="btn btn-blue"
        @click="login">
        Proceed to Login
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
