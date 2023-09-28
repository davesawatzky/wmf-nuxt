<script setup lang="ts">
  import * as yup from 'yup'
  import YupPassword from 'yup-password'
  import { SignInDocument, SignUpDocument } from '@/graphql/gql/graphql'

  YupPassword(yup)

  const error = ref('')
  const isLogin = ref(true)

  const { values, handleSubmit } = useForm({
    validationSchema: toTypedSchema(
      yup.object({
        firstName: yup.string().trim().label('First Name'),
        lastName: yup.string().trim().label('Last Name'),
        email: yup.string().trim().email().required().label('Email'),
        password: yup.string().trim().password().required().label('Password'),
        password2: yup
          .string()
          .trim()
          .password()
          .label('Password 2')
          .oneOf([yup.ref('password')], 'Passwords must match'),
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
  const signin = handleSubmit((values) => {
    signinMutation({
      credentials: { email: values.email, password: values.password },
    })
    doneSignin(async (result) => {
      if (result.data!.signin.diatonicToken) {
        await navigateTo('/registrations')
      }
    })
    signinError(() => {
      error.value = 'Incorrect email or password.'
      resetFields()
    })
  })

  /**
   * Register new account and receive Token
   */
  const {
    mutate: signupMutation,
    onError: registerError,
    onDone: doneSignup,
  } = useMutation(SignUpDocument)
  const signup = handleSubmit((values) => {
    signupMutation({
      credentials: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      },
    })
    doneSignup(async (result) => {
      if (result.data!.signup.diatonicToken) {
        await navigateTo('/registrations')
      }
    })
    registerError((err) => {
      error.value = 'Error occured'
      console.log(err)
      resetFields()
    })
  })

  /**
   * Reset Email and Password Fields
   */
  function resetFields() {
    setTimeout(() => {
      values.firstName = ''
      values.lastName = ''
      error.value = ''
      values.email = ''
      values.password = ''
      values.password2 = ''
    }, 2500)
  }
</script>

<template>
  <div v-auto-animate>
    <div class="w-full sm:w-2/3 lg:w-1/2 mx-auto">
      <h2 class="text-center">Winnipeg Music Festival Registration</h2>
      <p class="text-left">
        Begin registration by creating an account (account can be for an
        individual; a teacher for all their individual students, or for all
        their choirs; a parent for their family etc.)
      </p>
      <!-- <div
				class="mx-auto text-center border-4 border-red-700 rounded-lg mt-4 p-4">
				<h3>Registration for the 2023 music festival is now closed.</h3>
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
      <div v-if="!isLogin">
        <h3 class="loginheading">Sign up</h3>
        <BaseInput
          v-model="values.firstName"
          name="firstName"
          type="text"
          label="First Name" />
        <BaseInput
          v-model="values.lastName"
          name="lastName"
          type="text"
          label="Last Name" />
      </div>
      <h3
        v-else
        class="loginheading">
        Sign in
      </h3>
      <BaseInput
        v-model="values.email"
        autocomplete="off"
        autofocus
        name="email"
        type="email"
        label="Email"
        @keyup.enter="isLogin ? signin() : signup()" />
      <BaseInput
        v-model="values.password"
        autocomplete="off"
        name="password"
        type="password"
        label="Password"
        @keyup.enter="isLogin ? signin() : signup()" />
      <BaseInput
        v-if="!isLogin"
        v-model="values.password2"
        autocomplete="off"
        name="password2"
        type="password"
        label="Re-enter Password"
        @keyup.enter="signup()" />

      <div v-if="isLogin">
        <BaseButton
          class="w-full m-0 btn btn-blue"
          @click="signin()">
          Log In
        </BaseButton>
        <BaseErrorMessage
          v-if="error"
          class="text-center text-lg"
          >{{ error }}</BaseErrorMessage
        >
        <br />
        <p class="text-center">
          <a
            class="hover:text-blue-600"
            href="#"
            @click="isLogin = !isLogin"
            >Need to register for an account?</a
          >
        </p>
      </div>
      <div v-else>
        <BaseButton
          class="w-full m-0 btn btn-blue"
          @click="signup()">
          Register New Account
        </BaseButton>
        <BaseErrorMessage
          v-if="error"
          class="text-center text-lg"
          >{{ error }}</BaseErrorMessage
        >
        <br />
        <p class="text-center">
          <a
            class="hover:text-blue-600"
            href="#"
            @click="isLogin = !isLogin"
            >Already have an account?</a
          >
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .loginheading {
    display: flex;
    justify-content: center;
  }
</style>
