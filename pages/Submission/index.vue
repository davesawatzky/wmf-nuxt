<script setup lang="ts">
  import { DateTime } from 'luxon'
  // import { usePerformers } from '@/stores/userPerformer'
  // import { useTeacher } from '@/stores/userTeacher'
  // import { useGroup } from '@/stores/userGroup'
  // import { useSchool } from '@/stores/userSchool'
  // import { useSchoolGroup } from '@/stores/userSchoolGroup'
  // import { useCommunity } from '@/stores/userCommunity'
  // import { useClasses } from '@/stores/userClasses'
  // import { useRegistration } from '@/stores/userRegistration'
  // import { useUser } from '@/stores/useUser'
  // import { useAppStore } from '@/stores/appStore'

  type Confirmed = {
    importantNotes: boolean
    nonrefundable: boolean
    parentGuardian: boolean
    photoPermission: boolean
    rulesAndTrophyForms: boolean
  }

  const performerStore = usePerformers()
  // const teacherStore = useTeacher()
  // const groupStore = useGroup()
  // const schoolStore = useSchool()
  // const schoolGroupStore = useSchoolGroup()
  // const communityStore = useCommunity()
  // const communityGroupStore = useCommunityGroup()
  // const classesStore = useClasses()
  // const appStore = useAppStore()
  // const userStore = useUser()
  const registrationStore = useRegistration()

  const confirmationNumber = ref('')
  const submissionComplete = ref(false)
  const readConfirmation = ref(<Confirmed>{
    importantNotes: false,
    nonrefundable: false,
    parentGuardian: false,
    photoPermission: false,
    rulesAndTrophyForms: false,
  })

  const proceedToPayment = computed(() => {
    for (const key in readConfirmation.value) {
      if (!readConfirmation.value[key as keyof Confirmed]) {
        return false
      }
    }
    return true
  })

  const checkIfParentConsentRequired = computed(() => {
    if (registrationStore.registration.performerType === 'SOLO') {
      if (performerStore.performers[0].age! < 18) {
        return true
      } else {
        readConfirmation.value.parentGuardian = true
        return false
      }
    } else if (registrationStore.registration.performerType === 'GROUP') {
    }
  })

  function printWindow() {
    window.print()
  }

  const date = new Date()
  const formattedDate = DateTime.now().toLocaleString(DateTime.DATETIME_MED)

  definePageMeta({
    middleware: ['submission'],
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
        Notification, including date, time and location of each class will be
        forwarded to the participant's teacher prior to the publication of the
        program. Teachers are responsible to advise their students of this
        information and to notify the office of any errors. Participants and
        teachers are to notify the Festival office of any change of personal
        information following submission of entry form. Participants who wish to
        withdraw must notify the Festival office in writing as early as
        possible.
      </p>
      <BaseCheckbox
        v-model="readConfirmation.importantNotes"
        label="I have read and understand the above text." />
      <BaseCheckbox
        v-model="readConfirmation.nonrefundable"
        label="I understand that ENTRY FEES ARE NON-REFUNDABLE." />
      <BaseCheckbox
        v-if="checkIfParentConsentRequired"
        v-model="readConfirmation.parentGuardian"
        label="If participant is under 18 then I certify that I am the parent/guardian of this child." />
      <BaseCheckbox
        v-model="readConfirmation.photoPermission"
        label="I give permission for the Festival to use photographs of this participant in marketing materials." />
      <BaseCheckbox
        v-model="readConfirmation.rulesAndTrophyForms"
        label="I have read all applicable rules and trophy eligibility forms as found on the music festival website." />
    </section>

    <br />

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
