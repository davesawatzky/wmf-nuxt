<script lang="ts" setup>
  import { DateTime } from 'luxon'
  import { useRegistration } from '@/stores/userRegistration'
  import { useAppStore } from '@/stores/appStore'
  import { usePerformers } from '@/stores/userPerformer'
  import { useTeacher } from '@/stores/userTeacher'
  import { useClasses } from '@/stores/userClasses'
  import { useGroup } from '@/stores/userGroup'
  import { useSchool } from '@/stores/userSchool'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'
  import { useCommunity } from '@/stores/userCommunity'
  import { useFieldConfig } from '@/stores/useFieldConfig'
  import {
    communityOpen,
    groupOpen,
    schoolOpen,
    soloOpen,
  } from '@/composables/openClosed'
  import type { Registration, RegistrationInput } from '@/graphql/gql/graphql'
  import {
    PerformerType,
    RegistrationsDocument,
    MyUserDocument,
  } from '@/graphql/gql/graphql'

  const soloPhoto = '/images/opera-singer-on-stage.png'
  const soloPhotoBW = '/images/opera-singer-on-stage-BW.png'
  const groupPhoto = '/images/strings.png'
  const groupPhotoBW = '/images/strings-BW.png'
  const schoolPhoto = '/images/orff-instruments.png'
  const schoolPhotoBW = '/images/orff-instruments-BW.png'
  const communityPhoto = '/images/community_choir.png'
  const communityPhotoBW = '/images/community_choir-BW.png'

  const registrationStore = useRegistration()
  const appStore = useAppStore()
  const performerStore = usePerformers()
  const teacherStore = useTeacher()
  const groupStore = useGroup()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()
  const communityStore = useCommunity()
  const classesStore = useClasses()
  const fieldConfigStore = useFieldConfig()
  const config = useRuntimeConfig()

  const registrationId = ref(0)

  const sm = useMediaQuery('(min-width: 640px)')
  const md = useMediaQuery('(min-width: 768px)')
  const lg = useMediaQuery('(min-width: 1024px)')

  function dateFunction(date: Date | undefined) {
    if (date) {
      const dateString = date.toString()
      return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED)
    }
  }

  onBeforeMount(() => {
    registrationStore.$reset()
    appStore.$reset()
    performerStore.$reset()
    teacherStore.$resetTeacher()
    teacherStore.$resetAllTeachers()
    groupStore.$reset()
    communityStore.$reset()
    schoolStore.$reset()
    schoolGroupStore.$reset()
    classesStore.$reset()
    fieldConfigStore.$reset()
  })

  /**
   * Load User details
   */
  onMounted(() => {
    const {
      result,
      onResult: onUserResult,
      onError: userError,
    } = useQuery(MyUserDocument, null, () => ({
      fetchPolicy: 'no-cache',
    }))
    onUserResult((result) => {
      registrationStore.addUserToStore(result.data.myUser)
    })
    userError((error) => console.log(error))
  })

  /**
   * Load all registrations for user
   */
  const {
    result,
    refetch: refetchRegistrations,
    onError,
  } = useQuery(RegistrationsDocument, null, () => ({
    fetchPolicy: 'no-cache',
  }))
  onError((error) => console.log(error))

  const registrations = computed(() => result.value?.registrations ?? [])

  function openEditor(performerType: PerformerType): boolean {
    // eslint-disable-next-line no-eval
    return !!eval(`${performerType.toLowerCase()}Open`)
  }

  /**
   * Resend confirmation link
   */
  async function resend() {
    try {
      const { error } = await useFetch(config.public.resendConfirmation, {
        method: 'POST',
        body: {
          user: {
            firstName: registrationStore.user.firstName,
            lastName: registrationStore.user.lastName,
            email: registrationStore.user.email,
          },
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Load and Edit Existing Registration
   *
   * @param registrationId The ID of the registration form
   * @param performerType SOLO, GROUP, SCHOOL, or COMMUNITY
   */
  async function loadRegistration(
    registrationId: number,
    performerType: PerformerType
  ) {
    const registration = registrations.value.find((reg) => {
      return reg.id === registrationId
    })

    registrationStore.registrationId = registrationId
    registrationStore.addToStore(
      registration as Partial<Registration & RegistrationInput>
    )
    switch (performerType) {
      case 'SOLO':
        appStore.performerType = PerformerType.SOLO
        appStore.dataLoading = true
        await performerStore.loadPerformers(registrationId)
        appStore.dataLoading = false
        break
      case 'GROUP':
        appStore.performerType = PerformerType.GROUP
        appStore.dataLoading = true
        await groupStore.loadGroup(registrationId)
        await performerStore.loadPerformers(registrationId)
        appStore.dataLoading = false
        break
      case 'SCHOOL':
        appStore.performerType = PerformerType.SCHOOL
        appStore.dataLoading = true
        await schoolStore.loadSchool(registrationId)
        await schoolGroupStore.loadSchoolGroups(registrationId)
        appStore.dataLoading = false
        break
      case 'COMMUNITY':
        appStore.performerType = PerformerType.COMMUNITY
        appStore.dataLoading = true
        await communityStore.loadCommunity(registrationId)
        appStore.dataLoading = false
        break
    }

    appStore.dataLoading = true
    await teacherStore.loadAllTeachers()
    if (registration?.teacher) {
      await teacherStore.loadTeacher(registration.teacher.id)
    }
    await classesStore.loadClasses(registrationId)
    await fieldConfigStore.loadRequiredFields()
    appStore.dataLoading = false
    navigateTo('/form')
  }

  /**
   * Creates a new registration in the registration form.
   *
   * @param performerType SOLO, GROUP, SCHOOL or COMMUNITY
   * @param label A given label for the registration form
   */
  async function newRegistration(performerType: PerformerType, label?: string) {
    if (!label || label.length === 0) {
      label = 'Registration Form'
    }
    await registrationStore.createRegistration(performerType, label)
    registrationId.value = registrationStore.registrationId
    appStore.$patch({
      editExisting: false,
      performerType,
      registrationExists: true,
    })

    switch (performerType) {
      case 'SOLO':
        appStore.performerType = PerformerType.SOLO
        appStore.dataLoading = true
        await performerStore.createPerformer(registrationId.value)
        break
      case 'GROUP':
        appStore.performerType = PerformerType.GROUP
        appStore.dataLoading = true
        await groupStore.createGroup(registrationId.value)
        // require at least 2 performers for groups
        await performerStore.createPerformer(registrationId.value)
        await performerStore.createPerformer(registrationId.value)
        break
      case 'SCHOOL':
        appStore.performerType = PerformerType.SCHOOL
        appStore.dataLoading = true
        await schoolStore.createSchool(registrationId.value)
        await schoolGroupStore.createSchoolGroup(schoolStore.school.id!)
        break
      case 'COMMUNITY':
        appStore.performerType = PerformerType.COMMUNITY
        appStore.dataLoading = true
        await communityStore.createCommunity(registrationId.value)
    }
    await teacherStore.loadAllTeachers()
    await classesStore.createClass(registrationId.value)
    await fieldConfigStore.loadRequiredFields()
    appStore.dataLoading = false

    navigateTo('/form')
  }

  async function deleteRegistration(regId: number) {
    appStore.dataLoading = true
    await registrationStore.deleteRegistration(regId)
    await refetchRegistrations()
    appStore.dataLoading = false
  }
</script>

<template>
  <div v-auto-animate>
    <h1 class="mt-3 mb-2">Winnipeg Music Festival</h1>
    <h2>Registration Forms</h2>
    <div class="border border-sky-500 rounded-lg text-left mt-10 md:mt-15">
      <div class="p-4">
        <div class="pb-6">
          <h3>Submitted and In-Process Applications</h3>
          <table
            v-auto-animate
            class="table_auto border-separate border-spacing-0 w-full text-xs sm:text-base mt-3">
            <thead class="text-white">
              <tr class="py-2 px-2">
                <th class="rounded-tl-lg bg-sky-700">View</th>
                <th
                  v-if="sm"
                  class="bg-sky-700">
                  ID
                </th>
                <th class="bg-sky-700">Label</th>
                <th
                  v-if="lg"
                  class="bg-sky-700">
                  Created
                </th>
                <th class="bg-sky-700">Type</th>
                <th
                  v-if="md"
                  class="bg-sky-700">
                  Submitted
                </th>
                <th class="bg-sky-700">Total</th>
                <th class="bg-sky-700">Conf. #</th>
                <th class="rounded-tr-lg bg-sky-700">Del</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="registration in registrations"
                :key="registration.id"
                class="bg-white">
                <td class="">
                  <BaseButton
                    class="text-sky-600 text-xl md:ml-4 ml-3"
                    @click="
                      registration.confirmation ||
                      openEditor(registration.performerType)
                        ? loadRegistration(
                            registration.id,
                            registration.performerType
                          )
                        : ''
                    ">
                    <Icon
                      v-if="
                        !registration.confirmation &&
                        openEditor(registration.performerType)
                      "
                      name="fa-solid:pen" />
                    <Icon
                      v-else-if="
                        !registration.confirmation &&
                        !openEditor(registration.performerType)
                      "
                      name="fa-solid:ban" />
                    <Icon
                      v-else
                      name="fa-solid:eye" />
                  </BaseButton>
                </td>
                <td
                  v-if="sm"
                  class="text-sm">
                  {{ registration.id }}
                </td>
                <td class="text-sm">
                  {{ registration.label }}
                </td>
                <td
                  v-if="lg"
                  class="text-sm">
                  {{ dateFunction(registration.createdAt) }}
                </td>
                <td class="text-sm">
                  {{ registration.performerType }}
                </td>
                <td
                  v-if="md"
                  class="text-sm">
                  {{ dateFunction(registration.submittedAt) ?? 'No' }}
                </td>
                <td class="text-sm">
                  ${{ Number(registration.totalAmt).toFixed(2) }}
                </td>
                <td class="text-sm">
                  {{ registration.confirmation ?? '----' }}
                </td>
                <td>
                  <BaseButton
                    v-if="!registration.confirmation"
                    class="text-red-600 text-xl md:ml-4 ml-3 my-3"
                    @click="deleteRegistration(registration.id)">
                    <Icon name="fa-solid:trash-alt" />
                  </BaseButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <div
          v-if="!registrationStore.user.emailConfirmed"
          class="pb-6">
          <h3>Account Confirmation</h3>
          <p>
            This account has not been verified. Please click on the link in the
            confirmation email, or press the button to send another confirmation
            email. Once confirmed, please log in again.
          </p>
          <p>
            <strong
              >All accounts must be confirmed before registrations can be
              submitted.</strong
            >
          </p>
          <button
            class="btn btn-blue"
            @click="resend">
            Send Email
          </button>
        </div>
        <div class="pb-6">
          <h3 class="pb-3">Registering for the Winnipeg Music Festival</h3>
          <ul class="list-disc pl-5">
            <li>
              Begin registration by creating an account (account can be for an
              individual; a teacher for all their individual students, or for
              all their choirs; a parent for their family etc.)
            </li>
            <li>
              Only one teacher/discipline allowed per form. Performers with
              multiple disciplines and/or teachers require separate forms.
            </li>
            <li>
              Applications can be saved and completed/edited later before
              submission. Once submitted, applications can no longer be edited.
            </li>
            <li>
              You can view submitted entries by clicking on the 'eye' link to
              the left of the table.
            </li>
            <li>A copy can be printed for your records.</li>
          </ul>
        </div>
        <h3>Begin New Registration Form</h3>
      </div>
      <!-- Discipline Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4">
        <BaseCard
          :label="soloOpen ? 'Solo' : 'Solo - Closed'"
          :photo="soloOpen ? soloPhoto : soloPhotoBW"
          alt-text="New Solo Registration"
          @click="soloOpen ? newRegistration(PerformerType.SOLO) : ''" />
        <BaseCard
          :label="groupOpen ? 'Group' : 'Group - Closed'"
          :photo="groupOpen ? groupPhoto : groupPhotoBW"
          alt-text="New Group Registration"
          @click="groupOpen ? newRegistration(PerformerType.GROUP) : ''" />
        <BaseCard
          :label="schoolOpen ? 'School' : 'School - Closed'"
          :photo="schoolOpen ? schoolPhoto : schoolPhotoBW"
          alt-text="New School Registration"
          @click="schoolOpen ? newRegistration(PerformerType.SCHOOL) : ''" />
        <BaseCard
          :label="communityOpen ? 'Community' : 'Community - Closed'"
          :photo="communityOpen ? communityPhoto : communityPhotoBW"
          alt-text="New Community Registration"
          @click="
            communityOpen ? newRegistration(PerformerType.COMMUNITY) : ''
          " />
      </div>
    </div>
  </div>
</template>

<style scoped>
  th {
    @apply py-1 px-4;
  }

  td {
    @apply px-2 py-1 border-b border-sky-600;
  }
</style>
