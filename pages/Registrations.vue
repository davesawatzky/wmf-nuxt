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
  import {
    communityOpen,
    groupOpen,
    schoolOpen,
    soloOpen,
  } from '@/composables/openClosed'
  import { PerformerType, RegistrationsDocument } from '@/graphql/gql/graphql'
  import type { Registration } from '@/graphql/gql/graphql'

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
    teacherStore.$reset()
    groupStore.$reset()
    communityStore.$reset()
    schoolStore.$reset()
    classesStore.$reset()
  })

  const { result, refetch: refetchRegistrations } = useQuery(
    RegistrationsDocument,
    null,
    () => ({
      fetchPolicy: 'no-cache',
    })
  )

  const registrations = computed<Registration[]>(
    () => result.value?.registrations ?? []
  )

  function openEditor(performerType: PerformerType): boolean {
    // eslint-disable-next-line no-eval
    return eval(`${performerType.toLowerCase()}Open`)
  }

  /**
   * Load and Edit Existing Registration
   *
   * @param registrationId The ID of the registration form
   * @param performerType SOLO, GROUP, SCHOOL, or COMMUNITY
   * @param index Array Index of retrieved registrations
   */
  function loadRegistration(
    registrationId: number,
    performerType: PerformerType,
    index: number
  ) {
    registrationStore.registrationId = registrationId
    registrationStore.addToStore(registrations.value[index])
    switch (performerType) {
      case 'SOLO':
        appStore.performerType = PerformerType.SOLO
        appStore.dataLoading = true
        performerStore.loadPerformers(registrationId)
        teacherStore.loadTeacher(registrationId).loadTeachers()
        classesStore.loadClasses(registrationId)
        appStore.dataLoading = false
        break
      case 'GROUP':
        appStore.performerType = PerformerType.GROUP
        appStore.dataLoading = true
        groupStore.loadGroup(registrationId)
        teacherStore.loadTeacher(registrationId)
        performerStore.loadPerformers(registrationId)
        classesStore.loadClasses(registrationId)
        appStore.dataLoading = false
        break
      case 'SCHOOL':
        appStore.performerType = PerformerType.SCHOOL
        appStore.dataLoading = true
        schoolStore.loadSchool(registrationId)
        schoolGroupStore.loadSchoolGroups(registrationId)
        teacherStore.loadTeacher(registrationId)
        classesStore.loadClasses(registrationId)
        appStore.dataLoading = false
        break
      case 'COMMUNITY':
        appStore.performerType = PerformerType.COMMUNITY
        appStore.dataLoading = true
        communityStore.loadCommunities(registrationId)
        teacherStore.loadTeacher(registrationId)
        classesStore.loadClasses(registrationId)
        appStore.dataLoading = false
        break
    }

    appStore.dataLoading = true
    classesStore.loadClasses(registrationId)
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
    console.log('RegistrationID-----: ', registrationId.value)
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
        await teacherStore.createTeacher(registrationId.value)
        await classesStore.createClass(registrationId.value)
        appStore.dataLoading = false

        break
      case 'GROUP':
        appStore.performerType = PerformerType.GROUP
        appStore.dataLoading = true
        await groupStore.createGroup(registrationId.value)
        await teacherStore.createTeacher(registrationId.value)
        await performerStore.createPerformer(registrationId.value)
        await classesStore.createClass(registrationId.value)
        appStore.dataLoading = false

        break
      case 'SCHOOL':
        appStore.performerType = PerformerType.SCHOOL
        appStore.dataLoading = true
        await schoolStore.createSchool(registrationId.value)
        await schoolGroupStore.createSchoolGroup(schoolStore.schoolInfo.id!)
        await teacherStore.createTeacher(registrationId.value)
        await classesStore.createClass(registrationId.value)
        appStore.dataLoading = false

        break
      case 'COMMUNITY':
        appStore.performerType = PerformerType.COMMUNITY
        appStore.dataLoading = true
        await communityStore.createCommunity(registrationId.value)
        await teacherStore.createTeacher(registrationId.value)
        await classesStore.createClass(registrationId.value)
        appStore.dataLoading = false
    }

    navigateTo('/form')
  }

  async function deleteRegistration(regId: number) {
    appStore.dataLoading = true
    await registrationStore.deleteRegistration(regId)
    refetchRegistrations()
    appStore.dataLoading = false
  }
</script>

<template>
  <div v-auto-animate>
    <h1 class="mt-3 mb-2">Winnipeg Music Festival</h1>
    <h2>Registration Forms</h2>
    <div class="border border-sky-500 rounded-lg text-left mt-10 md:mt-15">
      <div class="p-4">
        <h3 class="pb-3">Registering for the Winnipeg Music Festival</h3>
        <ul class="list-disc pl-5">
          <li>
            Begin registration by creating an account (account can be for an
            individual; a teacher for all their individual students, or for all
            their choirs; a parent for their family etc.)
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
            You can view submitted entries by clicking on the 'eye' link to the
            left of the table.
          </li>
          <li>A copy can be printed for your records.</li>
        </ul>
      </div>
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
    <br />
    <h3>Submitted and In-Process Applications</h3>
    <table
      v-auto-animate
      class="bg-white table_auto border-collapse w-full text-xs sm:text-base mt-3">
      <thead class="bg-sky-600 text-white">
        <tr class="py-2 px-2">
          <th class="rounded-tl-lg">View</th>
          <th v-if="sm">ID</th>
          <th>Label</th>
          <th v-if="lg">Created</th>
          <th>Type</th>
          <th v-if="md">Submitted</th>
          <th>Total</th>
          <th>Conf. #</th>
          <th class="rounded-tr-lg">Del</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(registration, index) in registrations"
          :key="index"
          class="">
          <td class="">
            <BaseButton
              class="text-sky-600 text-xl md:ml-4 ml-3"
              @click="
                registration.confirmation ||
                openEditor(registration.performerType)
                  ? loadRegistration(
                      registration.id,
                      registration.performerType,
                      index
                    )
                  : ''
              ">
              <font-awesome-icon
                v-if="
                  !registration.confirmation &&
                  openEditor(registration.performerType)
                "
                icon="fa-solid fa-file-pen" />
              <font-awesome-icon
                v-else-if="
                  !registration.confirmation &&
                  !openEditor(registration.performerType)
                "
                icon="fa-solid fa-ban" />
              <font-awesome-icon
                v-else
                icon="fa-solid fa-eye" />
            </BaseButton>
          </td>
          <td
            v-if="sm"
            class="">
            {{ registration.id }}
          </td>
          <td class="">
            {{ registration.label }}
          </td>
          <td
            v-if="lg"
            class="">
            {{ dateFunction(registration.createdAt) }}
          </td>
          <td class="">
            {{ registration.performerType }}
          </td>
          <td v-if="md">
            {{ dateFunction(registration.submittedAt) }}
          </td>
          <td>${{ registration.totalAmt }}.00</td>
          <td>{{ registration.confirmation }}</td>
          <td>
            <BaseButton
              v-if="!registration.confirmation"
              class="text-red-600 text-xl md:ml-4 ml-3 my-3"
              @click="deleteRegistration(registration.id)">
              <font-awesome-icon icon="fa-regular fa-trash-can" />
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
  th {
    @apply py-1 px-4;
  }

  td {
    @apply px-2 py-1 border-b border-slate-300;
  }
</style>
