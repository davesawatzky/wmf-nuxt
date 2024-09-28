<script setup lang="ts">
  import { loadStripe } from '@stripe/stripe-js'
  import type {
    Stripe,
    StripeElements,
    StripeElementsOptions,
    StripePaymentElementOptions,
  } from '@stripe/stripe-js'
  import { useToast } from 'vue-toastification'
  import { useRegistration } from '@/stores/userRegistration'
  import { useUser } from '@/stores/useUser'
  import { useAppStore } from '@/stores/appStore'

  const appStore = useAppStore()
  const userStore = useUser()
  const toast = useToast()
  const loading = ref(false)
  const spinnerHidden = ref(true)
  const registrationStore = useRegistration()
  const submitDisabled = ref(false)
  let clientSec: string = ''
  // const total = ref(0)

  const config = useRuntimeConfig()

  let elements: StripeElements

  definePageMeta({
    middleware: ['submission'],
  })

  onBeforeMount(async () => {
    const regExist = registrationStore?.registrationId
    const confirmed = registrationStore.registration?.confirmation
    const submitted = registrationStore.registration?.submittedAt
    if (!regExist || confirmed || submitted) await navigateTo('/Registrations')
  })

  const stripe: Stripe | null = await loadStripe(config.public.stripePubKey)

  const handleError = (error: any) => {
    toast.error(error.message)
    submitDisabled.value = false
    return
  }

  async function loadStripeElements() {
    loading.value = true
    const options: StripeElementsOptions = {
      mode: 'payment',
      amount: Math.round(+registrationStore.registration.totalAmt! * 100),
      currency: 'cad',
      appearance: { theme: 'stripe' },
    }

    elements = stripe!.elements(options)

    const paymentElementOptions: StripePaymentElementOptions = {
      layout: {
        type: 'accordion',
        defaultCollapsed: false,
        radios: false,
        spacedAccordionItems: true,
      },
    }
    const paymentElement = elements.create('payment', paymentElementOptions)
    paymentElement.mount('#payment-element')

    loading.value = false
  }

  async function handleSubmit(event: Event) {
    event.preventDefault()

    if (loading.value) return

    loading.value = true
    spinnerHidden.value = false

    if (!stripe || !elements) return

    if (appStore.stripePayment === 'cash') {
      loading.value = false
      spinnerHidden.value = true
      await navigateTo('/submission/result')
      return
    } else if (appStore.stripePayment === 'ccard') {
      if (submitDisabled.value) {
        return
      }

      submitDisabled.value = true

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

      const { error: submitError } = await elements.submit()
      if (submitError) {
        handleError(submitError)
        return
      }

      const { error: confirmTokenError, confirmationToken } =
        await stripe.createConfirmationToken({
          elements,
          params: {
            payment_method_data: {
              billing_details: {
                name: `${firstName} ${lastName}`,
              },
            },
          },
        })
      if (confirmTokenError) {
        handleError(confirmTokenError)
        return
      }
      appStore.stripeTokenId = confirmationToken.id

      spinnerHidden.value = true
      loading.value = false

      await navigateTo('/submission/ConfirmPayment')
    }
  }

  // Fetches the payment intent status after payment submission
  async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) return

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

  watch(
    () => appStore.stripePayment,
    async (newPaymentType) => {
      if (newPaymentType === 'ccard') {
        await loadStripeElements()
      }
    }
  )
</script>

<template>
  <div v-auto-animate>
    <h1 class="my-8">Payment - Cash or Credit Card</h1>
    <p class="m-4 p-3 text-center font-bold text-xl rounded-xl">
      Please do not close your browser after submitting!
    </p>
    <h3 class="text-center mb-8">Select method of payment</h3>
    <div class="text-center mb-8">
      <BaseButton
        class="btn w-[200px] h-[150px] text-xl font-semibold"
        :class="appStore.stripePayment === 'cash' ? 'btn-green' : 'btn-blue'"
        label="Cash, Cheque, E-Transfer"
        @click="appStore.stripePayment = 'cash'">
        Cash, Cheque, E-Transfer
      </BaseButton>
      <BaseButton
        class="btn w-[200px] h-[150px] text-xl font-semibold"
        :class="appStore.stripePayment === 'ccard' ? 'btn-green' : 'btn-blue'"
        label="Pay by Credit Card"
        @click="appStore.stripePayment = 'ccard'">
        Credit Card
      </BaseButton>
    </div>

    <form
      id="payment-form"
      @submit="handleSubmit">
      <div class="my-6 sm:mt-0">
        <div class="p-4 border border-sky-700 rounded-lg bg-white">
          <h4 class="mb-6">Final Amount</h4>
          <table class="table-fixed w-full">
            <tbody>
              <tr>
                <td class="">Total</td>
                <td class="text-right">
                  ${{
                    Number(registrationStore.registration.totalAmt).toFixed(2)
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <fieldset>
        <div
          v-auto-animate
          v-show="appStore.stripePayment === 'cash'"
          class="p-4 sm:p-6 border border-sky-700 rounded-lg bg-white">
          <ul class="list-disc">
            <li>
              Payment may be made by cash, cheque, or e-transfer to the Winnipeg
              Music Festival (<a href="mailto:wmf@mts.net"
                ><strong>wmf@mts.net</strong></a
              >).
            </li>
            <li>
              Registrations will not be considered submitted until payment is
              received.
            </li>
          </ul>
        </div>

        <div
          v-auto-animate
          v-show="appStore.stripePayment === 'ccard'"
          class="p-4 sm:p-6 border border-sky-700 rounded-lg bg-white">
          <div class="pb-8"></div>
          <div id="payment-element">
            <!-- Stripe.js injects the Payment Element -->
          </div>
          <div
            id="payment-message"
            class="" />
        </div>
      </fieldset>

      <div class="text-center">
        <BaseButton
          :disabled="submitDisabled"
          type="submit"
          id="submit"
          class="mt-8 btn btn-blue w-[200px] h-[75px]">
          <div
            id="spinner"
            :class="spinnerHidden ? 'spinner hidden' : 'spinner'" />
          <span id="button-text">Submit Payment</span>
        </BaseButton>
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
      /* width: 80vw; */
      min-width: initial;
    }
  }
</style>
