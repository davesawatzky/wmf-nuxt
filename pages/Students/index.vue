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
  import type { Registration, RegistrationInput } from '@/graphql/gql/graphql'
  import {
    PerformerType,
    StudentRegistrationsDocument,
  } from '@/graphql/gql/graphql'

  const registrationStore = useRegistration()
  const appStore = useAppStore()
  const performerStore = usePerformers()
  const teacherStore = useTeacher()
  const groupStore = useGroup()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()
  const communityStore = useCommunity()
  const communityGroupStore = useCommunityGroup()
  const classesStore = useClasses()
  const fieldConfigStore = useFieldConfig()

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
    communityGroupStore.$reset()
    schoolStore.$reset()
    schoolGroupStore.$reset()
    classesStore.$reset()
    fieldConfigStore.$reset()
  })

  /**
   * Load list of all student registrations for a teacher
   */
  const {
    result,
    refetch: refetchRegistrations,
    onError,
  } = useQuery(StudentRegistrationsDocument, null, () => ({
    fetchPolicy: 'no-cache',
  }))
  onError((error) => console.log(error))

  const registrations = computed(
    () => result.value?.myStudents.registrations ?? []
  )

  /**
   * Load Viewable Student Registration
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
        await communityGroupStore.loadCommunityGroups(registrationId)
        appStore.dataLoading = false
        break
    }
    appStore.dataLoading = true
    await classesStore.loadClasses(registrationId)
    appStore.dataLoading = false
    await navigateTo('/students/summary') // TODO: have to change this to a summary
  }
</script>

<template>
  <div v-auto-animate>
    <h1 class="mt-3 mb-2">Winnipeg Music Festival</h1>
    <h2>Registration Forms</h2>
    <div class="border border-sky-500 rounded-lg text-left mt-10 md:mt-15">
      <div class="p-4">
        <div class="pb-6">
          <h3>My Student Registration Forms</h3>
          <ul class="list-disc pl-5 py-4">
            <li>This is a viewable list only.</li>
            <li>
              This page shows summaries of all registration forms where you are
              included as the teacher.
            </li>
            <li>
              This list also includes registrations that you may have created
              for your own students in the 'My Registrations' page.
            </li>
            <li>
              Click on the 'View' icon (<Icon
                class="text-sky-600 text-xl"
                name="fa-solid:eye" />) to see more details.
            </li>
          </ul>
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
                <th class="bg-sky-700">Performer</th>
                <th
                  v-if="lg"
                  class="bg-sky-700">
                  Created
                </th>
                <th class="bg-sky-700">Type</th>
                <th
                  v-if="md"
                  class="bg-sky-700">
                  Status
                </th>
                <th class="bg-sky-700 rounded-tr-lg">Conf. #</th>
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
                      loadRegistration(
                        registration.id,
                        registration.performerType
                      )
                    ">
                    <Icon name="fa-solid:eye" />
                  </BaseButton>
                </td>
                <td
                  v-if="sm"
                  class="text-sm">
                  {{ registration.id }}
                </td>
                <td
                  v-if="registration.performerType === 'SOLO'"
                  class="text-sm">
                  {{ registration.performers?.[0].firstName }}
                  {{ registration.performers?.[0].lastName }}
                </td>
                <td
                  v-else-if="registration.performerType === 'GROUP'"
                  class="text-sm">
                  {{ registration.group?.name }}
                </td>
                <td
                  v-else-if="registration.performerType === 'SCHOOL'"
                  class="text-sm">
                  {{ registration.school?.name }}
                </td>
                <td
                  v-else-if="registration.performerType === 'COMMUNITY'"
                  class="text-sm">
                  {{ registration.community?.name }}
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
                  class="text-xs text-white">
                  <div
                    v-if="dateFunction(registration.submittedAt)"
                    class="rounded-xl pl-2 py-1 bg-green-700">
                    Submitted
                  </div>
                  <div
                    v-else
                    class="rounded-xl pl-2 py-1 bg-red-700">
                    Incomplete
                  </div>
                </td>
                <td class="text-sm">
                  {{ registration.confirmation ?? '----' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
