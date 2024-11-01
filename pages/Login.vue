<script setup lang="ts">
  import * as yup from 'yup'
  import YupPassword from 'yup-password'
  import { useToast } from 'vue-toastification'
  import {
    InstrumentsDocument,
    SignInDocument,
    SignUpDocument,
  } from '@/graphql/gql/graphql'
  import { useUser } from '@/stores/useUser'

  YupPassword(yup)

  const error = ref('')
  const isRegister = ref(false)
  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')
  const instrument = ref('')
  const password = ref('')
  const password2 = ref('')
  const privateTeacher = ref(false)
  const schoolTeacher = ref(false)
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

  const { result: instrumentQuery, onError: instrumentsError } =
    useQuery(InstrumentsDocument)
  const instruments = computed(() => instrumentQuery.value?.instruments ?? [])
  instrumentsError((error) => {
    console.log(error)
  })

  const { handleSubmit, values } = useForm({
    validationSchema: toTypedSchema(
      yup.object({
        isRegister: yup.boolean(),
        firstName: yup
          .string()
          .trim()
          .label('First Name')
          .when('isRegister', {
            is: true,
            then: (schema) => schema.required('Please enter your first name'),
            otherwise: (schema) => schema.notRequired(),
          }),
        lastName: yup
          .string()
          .trim()
          .label('Last Name')
          .when('isRegister', {
            is: true,
            then: (schema) => schema.required('Please enter your last name'),
            otherwise: (schema) => schema.notRequired(),
          }),
        instrument: yup
          .string()
          .trim()
          .label('Instrument(s)')
          .when('privateTeacher', {
            is: true,
            then: (schema) => schema.required('Please select an instrument'),
            otherwise: (schema) => schema.default('').notRequired(),
          }),
        email: yup.string().trim().email().required().label('Email'),
        password: yup.string().trim().password().required().label('Password'),
        password2: yup
          .string()
          .trim()
          .password()
          .oneOf([yup.ref('password')], 'Passwords must match')
          .label('Password 2')
          .when('isRegister', {
            is: true,
            then: (schema) =>
              schema.required('Please enter your password again'),
            otherwise: (schema) => schema.notRequired(),
          }),
        privateTeacher: yup.boolean().default(false),
        schoolTeacher: yup.boolean().default(false),
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
  } = useMutation(SignInDocument)

  const signin = handleSubmit(async (values) => {
    await signinMutation({
      credentials: { email: values.email, password: values.password },
    })
  })
  doneSignin(async (result) => {
    if (result.data?.signin.diatonicToken) {
      if (
        result.data.signin.user?.privateTeacher &&
        !result.data?.signin.user.hasSignedIn
      ) {
        await navigateTo('/userinformation')
      } else {
        await navigateTo('/registrations')
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
   * Check if this is a teacher account
   */
  async function signup() {
    // teacher type is checked
    if (!!privateTeacher.value || !!schoolTeacher.value) {
      await doesTeacherExistLoad()
      if (!!teacherExistCheck.value) {
        await userStore.loadHasPassword(teacherExistCheck.value.id)
        if (!!userStore.checkPassword) {
          alert('User already exists')
          return null
        } else if (!userStore.checkPassword) {
          signupAccount()
        }
      } else {
        await signupAccount()
      }
    } else {
      await signupAccount()
    }
  }

  const {
    result: resultDoesTeacherExist,
    load: loadDoesTeacherExist,
    refetch: doesTeacherExistRefetch,
    onResult: onDoesTeacherExistResult,
    onError: onDoesTeacherExistError,
  } = useLazyQuery(
    gql`
      query DoesTeacherExist($email: String!) {
        checkUser(email: $email) {
          id
        }
      }
    `,
    { email },
    { fetchPolicy: 'network-only' }
  )
  async function doesTeacherExistLoad() {
    ;(await loadDoesTeacherExist()) || (await doesTeacherExistRefetch())
  }
  const teacherExistCheck = computed(
    () => resultDoesTeacherExist.value?.checkUser ?? null
  )
  onDoesTeacherExistError((error) => {
    console.log(error)
  })

  /**
   * Register new account.  Sends confirmation email.
   */
  const {
    mutate: signupMutation,
    onError: registerError,
    onDone: doneSignup,
  } = useMutation(SignUpDocument)
  const signupAccount = handleSubmit((values) => {
    signupMutation({
      credentials: {
        firstName: values.firstName!,
        lastName: values.lastName!,
        instrument: values.instrument,
        email: values.email,
        password: values.password,
        privateTeacher: values.privateTeacher,
        schoolTeacher: values.schoolTeacher,
      },
    })
  })
  doneSignup(async (result) => {
    toast.success('Check EMAIL for account verification link')
    isRegister.value = false
    resetFields()
  })
  registerError((err) => {
    toast.error('Error signing up for account')
    console.log(err)
    setTimeout(() => resetFields(), 4000)
  })

  /**
   * Resend confirmation link
   */
  async function resendVerificationEmail() {
    try {
      await $fetch(config.public.resendConfirmation, {
        method: 'POST',
        body: {
          user: {
            firstName: user.value.firstName,
            lastName: user.value.lastName,
            email: user.value.email,
          },
        },
      })
      isOpen.value = false
      accountNotConfirmed.value = false
      resetFields()
    } catch (err) {
      console.log(err)
    }
  }

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
    firstName.value = ''
    lastName.value = ''
    instrument.value = ''
    email.value = ''
    password.value = ''
    password2.value = ''
    privateTeacher.value = false
    schoolTeacher.value = false
    user.value.email = ''
    user.value.firstName = ''
    user.value.lastName = ''
  }
</script>

<template>
  <div v-auto-animate>
    <div class="w-full sm:w-2/3 lg:w-1/2 mx-auto">
      <h2 class="text-center">Winnipeg Music Festival Registration 2025</h2>
      <p class="text-left">
        Begin registration by creating an account (account can be for an
        individual; a teacher for all their individual students, or for all
        their choirs; a parent for their family etc.)
      </p>
      <p class="text-center">
        <strong
          >Site best used with Google Chrome or Mozilla Firefox, not
          Safari</strong
        >
      </p>
      <p class="text-center">
        <strong
          >Do not let your computer auto populate contact information, please
          TYPE in all answers.</strong
        >
      </p>
      <!-- <p>
        <strong
          >Accounts from last year have been removed. Please make a new
          account.</strong
        >
      </p> -->
      <!-- <div
        class="mx-auto text-center border-4 border-red-700 rounded-lg mt-4 p-4">
        <h3>Registration for the 2024 music festival is now closed.</h3>
        <p>Please see the Winnipeg Music Festival homepage for information.</p>
        <BaseButton class="btn btn-blue w-[150px] h-16"
          ><a href="https://www.winnipegmusicfestival.org"
            >Winnipeg Music Festival</a
          ></BaseButton
        >
      </div> -->
    </div>
    <form
      v-auto-animate
      class="w-full sm:w-3/4 max-w-sm border rounded-lg border-sky-500 p-4 mx-auto mt-8">
      <div v-if="isRegister">
        <h3 class="loginheading">Sign up</h3>
        <fieldset
          v-auto-animate
          class="my-4 p-1 border-sky-500 border rounded-lg">
          <legend class="ml-2">
            <label>Select teacher type if applicable</label>
          </legend>
          <BaseCheckbox
            v-model="privateTeacher"
            name="privateTeacher"
            label="Private Teacher"
            class="py-2 px-4" />
          <BaseCheckbox
            v-model="schoolTeacher"
            name="schoolTeacher"
            label="School Teacher and/or Community Conductor"
            class="py-2 px-4" />
        </fieldset>
        <BaseInput
          v-model="firstName"
          v-auto-animate
          name="firstName"
          type="text"
          label="First Name" />
        <BaseInput
          v-model="lastName"
          v-auto-animate
          name="lastName"
          type="text"
          label="Last Name" />
        <BaseSelect
          v-if="privateTeacher"
          v-model="instrument"
          v-auto-animate
          name="instrument"
          :options="instruments"
          label="Instrument(s)" />
      </div>
      <h3
        v-else
        class="loginheading">
        Sign in
      </h3>
      <BaseInput
        v-model="email"
        v-auto-animate
        :autocomplete="isRegister ? 'off' : 'on'"
        autofocus
        name="email"
        type="email"
        label="Email"
        @keyup.enter="!isRegister ? signin() : signup()" />
      <BaseInput
        v-model="password"
        v-auto-animate
        :autocomplete="isRegister ? 'off' : 'on'"
        name="password"
        type="password"
        label="Password"
        @keyup.enter="!isRegister ? signin() : signup()" />
      <BaseInput
        v-if="isRegister"
        v-model="password2"
        v-auto-animate
        autocomplete="off"
        name="password2"
        type="password"
        label="Re-enter Password"
        @keyup.enter="signup()" />

      <div v-if="!isRegister">
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

          <div class="pt-8 text-center">
            Don't have an account?
            <BaseButton
              v-auto-animate
              class="text-sky-700"
              name="isLogin"
              @click="isRegister = true">
              Sign up here.
            </BaseButton>
          </div>
        </div>
      </div>
      <div v-else>
        <BaseButton
          v-auto-animate
          class="w-full m-0 btn btn-blue"
          @click="signup()">
          Register New Account
        </BaseButton>
        <div class="text-center">
          <BaseButton
            v-auto-animate
            class="mt-8 text-sky-700"
            @click="isRegister = false">
            Back to Sign In
          </BaseButton>
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
            v-if="accountNotConfirmed"
            class="p-4 w-full max-w-sm rounded-lg bg-white shadow-lg">
            <UIDialogTitle class="text-center text-xl font-bold">
              Account not verified
            </UIDialogTitle>
            <UIDialogDescription class="text-center">
              This account needs to be verified before signing in. Check your
              email inbox and spam folders for a verification link. You may also
              request another email. Check you spam folder as well.
            </UIDialogDescription>
            <div>
              <BaseButton
                class="btn btn-blue"
                @click="setIsOpen(false)">
                Close
              </BaseButton>
              <BaseButton
                class="btn btn-blue"
                @click="resendVerificationEmail()">
                Re-Send Verificaton
              </BaseButton>
            </div>
          </UIDialogPanel>
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

<style scoped>
  .loginheading {
    display: flex;
    justify-content: center;
  }
</style>
