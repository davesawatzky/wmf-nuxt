<script setup lang="ts">
  import { DateTime } from 'luxon'
  import _ from 'lodash'
  import {
    loadStripe,
    Stripe,
    StripeElements,
    StripePaymentElementOptions,
    StripeElementsOptionsClientSecret,
  } from '@stripe/stripe-js'
  import { usePerformers } from '@/stores/userPerformer'
  import { useTeacher } from '@/stores/userTeacher'
  import { useGroup } from '@/stores/userGroup'
  import { useSchool } from '@/stores/userSchool'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'
  import { useCommunity } from '@/stores/userCommunity'
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'
  import { useUser } from '@/stores/useUser'
  import { useAppStore } from '@/stores/appStore'

  const performerStore = usePerformers()
  const teacherStore = useTeacher()
  const groupStore = useGroup()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()
  const communityStore = useCommunity()
  const classesStore = useClasses()
  const appStore = useAppStore()
  const userStore = useUser()
  const registrationStore = useRegistration()
  let clientSec: string = ''

  const confirmationNumber = ref('')
  const submissionComplete = ref(false)
  const config = useRuntimeConfig()
  let stripe: Stripe | null
  const loading = ref(true)
  let elements: StripeElements

  function printWindow() {
    window.print()
  }

  const date = new Date()
  const formattedDate = DateTime.now().toLocaleString(DateTime.DATETIME_MED)

  definePageMeta({
    middleware: ['submission'],
  })

  onBeforeMount(() => {
    const regExist = registrationStore?.registrationId
    const confirmed = registrationStore.registration?.confirmation
    const submitted = registrationStore.registration?.submittedAt

    if (!regExist || confirmed || submitted) {
      navigateTo('/Registrations')
    }
  })

  onMounted(async () => {
    await initialize()
  })

  async function initialize() {
    const items = [{ id: 'xl-tshirt', amount: 12.99, currency: 'cad' }]
    console.log('Items: ', JSON.stringify({ items }))
    console.log(`${config.public.serverAddress}/payment/create-payment-intent`)

    const response = await useFetch(
      `${config.public.serverAddress}/payment/create-payment-intent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      }
    )
    const { clientSecret }: any = response.data.value
    clientSec = clientSecret

    const appearance = {
      theme: 'stripe',
    }
    stripe = await loadStripe(config.public.stripeKey)
    elements = stripe!.elements({
      appearance,
      clientSecret,
    } as StripeElementsOptionsClientSecret)

    const paymentElementOptions: StripePaymentElementOptions = {
      // layout: 'tabs',
    }
    const paymentElement = elements.create('payment', paymentElementOptions)
    paymentElement.mount('#payment-element')

    loading.value = false
  }

  async function handleSubmit(event: Event) {
    if (loading.value) return
    if (!stripe || !elements) {
      return
    }
    event.preventDefault()
    loading.value = true
    elements.submit()

    const {
      firstName,
      lastName,
      email,
      apartment,
      streetNumber,
      streetName,
      city,
      province,
      postalCode,
    } = userStore.user

    const { error } = await stripe!.confirmPayment({
      elements,
      clientSecret: clientSec,
      confirmParams: {
        return_url: `${config.public.apiBase}/Registrations`, // TODO: Change this to the return page
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      console.log(error.message)
    } else {
      console.log('An unexpected error occurred.')
    }

    loading.value = false
  }

  // Fetches the payment intent status after payment submission
  async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return
    }

    const { paymentIntent } = await stripe!.retrievePaymentIntent(clientSecret)

    switch (paymentIntent?.status) {
      case 'succeeded':
        console.log('Payment succeeded!')
        break
      case 'processing':
        console.log('Your payment is processing.')
        break
      case 'requires_payment_method':
        console.log('Your payment was not successful, please try again.')
        break
      default:
        console.log('Something went wrong.')
        break
    }
  }

  async function submitRegistration() {
    try {
      let dataSending = true
      confirmationNumber.value = `WMF-${
        registrationStore.registrationId
      }-${_.random(1000, 9999)}`
      registrationStore.registration.submittedAt = date
      registrationStore.registration.confirmation = confirmationNumber.value
      await registrationStore.updateRegistration()
      const payload = Object.assign(
        {},
        {
          performers: toRaw(performerStore.performers),
          teacher: toRaw(teacherStore.teacher),
          group: toRaw(groupStore.group),
          school: toRaw(schoolStore.school),
          schoolGroups: toRaw(schoolGroupStore.schoolGroup),
          community: toRaw(communityStore.community),
          registeredClasses: toRaw(classesStore.registeredClasses),
          performerType: toRaw(appStore.performerType),
          registration: toRaw(registrationStore.registration),
          userFirstName: toRaw(userStore.user.firstName),
          userLastName: toRaw(userStore.user.lastName),
          userEmail: toRaw(userStore.user.email),
        }
      )
      await useFetch('/api/send-email', { method: 'POST', body: payload })
      submissionComplete.value = true
      dataSending = false
    } catch (err) {
      console.log(err)
    }
  }
</script>

<template>
  <div v-auto-animate>
    <form
      id="payment-form"
      @submit="handleSubmit">
      <div id="payment-element">
        <!--Stripe.js injects the Payment Element-->
      </div>
      <button id="submit">
        <div
          class="spinner hidden"
          id="spinner"></div>
        <span id="button-text">Pay now</span>
      </button>
      <div
        id="payment-message"
        class="hidden"></div>
    </form>
    <p
      class="m-4 p-3 text-center font-bold text-xl bg-red-600 rounded-xl text-white">
      After submitting the form, a confirmation number will appear on the
      screen. <br />
      Please include this confirmation number when submitting payment.
    </p>
    <h4 class="pt-6 text-center">
      We look forward to having you participate in the this year's
    </h4>
    <h3 class="pb-6 text-center">Winnipeg Music Festival</h3>
    <div
      v-if="submissionComplete"
      class="pb-8">
      <strong>
        <h3 class="mx-auto">Confirmation Number</h3>
        <h3 class="mx-auto">{{ confirmationNumber }}</h3>
        <h4 class="mx-auto">{{ formattedDate }}</h4>
      </strong>
    </div>
    <BaseRouteButton
      v-if="submissionComplete"
      class="btn btn-blue h-14"
      to="/Registrations">
      Return to Registrations
    </BaseRouteButton>

    <BaseButton
      v-if="submissionComplete"
      class="btn btn-blue h-14"
      @click="printWindow">
      Print this page
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
  /* Variables */
  * {
    box-sizing: border-box;
  }

  form {
    width: 30vw;
    min-width: 500px;
    align-self: center;
    box-shadow:
      0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 7px;
    padding: 40px;
  }

  .hidden {
    display: none;
  }

  #payment-message {
    color: rgb(105, 115, 134);
    font-size: 16px;
    line-height: 20px;
    padding-top: 12px;
    text-align: center;
  }

  #payment-element {
    margin-bottom: 24px;
  }

  /* Buttons and links */
  button {
    background: #5469d4;
    font-family: Arial, sans-serif;
    color: #ffffff;
    border-radius: 4px;
    border: 0;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: block;
    transition: all 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
    width: 100%;
  }
  button:hover {
    filter: contrast(115%);
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  /* spinner/processing state, errors */
  .spinner,
  .spinner:before,
  .spinner:after {
    border-radius: 50%;
  }
  .spinner {
    color: #ffffff;
    font-size: 22px;
    text-indent: -99999px;
    margin: 0px auto;
    position: relative;
    width: 20px;
    height: 20px;
    box-shadow: inset 0 0 0 2px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }
  .spinner:before,
  .spinner:after {
    position: absolute;
    content: '';
  }
  .spinner:before {
    width: 10.4px;
    height: 20.4px;
    background: #5469d4;
    border-radius: 20.4px 0 0 20.4px;
    top: -0.2px;
    left: -0.2px;
    -webkit-transform-origin: 10.4px 10.2px;
    transform-origin: 10.4px 10.2px;
    -webkit-animation: loading 2s infinite ease 1.5s;
    animation: loading 2s infinite ease 1.5s;
  }
  .spinner:after {
    width: 10.4px;
    height: 10.2px;
    background: #5469d4;
    border-radius: 0 10.2px 10.2px 0;
    top: -0.1px;
    left: 10.2px;
    -webkit-transform-origin: 0px 10.2px;
    transform-origin: 0px 10.2px;
    -webkit-animation: loading 2s infinite ease;
    animation: loading 2s infinite ease;
  }

  @-webkit-keyframes loading {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes loading {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @media only screen and (max-width: 600px) {
    form {
      width: 80vw;
      min-width: initial;
    }
  }
</style>
