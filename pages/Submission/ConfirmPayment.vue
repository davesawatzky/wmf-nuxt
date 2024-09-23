<script setup lang="ts">
  const appStore = useAppStore()
  const registrationStore = useRegistration()

  type PaymentDetails = {
    amount: number
    stripeFee: number
    totalAmount: number
    confirmationToken: {
      payment_method_preview: {}
    }
  }
  // definePageMeta({
  //   middleware: 'submission',
  // })

  let response: PaymentDetails
  console.log('client token: ', appStore.stripeTokenId)

  if (appStore.stripePayment === 'ccard') {
    response = await $fetch('http://localhost:3000/payment/summarize-payment', {
      method: 'POST',
      body: {
        regId: registrationStore.registrationId,
        tokenId: appStore.stripeTokenId,
      },
    })
  }

  const paymentDetails = computed(() => {
    return response ?? {}
  })
</script>

<template>
  <div>Amount: {{ paymentDetails.amount }}</div>
  <div>Processing Fee: {{ paymentDetails.stripeFee }}</div>
  <div>Total Amount: {{ paymentDetails.totalAmount }}</div>
  <div>
    Billing Details:
    {{ paymentDetails.confirmationToken.payment_method_preview }}
  </div>
</template>

<style lang="css" scoped></style>
