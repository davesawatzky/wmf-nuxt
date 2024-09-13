<script setup lang="ts">
  import * as yup from 'yup'

  const email = ref('')

  const {
    mutate: sendVerification,
    loading: sendLoading,
    onError: onSendError,
    onDone: onSendDone,
  } = useMutation(
    gql`
      mutation EmailVerification($email: String!) {
        emailVerification(email: $email) {
          email
        }
      }
    `,
    () => ({
      fetchPolicy: 'no-cache',
      variables: {
        email: email.value,
      },
    })
  )

  const { handleSubmit, values } = useForm({
    validationSchema: toTypedSchema(
      yup.object({
        email: yup.string().trim().email().required().label('Email'),
      })
    ),
  })

  const sendEmailVerification = handleSubmit(async (values) => {
    await sendVerification()
  })
</script>

<template>
  <div v-auto-animate>
    <div class="w-full sm:2w-2/3 lg:2-1/2 mx-auto">
      <h2 class="text-center">Winnipeg Music Festival Registration 2025</h2>
      <h3 class="text-center mt-8">Password Reset Link</h3>
      <form
        v-auto-animate
        class="sm:w-3/4 max-w-sm border rounded-lg border-sky-500 p-4 mx-auto mt-8">
        <BaseInput
          v-auto-animate
          v-model="email"
          name="email"
          type="email"
          placeholder="Email Address"
          label="Enter you email address" />
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
    </div>
  </div>
</template>

<style lang="css" scoped></style>
