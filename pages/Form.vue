<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  // import { Component, ref } from 'vue'
  import { useAppStore } from '@/stores/appStore'
  import { useClasses } from '@/stores/userClasses'
  import { useCommunity } from '@/stores/userCommunity'
  import { useGroup } from '@/stores/userGroup'
  import { usePerformers } from '@/stores/userPerformer'
  import { useRegistration } from '@/stores/userRegistration'
  import { useSchool } from '@/stores/userSchool'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'
  import { useTeacher } from '@/stores/userTeacher'
  import { PerformerType } from '~/graphql/gql/graphql'

  const FormSoloContactInfo = <Component>resolveComponent('FormSoloContactInfo')
  const FormSoloClasses = <Component>resolveComponent('FormSoloClasses')
  const FormGroupContactInfo = <Component>(
    resolveComponent('FormGroupContactInfo')
  )
  const FormGroupClasses = <Component>resolveComponent('FormGroupClasses')
  const FormSchoolInfo = <Component>resolveComponent('FormSchoolInfo')
  const FormSchoolClasses = <Component>resolveComponent('FormSchoolClasses')
  const FormCommunityInfo = <Component>resolveComponent('FormCommunityInfo')
  const FormCommunityClasses = <Component>(
    resolveComponent('FormCommunityClasses')
  )
  const Summary = <Component>resolveComponent('Summary')

  const registrationStore = useRegistration()
  const performerStore = usePerformers()
  const groupStore = useGroup()
  const communityStore = useCommunity()
  const classesStore = useClasses()
  const appStore = useAppStore()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()
  const teacherStore = useTeacher()

  const performerType = toRef(appStore.performerType)

  interface DynamicComponent {
    [key: string]: Component
  }

  const currentTab = ref('')
  let tabs = {} as DynamicComponent

  switch (performerType.value) {
    case 'SOLO':
      currentTab.value = 'Contact Info'
      tabs = {
        'Contact Info': FormSoloContactInfo,
        'Solo Classes': FormSoloClasses,
        Summary,
      }
      break
    case 'GROUP':
      currentTab.value = 'Contact Info'
      tabs = {
        'Contact Info': FormGroupContactInfo,
        'Group Classes': FormGroupClasses,
        Summary,
      }
      break
    case 'SCHOOL':
      currentTab.value = 'School Info'
      tabs = {
        'School Info': FormSchoolInfo,
        'School Classes': FormSchoolClasses,
        Summary,
      }
      break
    case 'COMMUNITY':
      currentTab.value = 'Community Info'
      tabs = {
        'Community Info': FormCommunityInfo,
        'Community Classes': FormCommunityClasses,
        Summary,
      }
      break
  }

  async function saveRegistration() {
    switch (appStore.performerType) {
      case 'SOLO':
        appStore.performerType = PerformerType.SOLO
        appStore.dataLoading = true
        await registrationStore.updateRegistration()
        await performerStore.updatePerformer(performerStore.performers[0].id!)
        await teacherStore.updateTeacher()
        await classesStore.updateAllClasses()
        appStore.dataLoading = false
        break
      case 'GROUP':
        appStore.performerType = PerformerType.GROUP
        appStore.dataLoading = true
        await registrationStore.updateRegistration()
        await groupStore.updateGroup()
        await teacherStore.updateTeacher()
        await performerStore.updateAllPerformers()
        await classesStore.updateAllClasses()
        appStore.dataLoading = false
        break
      case 'SCHOOL':
        appStore.performerType = PerformerType.SCHOOL
        appStore.dataLoading = true
        await registrationStore.updateRegistration()
        await schoolStore.updateSchool()
        await schoolGroupStore.updateAllSchoolGroups()
        await teacherStore.updateTeacher()
        await classesStore.updateAllClasses()
        appStore.dataLoading = false
        break
      case 'COMMUNITY':
        appStore.performerType = PerformerType.COMMUNITY
        appStore.dataLoading = true
        await registrationStore.updateRegistration()
        await communityStore.updateCommunity()
        await teacherStore.updateTeacher()
        await classesStore.updateAllClasses()
        appStore.dataLoading = false
        break
    }
  }
</script>

<template>
  <div>
    <BaseInput
      v-model.string="registrationStore.registration.label"
      class="text-3xl mb-6 h-12 p-6"
      label="Registration Label"
      name="registrationLabel"
      :disabled="registrationStore.registration.confirmation"
      type="text" />

    <div v-if="!registrationStore.registration.confirmation">
      <div class="text-left">
        <button
          v-for="(_, tab) in tabs"
          :key="tab"
          class="btn-blue py-1 px-2 mr-1 rounded-t-lg text-sm md:text-base"
          :class="[
            { active: currentTab === tab },
            currentTab === tab ? 'bg-sky-600' : '',
          ]"
          @click="currentTab = String(tab)">
          {{ tab }}
        </button>
      </div>
      <div
        class="border border-spacing-1 shadow-md rounded-b-lg rounded-tr-lg border-sky-500 p-2 mb-6">
        <KeepAlive>
          <component :is="tabs[currentTab]" />
        </KeepAlive>
      </div>
    </div>
    <div
      v-else
      class="border border-spacing-1 shadow-md rounded-lg border-sky-500 p-6 mb-6">
      <Summary />
    </div>
    <button
      v-if="!registrationStore.registration.confirmation"
      class="btn btn-blue"
      @click="saveRegistration()">
      Save
    </button>
  </div>
</template>

<style scoped></style>
