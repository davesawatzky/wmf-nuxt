<script setup lang="ts">
  const route = useRoute()
  const errorMessage = ref('')
  const config = useRuntimeConfig()

  const tokenParam = route.query.token
  const tokenBody = { token: tokenParam }

  const { data, status, error } = await useFetch(
    config.public.emailConfirmation,
    {
      method: 'POST',
      body: tokenBody,
      onResponseError({ request, response, options }) {
        if (response._data.message) {
          errorMessage.value = response._data.message
        }
      },
    }
  )

  async function login() {
    await navigateTo('/login')
  }
</script>

<template>
  <div
    v-auto-animate
    class="text-center">
    <div v-if="status === 'pending'">
      <h3>Account Verification Page</h3>
      <br />
      <div>
        <Icon
          class="animate-spin text-3xl"
          name="icomoon-free:spinner9" />
      </div>
    </div>
    <div v-if="status === 'success' && !error">
      <h3>Congratulations, your account is verified.</h3>
      <br />
      <button
        class="btn btn-blue"
        @click="login">
        Proceed to Sign In
      </button>
    </div>
    <div v-if="errorMessage === 'Email confirmation token expired'">
      <h3>{{ errorMessage }}</h3>
      <p class="max-w-[400px] mx-auto">
        Sign in to your account and click the 'Re-send link' button in the
        dialog box. This will send another link to your email address. Accounts
        must be verified before sign in is possible.
      </p>
      <br />
      <button
        class="btn btn-blue"
        @click="login">
        Proceed to Sign In
      </button>
    </div>
    <div v-if="errorMessage === 'Email already confirmed'">
      <h3>{{ errorMessage }}</h3>
      <p class="max-w-[400px] mx-auto">
        This email address has already been verified.
      </p>
      <br />
      <button
        class="btn btn-blue"
        @click="login">
        Proceed to Sign In
      </button>
    </div>
    <div v-if="errorMessage === 'Bad confirmation token'">
      <h3>{{ errorMessage }}</h3>
      <p class="max-w-[400px] mx-auto">
        Click the verification link in the email again. If this fails, sign in
        to your account and click the 'Re-send link" button in the dialog box.
        This will send another link to your email address. Email addresses must
        be verified before sign in is possible.
      </p>
      <br />
      <button
        class="btn btn-blue"
        @click="login">
        Proceed to Sign In
      </button>
    </div>
    <div v-if="error && !errorMessage">
      <h3>Error Verifying Account</h3>
      <p class="max-w-[400px] mx-auto">
        Try using the verification link again, re-register, or contact Winnipeg
        Music Festival if problems persist.
      </p>
      <br />
      <button
        class="btn btn-blue"
        @click="login">
        Proceed to Sign In
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
