<script setup lang="ts">
  import { loadStripe } from '@stripe/stripe-js'
  import _ from 'lodash'
  import type {
    Stripe,
    StripeElements,
    StripeElementsOptions,
    StripePaymentElementOptions,
  } from '@stripe/stripe-js'
  import { useToast } from 'vue-toastification'

  const appStore = useAppStore()
  const registrationStore = useRegistration()
  const config = useRuntimeConfig()
  const submitDisabled = ref(false)
  const toast = useToast()

  type DeepObject = {
    [key: string]: string | number | DeepObject
  }

  type PaymentDetails = {
    amount: number
    stripeFee: string
    totalAmount: number
    confirmationToken: {
      payment_method_preview: {
        name: string
        email: string | null
        address: {
          city: string | null
          state: string | null
          country: string | null
          postal_code: string | null
        }
      }
    }
  }

  definePageMeta({
    middleware: 'submission',
  })

  const stripe: Stripe | null = await loadStripe(config.public.stripePubKey)

  const handleError = (error: any) => {
    toast.error(error.message)
    submitDisabled.value = false
    return
  }

  let response: any

  if (appStore.stripePayment === 'ccard') {
    response = await $fetch<PaymentDetails>(
      `${config.public.serverAddress}/payment/summarize-payment`,
      {
        method: 'POST',
        body: {
          regId: registrationStore.registrationId,
          tokenId: appStore.stripeTokenId,
        },
      }
    )
  }

  const paymentDetails = computed(() => {
    return response ?? {}
  })

  async function confirmPayment() {
    submitDisabled.value = true
    registrationStore.registration.confirmation = WMFNumber(registrationStore.registrationId)
    const PaymentIntent: any = await $fetch(
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
    const { totalPayment, client_secret: clientSecret }: any = PaymentIntent

    registrationStore.registration.payedAmt = +totalPayment / 100

    const { error } = await stripe!.confirmPayment({
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
    if (error) {
      handleError(error)
    }
  }

async function cancelPayment() {
    toast.info('Payment cancelled')
    await navigateTo('/registrations')
  }
</script>

<template>
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
                .display_brand
            ">
            <td>Card Type</td>
            <td class="text-right">
              {{
                paymentDetails.confirmationToken.payment_method_preview.card.display_brand.toUpperCase()
              }}
            </td>
          </tr>
          <tr
            v-if="
              paymentDetails.confirmationToken.payment_method_preview.card
                .country
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
                .exp_month
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
                .exp_year
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
              paymentDetails.confirmationToken.payment_method_preview.card.last4
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
</template>

<style lang="css" scoped></style>
