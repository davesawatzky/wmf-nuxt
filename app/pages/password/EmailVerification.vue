<script setup lang="ts">
  import * as yup from 'yup'

  const email = ref('')
  const appStore = useAppStore()

  const { load: sendVerification, onResult: onSendResult } = useLazyQuery(
    gql`
      query PasswordChangeEmailVerification($email: String!) {
        passwordChangeEmailVerification(email: $email) {
          email
        }
      }
    `,
    () => ({
      email: email.value,
    }),
    { fetchPolicy: 'network-only', errorPolicy: 'all' }
  )

  onSendResult(async (result) => {
    if (result.data?.passwordChangeEmailVerification) {
      appStore.passwordResetSent = true
    }
  })

  const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(
      yup.object({
        email: yup.string().trim().email().required().label('Email'),
      })
    ),
  })

  const sendEmailVerification = handleSubmit(async () => {
    await sendVerification()
  })
</script>

<template>
  <div v-auto-animate>
    <div class="w-full sm:2w-2/3 lg:2-1/2 mx-auto">
      <h2 class="text-center">Winnipeg Music Festival Registration 2026</h2>
      <h3 class="text-center mt-8">Password Reset Link</h3>
      <form
        v-if="!appStore.passwordResetSent"
        v-auto-animate
        class="sm:w-3/4 max-w-sm border rounded-lg border-sky-500 p-4 mx-auto mt-8">
        <BaseInput
          v-model="email"
          v-auto-animate
          name="email"
          type="email"
          placeholder="Email Address"
          label="Account Email Address" />
        <p>
          An email verification link will be sent to this email address if it
          exists in our system. Click the link in the email to change your
          password.
        </p>
        <BaseButton
          class="w-full mx-auto mt-4 btn btn-blue"
          @click="sendEmailVerification()">
          Send Reset Link
        </BaseButton>
      </form>
      <div
        v-else
        v-auto-animate
        class="sm:w-3/4 max-w-sm border rounded-lg border-sky-500 p-4 mx-auto mt-8">
        <h4 class="text-center">Email Verification Sent</h4>
        <p>
          An email verification link has been sent to your email address. Click
          the link in the email to change your password.
        </p>
        <NuxtLink to="/login">
          <BaseButton class="w-full mx-auto mt-4 btn btn-blue">
            Proceed to Sign In
          </BaseButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
