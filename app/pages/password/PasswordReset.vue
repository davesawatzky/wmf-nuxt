<script setup lang="ts">
  import * as yup from 'yup'
  import { useToast } from 'vue-toastification'
  import YupPassword from 'yup-password'

  YupPassword(yup)

  const password1 = ref<string>('')
  const password2 = ref<string>('')
  const passwordChanged = ref(false)
  const status1 = ref<string>('')
  const changeError = ref('')
  const toast = useToast()

  const route = useRoute()
  const tokenParam = route.query.token

  const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(
      yup.object({
        password1: yup
          .string()
          .trim()
          .password()
          .required(
            'Please enter a password (min. 8 characters with at least one number, uppercase, and special character)'
          )
          .label('Password'),
        password2: yup
          .string()
          .trim()
          .oneOf([yup.ref('password1')], 'Passwords must match')
          .required('Please enter your password again'),
      })
    ),
  })

  const submitPasswordChange = handleSubmit(async () => {
    await changePassword()
  })

  const validPassword = computed(() => {
    return status1.value === 'valid' && password1.value === password2.value
  })

  const {
    mutate: changePassword,
    onDone: onPasswordChangeDone,
    onError: onPasswordChangeError,
  } = useMutation(
    gql`
      mutation PasswordChange($passwordChangeInput: PasswordChangeInput!) {
        passwordChange(passwordChangeInput: $passwordChangeInput) {
          userErrors {
            message
          }
          passwordChanged
        }
      }
    `,
    () => ({
      fetchPolicy: 'no-cache',
      variables: {
        passwordChangeInput: {
          resetToken: tokenParam,
          password1: password1.value,
          password2: password2.value,
        },
      },
    })
  )
  onPasswordChangeError((error) => {
    console.error('Password change error: ', error)
    toast.error(
      'There was an error changing your password. Please try again later.'
    )
  })
  onPasswordChangeDone(async (result) => {
    if (result.data?.passwordChange.passwordChanged) {
      passwordChanged.value = true
    } else if (result.data?.passwordChange.userErrors) {
      changeError.value = result.data?.passwordChange.userErrors[0].message
      console.error(changeError.value)
      toast.error(changeError.value)
    }
  })
</script>

<template>
  <div v-auto-animate>
    <div class="w-full sm:2w-2/3 lg:2-1/2 mx-auto">
      <h2 class="text-center">Winnipeg Music Festival Registration 2026</h2>
      <h3 class="text-center mt-8">Password Reset Form</h3>
      <form
        v-if="!passwordChanged && !changeError"
        v-auto-animate
        class="sm:w-3/4 max-w-sm border rounded-lg border-sky-500 p-4 mx-auto mt-8">
        <BaseInput
          v-model="password1"
          v-auto-animate
          name="password1"
          type="password"
          placeholder="New Password"
          label="Please enter a new password for your account"
          @change-status="(stat) => (status1 = stat)" />
        <BaseInput
          v-model="password2"
          v-auto-animate
          name="password2"
          type="password"
          placeholder="Re-enter password"
          label="Please re-enter your password" />
        <BaseButton
          :disabled="!validPassword"
          class="w-full mx-auto mt-4 btn btn-blue"
          @click="submitPasswordChange()">
          Reset Password
        </BaseButton>
      </form>
      <div
        v-else-if="passwordChanged"
        class="sm:w-3/4 max-w-sm border rounded-lg border-sky-500 p-4 mx-auto mt-8">
        <h4 class="text-center">Password Changed</h4>
        <p>
          You have successfully changed your password. You may now login with
          your new password.
        </p>
        <NuxtLink to="/login">
          <BaseButton class="w-full mx-auto mt-4 btn btn-blue">
            Proceed to Sign in
          </BaseButton>
        </NuxtLink>
      </div>
      <div v-else>
        <h4 class="text-center">Error</h4>
        <p>
          {{ changeError }}
        </p>
        <NuxtLink to="/login">
          <BaseButton class="w-full mx-auto mt-4 btn btn-blue">
            Proceed to Sign in
          </BaseButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
