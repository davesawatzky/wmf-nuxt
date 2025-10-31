<script setup lang="ts">
  import { loadStripe } from '@stripe/stripe-js'
  import _ from 'lodash'
  import type {
    Stripe,
    StripeError,
    ConfirmationToken,
    PaymentIntent,
  } from '@stripe/stripe-js'
  import { useToast } from 'vue-toastification'

  const appStore = useAppStore()
  const registrationStore = useRegistration()
  const config = useRuntimeConfig()
  const submitDisabled = ref(false)
  const toast = useToast()

  interface CreatePaymentIntentResponse {
    totalPayment: number
    client_secret: string
    // Add other fields returned by your backend
  }

  type PaymentSummaryResponse = {
    amount: number
    stripeFee: string
    totalAmount: number
    confirmationToken: Pick<ConfirmationToken, 'payment_method_preview'> & {
      payment_method_preview: {
        type: string
        billing_details: {
          name: string | null
          email: string | null
          address: {
            city: string | null
            state: string | null
            country: string | null
            postal_code: string | null
          } | null
        }
        card?: {
          brand: string
          country: string
          exp_month: number
          exp_year: number
          last4: string
        }
      }
    }
  }

  definePageMeta({
    middleware: ['user', 'submission'],
  })

  const stripe: Stripe | null = await loadStripe(config.public.stripePubKey)

  const handleError = async (error: StripeError) => {
    toast.error(error.message ?? 'An unknown error occurred.')
    submitDisabled.value = false
    await navigateTo('/Submission/payment')
    return
  }

  let response: PaymentSummaryResponse | undefined

  if (appStore.stripePayment === 'ccard') {
    try {
      response = await $fetch<PaymentSummaryResponse>(
        `${config.public.serverAddress}/payment/summarize-payment`,
        {
          method: 'POST',
          body: {
            regId: registrationStore.registrationId,
            tokenId: appStore.stripeTokenId,
          },
        }
      )
    } catch (error) {
      console.error('Failed to summarize payment:', error)
      toast.error('Failed to fetch payment summary. Please try again.')
      submitDisabled.value = false
    }
  }

  const paymentDetails = computed(() => {
    return response ?? ({} as PaymentSummaryResponse)
  })

  async function confirmPayment() {
    if (!stripe) {
      toast.error('Stripe has not been initialized.')
      return
    }

    submitDisabled.value = true
    registrationStore.registration.confirmation = WMFNumber(
      registrationStore.registrationId
    )

    try {
      const paymentIntentResponse = await $fetch<CreatePaymentIntentResponse>(
        `${config.public.serverAddress}/payment/create-payment-intent`,
        {
          method: 'POST',
          body: {
            regId: registrationStore.registrationId,
            WMFconfirmationId: registrationStore.registration.confirmation,
            tokenId: appStore.stripeTokenId,
          },
        }
      )
      const { totalPayment, client_secret: clientSecret } =
        paymentIntentResponse

      registrationStore.registration.payedAmt = +totalPayment / 100

      const result = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          confirmation_token: appStore.stripeTokenId,
          return_url: `${config.public.apiBase}/submission/result`,
        },
      })

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (result.error) {
        console.error('Stripe payment confirmation failed', {
          error_type: result.error.type,
          error_code: result.error.code,
          decline_code: result.error.decline_code,
          payment_intent_id: result.error.payment_intent?.id,
          registration_id: registrationStore.registrationId,
        })
        handleError(result.error)
        return
      }

      // If we reach here without redirect, the payment succeeded without requiring action
      // This is rare but can happen for certain payment methods
      const paymentIntent = (
        'paymentIntent' in result ? result.paymentIntent : null
      ) as PaymentIntent | null
      if (paymentIntent) {
        console.info('PaymentIntent confirmed locally:', {
          id: paymentIntent.id,
          status: paymentIntent.status,
        })
      }

      // await registrationStore.updateRegistration()

      // This point will only be reached if there is an immediate error
      // Otherwise, customer will be redirected to return_url
    } catch (err) {
      console.error('Payment confirmation failed:', err)
      toast.error('Payment confirmation failed. Please try again.')
      submitDisabled.value = false
    }
  }

  async function cancelPayment() {
    toast.info('Payment cancelled')
    await navigateTo('/registrations')
  }
</script>

<template>
  <div>
    <div class="my-6 sm:mt-0">
      <div
        class="p-4 mx-auto max-w-[400px] border border-sky-700 rounded-lg bg-white">
        <h4 class="mb-6">Final Amount</h4>
        <table class="table-fixed w-full">
          <tbody>
            <tr>
              <td class="">Subtotal</td>
              <td class="text-right">
                ${{ Number(paymentDetails.amount).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td class="">Processing Fee</td>
              <td class="text-right">
                ${{ Number(paymentDetails.stripeFee).toFixed(2) }}
              </td>
            </tr>
            <tr class="font-bold border-t border-sky-700">
              <td class="">Total</td>
              <td class="text-right">
                ${{ Number(paymentDetails.totalAmount).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="my-6 sm:mt-0">
      <div
        class="p-4 mx-auto max-w-[400px] border border-sky-700 rounded-lg bg-white">
        <h4 class="mb-6">Billing Details</h4>
        <table class="table-fixed w-full">
          <tbody>
            <tr
              v-if="
                paymentDetails.confirmationToken.payment_method_preview
                  .billing_details.name
              ">
              <td>Name</td>
              <td class="text-right">
                {{
                  paymentDetails.confirmationToken.payment_method_preview
                    .billing_details.name
                }}
              </td>
            </tr>
            <tr
              v-if="
                paymentDetails.confirmationToken.payment_method_preview.card
                  ?.brand
              ">
              <td>Card Type</td>
              <td class="text-right">
                {{
                  paymentDetails.confirmationToken.payment_method_preview.card.brand.toUpperCase()
                }}
              </td>
            </tr>
            <tr
              v-if="
                paymentDetails.confirmationToken.payment_method_preview.card
                  ?.country
              ">
              <td>Issuing Country</td>
              <td class="text-right">
                {{
                  paymentDetails.confirmationToken.payment_method_preview.card
                    .country
                }}
              </td>
            </tr>
            <tr
              v-if="
                paymentDetails.confirmationToken.payment_method_preview.card
                  ?.exp_month
              ">
              <td>Exp. Month</td>
              <td class="text-right">
                {{
                  paymentDetails.confirmationToken.payment_method_preview.card
                    .exp_month
                }}
              </td>
            </tr>
            <tr
              v-if="
                paymentDetails.confirmationToken.payment_method_preview.card
                  ?.exp_year
              ">
              <td>Exp. Year</td>
              <td class="text-right">
                {{
                  paymentDetails.confirmationToken.payment_method_preview.card
                    .exp_year
                }}
              </td>
            </tr>
            <tr
              v-if="
                paymentDetails.confirmationToken.payment_method_preview.card
                  ?.last4
              ">
              <td>Last 4 Digits</td>
              <td class="text-right">
                {{
                  paymentDetails.confirmationToken.payment_method_preview.card
                    .last4
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="text-center">
      <BaseButton
        class="btn btn-red"
        :disabled="submitDisabled"
        @click="cancelPayment()">
        Cancel
      </BaseButton>
      <BaseButton
        class="btn btn-blue"
        :disabled="submitDisabled"
        @click="confirmPayment()">
        Confirm
      </BaseButton>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
