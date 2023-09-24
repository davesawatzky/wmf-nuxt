<script setup lang="ts">
  import { DateTime } from 'luxon'
  import _ from 'lodash'
  import { usePerformers } from '@/stores/userPerformer'
  import { useTeacher } from '@/stores/userTeacher'
  import { useGroup } from '@/stores/userGroup'
  import { useSchool } from '@/stores/userSchool'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'
  import { useCommunity } from '@/stores/userCommunity'
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'
  import { useAppStore } from '@/stores/appStore'
  import { formErrors } from '@/composables/formErrors'

  const performerStore = usePerformers()
  const teacherStore = useTeacher()
  const groupStore = useGroup()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()
  const communityStore = useCommunity()
  const classesStore = useClasses()
  const appStore = useAppStore()
  const registrationStore = useRegistration()

  const confirmationNumber = ref('')
  const submissionComplete = ref(false)
  const readConfirmation = ref(false)

  function printWindow() {
    window.print()
  }

  const date = new Date()
  const formattedDate = DateTime.now().toLocaleString(DateTime.DATETIME_MED)

  definePageMeta({
    middleware: 'auth',
  })

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
          userFirstName: toRaw(registrationStore.user.firstName),
          userLastName: toRaw(registrationStore.user.lastName),
          userEmail: toRaw(registrationStore.user.email),
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
  <div>
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
      <p>
        Payment may be made by cheque or e-transfer to the Winnipeg Music
        Festival (<a href="mailto:wmf@mts.net"><strong>wmf@mts.net</strong></a
        >).
      </p>
    </section>
    <p
      class="m-4 p-3 text-center font-bold text-xl bg-red-600 rounded-xl text-white">
      Please include the confirmation number when submitting payment.
    </p>
    <p class="text-center font-bold text-xl">Entry fees are non-refundable.</p>
    <div
      class="text-center mx-auto max-w-[400px] border border-sky-600 rounded-lg p-4 bg-white">
      <BaseCheckbox
        v-model="readConfirmation"
        label="I have read and understand the preceding text."></BaseCheckbox>
    </div>
    <br />
    <h4 class="pt-6 text-center">
      We look forward to having you participate in the this year's
    </h4>
    <h3 class="pb-6 text-center">Winnipeg Music Festival</h3>
    <div class="text-center">
      <BaseButton
        v-if="!submissionComplete"
        class="btn btn-blue"
        :disabled="!readConfirmation"
        @click="submitRegistration">
        Submit Application
      </BaseButton>
      <BaseRouteButton
        v-if="!submissionComplete"
        class="btn btn-blue"
        to="Registrations">
        Cancel
      </BaseRouteButton>
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
        to="Registrations">
        Return to Registrations
      </BaseRouteButton>
      <BaseButton
        v-if="submissionComplete"
        class="btn btn-blue h-14"
        @click="printWindow">
        Print this page
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
