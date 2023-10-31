<script setup lang="ts">
  import { loadStripe } from '@stripe/stripe-js'
  import type {
    Stripe,
    StripeElements,
    StripePaymentElementOptions,
    StripeElementsOptionsClientSecret,
  } from '@stripe/stripe-js'
  import { useToast } from 'vue-toastification'
  import { useRegistration } from '@/stores/userRegistration'
  import { useUser } from '@/stores/useUser'
  import { useAppStore } from '@/stores/appStore'

  const appStore = useAppStore()
  const userStore = useUser()
  const toast = useToast()
  const spinnerHidden = ref(true)
  const registrationStore = useRegistration()
  let clientSec: string = ''
  // const total = ref(0)

  const config = useRuntimeConfig()
  let stripe: Stripe | null
  const loading = ref(true)
  let elements: StripeElements

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

  onMounted(() => {
    initialize()
  })

  async function initialize() {
    const items = [
      {
        amount:
          Number(
            +registrationStore.registration.totalAmt +
              +registrationStore.processingFee
          ) * 100,
        currency: 'cad',
      },
    ]

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
      layout: {
        type: 'accordion',
        defaultCollapsed: false,
        radios: false,
        spacedAccordionItems: true,
      },
    }
    const linkAuthenticationElement = elements.create('linkAuthentication')
    linkAuthenticationElement.mount('#link-authentication-element')
    const paymentElement = elements.create('payment', paymentElementOptions)
    paymentElement.mount('#payment-element')

    loading.value = false
  }

  async function handleSubmit(event: Event) {
    event.preventDefault()
    if (loading.value) return

    loading.value = true
    spinnerHidden.value = false

    if (!stripe || !elements) {
      return
    }
    if (appStore.stripePayment === 'cash') {
      loading.value = false
      spinnerHidden.value = true
      await navigateTo('/submission/result')
      return
    }

    const {
      id,
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

    elements.submit()

    const { error } = await stripe!.confirmPayment({
      elements,
      clientSecret: clientSec,
      confirmParams: {
        return_url: `${config.public.apiBase}/submission/result`,
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
      toast.error('Error processing payment')
      console.log(error.message)
    }
    spinnerHidden.value = true
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

  const total = computed(() => {
    if (appStore.stripePayment === 'ccard') {
      return (
        +registrationStore.registration.totalAmt +
        +registrationStore.processingFee
      ).toFixed(2)
    } else if (appStore.stripePayment === 'cash') {
      return Number(registrationStore.registration.totalAmt).toFixed(2)
    }
  })
</script>

<template>
  <div v-auto-animate>
    <h1 class="my-8">Payment - Cash or Credit Card</h1>
    <p class="m-4 p-3 text-center font-bold text-xl rounded-xl">
      Please do not close your browser after submitting!
    </p>
    <form
      id="payment-form"
      @submit="handleSubmit">
      <div class="grid grid-cols-2 gap-4">
        <fieldset>
          <div class="p-6 border border-sky-700 rounded-lg bg-white">
            <div class="pb-4">
              <BaseRadio
                v-model="appStore.stripePayment"
                name="paymentType"
                label="Cash, Cheque, E-Transfer"
                value="cash" />
            </div>
            <ul class="list-disc p-4">
              <li>
                Payment may be made by cash, cheque, or e-transfer to the
                Winnipeg Music Festival (<a href="mailto:wmf@mts.net"
                  ><strong>wmf@mts.net</strong></a
                >).
              </li>
              <li>
                Registrations will not be considered submitted until payment is
                received.
              </li>
            </ul>
          </div>
          <div class="text-center font-bold text-xl py-3">OR</div>
          <div class="p-6 border border-sky-700 rounded-lg bg-white">
            <div class="pb-8">
              <BaseRadio
                v-model="appStore.stripePayment"
                name="paymentType"
                label="Pay by Credit Card"
                value="ccard" />
            </div>
            <div id="link-authentication-element">
              <!--Stripe.js injects the Payment Element-->
            </div>
            <div id="payment-element">
              <!--Stripe.js injects the Payment Element-->
            </div>
            <div
              id="payment-message"
              class=""></div>
          </div>
        </fieldset>
        <div>
          <div class="p-4 border border-sky-700 rounded-lg bg-white">
            <h4 class="mb-6">Final Amount</h4>
            <table class="table-fixed w-full">
              <tbody>
                <tr>
                  <td class="">Subtotal</td>
                  <td class="text-right">
                    ${{
                      Number(registrationStore.registration.totalAmt).toFixed(2)
                    }}
                  </td>
                </tr>
                <tr v-if="appStore.stripePayment === 'ccard'">
                  <td>Processing Fee</td>
                  <td class="text-right">
                    ${{ registrationStore.processingFee }}
                  </td>
                </tr>
                <tr class="font-bold border-t border-sky-700 pt-5">
                  <td class="pt-3">Total</td>
                  <td class="pt-3 text-right">${{ total }}</td>
                </tr>
              </tbody>
            </table>
            <button
              id="submit"
              class="mt-8">
              <div
                :class="spinnerHidden ? 'spinner hidden' : 'spinner'"
                id="spinner"></div>
              <span id="button-text">Submit Payment</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  /* Variables */
  * {
    box-sizing: border-box;
  }

  form {
    width: full;
    align-self: center;
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
