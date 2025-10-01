<script setup lang="ts">
  import { DateTime } from 'luxon'

  type Confirmed = {
    importantNotes: boolean
    nonrefundable: boolean
    parentGuardian: boolean
    rulesAndTrophyForms: boolean
  }

  const performerStore = usePerformers()
  const registrationStore = useRegistration()

  const submissionComplete = ref(false)
  const readConfirmation = ref<Confirmed>({
    importantNotes: false,
    nonrefundable: false,
    parentGuardian: false,
    rulesAndTrophyForms: false,
  })

  const photoPermission = ref(false)

  const proceedToPayment = computed(() => {
    for (const key in readConfirmation.value) {
      if (!readConfirmation.value[key as keyof Confirmed]) {
        return false
      }
    }
    return true
  })

  function checkIfParentConsentRequired() {
    if (registrationStore.registration.performerType === 'SOLO') {
      if (performerStore.performers[0]?.age! < 18) {
        return true
      } else {
        readConfirmation.value.parentGuardian = true
        return false
      }
    } else {
      readConfirmation.value.parentGuardian = true
    }
  }

  function printWindow() {
    window.print()
  }

  const date = new Date()
  const formattedDate = DateTime.now().toLocaleString(DateTime.DATETIME_MED)

  definePageMeta({
    middleware: ['user', 'submission'],
  })

  onBeforeMount(async () => {
    const regExist = registrationStore?.registrationId
    const confirmed = registrationStore.registration?.confirmation
    const submitted = registrationStore.registration?.submittedAt

    if (!regExist || confirmed || submitted) {
      await navigateTo('/Registrations')
    }
  })
</script>

<template>
  <div v-auto-animate>
    <h1 class="my-8">Registration Submission</h1>
    <SummaryTable />
    <section class="p-4 border-sky-700 bg-white border rounded-xl">
      <p class="text-center font-bold text-xl">Important Notes</p>

      <p>
        The Festival reserves the right to redirect entries to a more
        appropriate class. These redirections will be listed in the studio
        registration confirmation mailing sent to teachers.
      </p>
      <p>
        If you have not done so already, please print the summary page for your
        own records. You may return to this site in the future to view the
        summary of your submission. In case of any discrepencies between the
        information in this registration form and the official syllabus, the
        official syllabus will always be considered correct.
      </p>
      <p>
        Once submitted, a confirmation number will be displayed on the screen.
        Please take note of this for your records. This number may be requested
        with any communication regarding your application. No changes will be
        permitted once the entry has been submitted. Incomplete entries will not
        be accepted.
      </p>
      <p>
        Confirmation of registered participant entries including class,
        selection and composer will be sent to the teachers for verification.
        Festival programs including dates, times and locations will be available
        for purchase for $10 with an anticipated availability February 1, 2026.
        Participants and teachers are to notify the Festival office of any
        change of personal information following submission of entry form.
        Participants who wish to withdraw must notify the Festival office in
        writing as early as possible. Entry fees are non-refundable.
      </p>
      <BaseCheckbox
        id="important-notes"
        v-model="readConfirmation.importantNotes"
        label="I have read and understand the above text." />
      <BaseCheckbox
        id="nonrefundable"
        v-model="readConfirmation.nonrefundable"
        label="I understand that ENTRY FEES ARE NON-REFUNDABLE." />
      <BaseCheckbox
        v-if="checkIfParentConsentRequired()"
        id="parent-guardian"
        v-model="readConfirmation.parentGuardian"
        label="If participant is under 18 then I certify that I am the parent/guardian of this child." />
      <BaseCheckbox
        id="rules-and-trophy-forms"
        v-model="readConfirmation.rulesAndTrophyForms"
        label="I have read all applicable rules and trophy eligibility forms as found on the music festival website." />
    </section>

    <br >

    <div class="text-center">
      <BaseRouteButton
        v-if="!submissionComplete"
        class="btn btn-blue"
        to="Registrations">
        Cancel
      </BaseRouteButton>
      <BaseRouteButton
        v-if="!submissionComplete"
        class="btn btn-blue"
        :disabled="!proceedToPayment"
        to="/Submission/payment">
        Proceed to Payment
      </BaseRouteButton>
    </div>
  </div>
</template>

<style scoped></style>
