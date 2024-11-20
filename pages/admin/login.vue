<script setup lang="ts">
  import * as yup from 'yup'
  import YupPassword from 'yup-password'
  import { useToast } from 'vue-toastification'
  import { useUser } from '@/stores/useUser'

  definePageMeta({
    layout: 'blank',
  })

  YupPassword(yup)

  const error = ref('')
  const email = ref('')
  const password = ref('')
  const config = useRuntimeConfig()
  const isOpen = ref(false)
  const accountNotConfirmed = ref(false)
  const passwordChangePending = ref(false)
  const user = ref({
    email: '',
    firstName: '',
    lastName: '',
  })
  const userStore = useUser()
  const toast = useToast()

  function setIsOpen(value: boolean) {
    isOpen.value = value
  }

  const { handleSubmit, values } = useForm({
    validationSchema: toTypedSchema(
      yup.object({
        email: yup.string().trim().email().required().label('Email'),
        password: yup.string().trim().password().required().label('Password'),
      })
    ),
  })

  /**
   * Sign in and retrieve Token after authenticating
   */
  const {
    mutate: signinMutation,
    onError: signinError,
    onDone: doneSignin,
  } = useMutation(gql`
    mutation AdminSignIn($credentials: CredentialsSignin!) {
      signin(credentials: $credentials) {
        userErrors {
          message
        }
        diatonicToken
        user {
          email
          firstName
          lastName
          admin
        }
      }
    }
  `)

  const signin = handleSubmit(async (values) => {
    await signinMutation({
      credentials: { email: values.email, password: values.password },
    })
  })
  doneSignin(async (result) => {
    if (result.data?.signin.diatonicToken) {
      if (result.data.signin.user?.admin) {
        await navigateTo('/admin')
      } else {
        await navigateTo('/login')
      }
    }
    if (result.data?.signin?.userErrors[0]) {
      if (
        result.data?.signin.userErrors[0].message.includes(
          'Account not confirmed.'
        )
      ) {
        user.value.firstName = result.data?.signin.user?.firstName!
        user.value.lastName = result.data?.signin.user?.lastName!
        user.value.email = result.data?.signin.user?.email!
        accountNotConfirmed.value = true
        isOpen.value = true
      }
      if (result.data?.signin.userErrors[0].message.includes('Password')) {
        passwordChangePending.value = true
        isOpen.value = true
      }
    }
  })
  signinError((error) => {
    toast.error('Incorrect email or password.')
    console.log(error)
    setTimeout(() => resetFields(), 4000)
  })

  /**
   * Resend password reset link
   */
  async function resendPasswordEmail() {
    try {
      await $fetch(config.public.resendPasswordReset, {
        method: 'POST',
        body: {
          email: user.value.email,
        },
      })
      isOpen.value = false
      passwordChangePending.value = false
      resetFields()
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Reset Email and Password Fields after failed login
   */
  function resetFields() {
    error.value = ''
    email.value = ''
    password.value = ''
    user.value.email = ''
    user.value.firstName = ''
    user.value.lastName = ''
  }
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <form
      class="sm:w-3/4 max-w-sm border rounded-lg border-sky-500 p-4 mx-auto mt-8">
      <h3 class="text-center mb-8">WMF Administration</h3>
      <BaseInput
        v-model="email"
        v-auto-animate
        autocomplete="off"
        autofocus
        name="email"
        type="email"
        label="Email"
        @keyup.enter="signin()" />
      <BaseInput
        v-model="password"
        v-auto-animate
        autocomplete="off"
        name="password"
        type="password"
        label="Password"
        @keyup.enter="signin()" />
      <BaseButton
        v-auto-animate
        class="w-full m-0 btn btn-blue"
        @click="signin()">
        Sign In
      </BaseButton>
      <div class="">
        <div class="pt-4 text-center">
          <NuxtLink
            v-auto-animate
            class="text-sky-700 text-center"
            to="/password/EmailVerification"
            name="resetPassword">
            Forgot your password?
          </NuxtLink>
        </div>
      </div>
    </form>
  </div>

  <UITransitionRoot
    :show="isOpen || false"
    as="template"
    enter="duration-1000 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="duration-1000 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0">
    <UIDialog
      class="relative z-50"
      @close="setIsOpen">
      <UITransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div
          class="fixed inset-0 bg-black/30"
          aria-hidden="true" />
      </UITransitionChild>
      <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
        <UITransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95">
          <UIDialogPanel
            v-if="passwordChangePending"
            class="p-4 w-full max-w-sm rounded-lg bg-white shadow-lg">
            <UIDialogTitle class="text-center text-xl font-bold">
              Password Change Pending
            </UIDialogTitle>
            <UIDialogDescription class="text-center">
              A password change has been requested on this account. Check your
              email inbox and spam folders for instructions on changing your
              email.
            </UIDialogDescription>
            <div>
              <BaseButton
                class="btn btn-blue"
                @click="setIsOpen(false)">
                Close
              </BaseButton>
              <BaseButton
                class="btn btn-blue"
                @click="resendPasswordEmail()">
                Re-Send Password Change Email
              </BaseButton>
            </div>
          </UIDialogPanel>
        </UITransitionChild>
      </div>
    </UIDialog>
  </UITransitionRoot>
</template>

<style scoped></style>
