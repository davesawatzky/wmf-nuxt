<script setup lang="ts">
  import _ from 'lodash'
  import { DateTime } from 'luxon'
  import { usePerformers } from '@/stores/userPerformer'
  import { useTeacher } from '@/stores/userTeacher'
  import { useGroup } from '@/stores/userGroup'
  import { useSchool } from '@/stores/userSchool'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'
  import { useCommunity } from '@/stores/userCommunity'
  import { useClasses } from '@/stores/userClasses'
  import { useAppStore } from '@/stores/appStore'
  import { useRegistration } from '@/stores/userRegistration'
  import { useUser } from '@/stores/useUser'
  // import type { LocationQueryValue } from '#vue-router'

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
  const route = useRoute()

  const confirmationNumber = ref('')
  const stripePayment = appStore.stripePayment
  const paymentIntentStatus = ref() // failed, inProcess, succeeded, complete

  const date = new Date()
  const formattedDate = DateTime.now().toLocaleString(DateTime.DATETIME_MED)

  const performers = toValue(performerStore.performers)
  const teacher = toValue(teacherStore.teacher)
  const group = toValue(groupStore.group)
  const school = toValue(schoolStore.school)
  const schoolGroups = toValue(schoolGroupStore.schoolGroup)
  const community = toValue(communityStore.community)
  const registeredClasses = toValue(classesStore.registeredClasses)
  const performerType = toValue(appStore.performerType)
  const registration = toValue(registrationStore.registration)
  const userFirstName = toValue(userStore.user.firstName)
  const userLastName = toValue(userStore.user.lastName)
  const userEmail = toValue(userStore.user.email)

  function printWindow() {
    window.print()
  }

  onBeforeMount(() => {
    const regExist = registrationStore?.registrationId
    const confirmed = registrationStore.registration?.confirmation
    const submitted = registrationStore.registration?.submittedAt

    if (!regExist || confirmed || submitted) {
      navigateTo('/Registrations')
    }
  })

  onMounted(async () => {
    if (appStore.stripePayment === 'ccard') {
      await checkPaymentIntent()
    } else if (appStore.stripePayment === 'cash') {
      registrationStore.registration.transactionInfo = 'cash/cheque/e-transfer'
      onSuccess()
    }
  })

  async function checkPaymentIntent() {
    paymentIntentStatus.value = route.query.redirect_status
    switch (paymentIntentStatus.value) {
      case 'succeeded':
        registrationStore.registration.transactionInfo = 'succeeded'
        onSuccess()
        break
      case 'processing':
        registrationStore.registration.transactionInfo = 'processing'
        console.log(
          "Payment Processing.  We'll update you when payment is received."
        )
        break
      case 'requires_payment_method':
        registrationStore.registration.transactionInfo = 'failed'
        console.log('Payment failed.  Please try another payment method.')
        break
      case 'failed':
        registrationStore.registration.transactionInfo = 'failed'
        console.log('Payment failed.  Please try another payment method.')
        break
    }
  }

  async function onSuccess() {
    try {
      let dataSending = true
      confirmationNumber.value = `WMF-${
        registrationStore.registrationId
      }-${_.random(1000, 9999)}`
      registrationStore.registration.submittedAt = date
      registrationStore.registration.confirmation = confirmationNumber.value
      if (appStore.stripePayment === 'ccard') {
        registrationStore.registration.transactionInfo = 'ccard - succeeded'
        registrationStore.registration.payedAmt = Number(
          +registrationStore.registration.totalAmt +
            +registrationStore.processingFee
        ).toFixed(2)
      } else if (appStore.stripePayment === 'cash') {
        registrationStore.registration.transactionInfo =
          'cash/cheque/e-transfer'
        // registrationStore.registration.payedAmt = Number(
        //   registrationStore.registration.totalAmt
        // )
      }
      await registrationStore.updateRegistration()
      const payload = Object.assign(
        {},
        {
          performers,
          teacher,
          group,
          school,
          schoolGroups,
          community,
          registeredClasses,
          performerType,
          registration,
          userFirstName,
          userLastName,
          userEmail,
        }
      )
      await useFetch('/api/send-email', {
        watch: false,
        method: 'POST',
        body: payload,
      })
      dataSending = false
    } catch (err) {
      console.log(err)
    }
  }
</script>

<template>
  <div>
    <div
      v-if="paymentIntentStatus === 'succeeded' || stripePayment === 'cash'"
      class="pb-8">
      <strong>
        <h3 class="mx-auto">Confirmation Number</h3>
        <h3 class="mx-auto">{{ confirmationNumber }}</h3>
        <h4 class="mx-auto">{{ formattedDate }}</h4>
      </strong>

      <p
        v-if="stripePayment === 'cash'"
        class="m-4 p-3 text-center font-bold text-xl bg-red-600 rounded-xl text-white">
        Please include this confirmation number when submitting payment. This
        number will be required with any correspondence with the festival
        regarding your registration.
      </p>
      <p
        v-else-if="stripePayment === 'ccard'"
        class="m-4 p-3 text-center font-bold text-xl bg-red-600 rounded-xl text-white">
        Please mark down this confirmation number. This number will be required
        with any correspondence with the festival regarding your registration.
      </p>
      <p>
        An email has also been sent to you with a summary of your festival
        registration details. Make sure you have received this email.
      </p>
      <h4 class="pt-6 text-center">
        We look forward to having you participate in this year's
      </h4>
      <h3 class="pb-6 text-center">Winnipeg Music Festival</h3>
      <BaseRouteButton
        v-if="paymentIntentStatus === 'succeeded' || stripePayment === 'cash'"
        class="btn btn-blue"
        to="/Registrations">
        Return to Registrations
      </BaseRouteButton>

      <BaseButton
        v-if="paymentIntentStatus === 'succeeded' || stripePayment === 'cash'"
        class="btn btn-blue h-14"
        @click="printWindow">
        Print this page
      </BaseButton>
    </div>
    <div v-else-if="paymentIntentStatus === 'failed'">
      <h4>Payment failed</h4>
      <p>Please try your payment again with a different card.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
