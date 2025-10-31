<script setup lang="ts">
  import _ from 'lodash'
  import { loadStripe } from '@stripe/stripe-js'
  import type {
    Stripe,
    StripeElements,
    StripeElementsOptions,
    StripeError,
    StripePaymentElementOptions,
  } from '@stripe/stripe-js'
  import { useToast } from 'vue-toastification'
  import { useRegistration } from '~/stores/useRegistration'
  import { useUser } from '~/stores/useUser'
  import { useAppStore } from '~/stores/appStore'

  const appStore = useAppStore()
  const userStore = useUser()
  const toast = useToast()
  const loading = ref(false)
  const spinnerHidden = ref(true)
  const registrationStore = useRegistration()
  const submitDisabled = ref(true)

  const config = useRuntimeConfig()

  let elements: StripeElements

  definePageMeta({
    middleware: ['user', 'submission'],
  })

  onBeforeMount(async () => {
    const regExist = registrationStore?.registrationId
    const confirmed = registrationStore.registration?.confirmation
    const submitted = registrationStore.registration?.submittedAt
    if (!regExist || confirmed || submitted) await navigateTo('/Registrations')
  })

  const stripe: Stripe | null = await loadStripe(config.public.stripePubKey)

  const handleError = (error: StripeError) => {
    toast.error(error.message)
    submitDisabled.value = false
    loading.value = false
    spinnerHidden.value = true
    return
  }

  const totalAmount = computed(() => {
    return registrationStore.registration.totalAmt
  })

  async function loadStripeElements() {
    if (!stripe) {
      console.error('Stripe not initialized')
      toast.error('Payment system not available')
      return false
    }

    loading.value = true

    try {
      if (!totalAmount.value || totalAmount.value <= 0) {
        throw new Error('Invalid payment amount')
      }

      const options: StripeElementsOptions = {
        mode: 'payment',
        amount: Math.round(totalAmount.value * 100),
        currency: 'cad',
        appearance: { theme: 'stripe' },
      }

      elements = stripe.elements(options)

      const paymentElementOptions: StripePaymentElementOptions = {
        layout: {
          type: 'accordion',
          defaultCollapsed: false,
          radios: false,
          spacedAccordionItems: true,
        },
      }

      const paymentElement = elements.create('payment', paymentElementOptions)
      await paymentElement.mount('#payment-element')

      return true
    } catch (error) {
      console.error('Failed to load Stripe Elements:', error)
      toast.error('Failed to initialize payment form. Please refresh the page.')
      return false
    } finally {
      loading.value = false
    }
  }

  function selectCashPayment() {
    appStore.stripePayment = 'cash'
    submitDisabled.value = false
  }

  async function selectCreditCardPayment() {
    appStore.stripePayment = 'ccard'
    submitDisabled.value = true
    const success = await loadStripeElements()
    submitDisabled.value = !success
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()

    if (loading.value) return

    loading.value = true
    spinnerHidden.value = false

    try {
      if (appStore.stripePayment === 'cash') {
        registrationStore.registration.confirmation = WMFNumber(
          registrationStore.registrationId
        )
        await navigateTo('/Submission/result')
        return
      }

      if (appStore.stripePayment === 'ccard') {
        if (!stripe || !elements) {
          console.error('Stripe not initialized for payment submission', {
            operation: 'handleSubmit',
            hasStripe: !!stripe,
            hasElements: !!elements,
          })
          toast.error('Payment system not ready. Please refresh and try again.')
          return
        }

        submitDisabled.value = true

        const { firstName, lastName } = userStore.user

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

        await navigateTo('/Submission/ConfirmPayment')
      }
    } catch (error) {
      // Catch unexpected errors (network failures, navigation errors, etc.)
      console.error('Unexpected error during payment submission:', error, {
        operation: 'handleSubmit',
        paymentType: appStore.stripePayment,
        registrationId: registrationStore.registrationId,
        userId: userStore.user?.id,
        amount: totalAmount.value,
      })

      toast.error(
        'An unexpected error occurred. Please try again or contact support.'
      )
      submitDisabled.value = false
    } finally {
      loading.value = false
      spinnerHidden.value = true
    }
  }

  // Load Stripe Elements if credit card payment is already selected
  onMounted(async () => {
    if (appStore.stripePayment === 'ccard') {
      const success = await loadStripeElements()
      submitDisabled.value = !success
    }
  })
</script>

<template>
  <div v-auto-animate>
    <h1 class="my-8">Payment - Cash, Cheque, E-Transfer, or Credit Card</h1>
    <p class="m-4 p-3 text-center font-bold text-xl rounded-xl">
      Please do not close your browser after submitting!
    </p>
    <h3 class="text-center mb-8">Select method of payment</h3>
    <div class="text-center mb-8">
      <BaseButton
        class="btn w-[200px] h-[150px] text-xl font-semibold"
        :class="appStore.stripePayment === 'cash' ? 'btn-green' : 'btn-blue'"
        label="Cash, Cheque, E-Transfer"
        @click="selectCashPayment">
        Cash, Cheque, E-Transfer
      </BaseButton>
      <BaseButton
        class="btn w-[200px] h-[150px] text-xl font-semibold"
        :class="appStore.stripePayment === 'ccard' ? 'btn-green' : 'btn-blue'"
        label="Pay by Credit Card"
        @click="selectCreditCardPayment">
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
          v-show="appStore.stripePayment === 'cash'"
          v-auto-animate
          class="p-4 sm:p-6 border border-sky-700 rounded-lg bg-white">
          <ul class="list-disc">
            <li>
              Payment may be made by cash, cheque, or e-transfer to the Winnipeg
              Music Festival (<a
                class="text-sky-600"
                href="mailto:wmf@mymts.net"
                ><strong>wmf@mymts.net</strong></a
              >).
            </li>
            <li>
              Registrations will not be considered submitted until payment is
              received.
            </li>
          </ul>
        </div>

        <div
          v-show="appStore.stripePayment === 'ccard'"
          v-auto-animate
          class="p-4 sm:p-6 border border-sky-700 rounded-lg bg-white">
          <div class="pb-8" />
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
          id="submit"
          :disabled="submitDisabled"
          type="submit"
          class="mt-8 btn btn-blue w-[200px] h-[75px] relative">
          <div class="flex items-center justify-center gap-3">
            <div
              id="spinner"
              :class="spinnerHidden ? 'spinner hidden' : 'spinner'" />
            <span id="button-text">Submit Payment</span>
          </div>
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

  .non-hidden {
    display: inline-block;
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
  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
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
