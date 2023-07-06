<script setup lang="ts">
  // import {Component, ref} from 'vue'
  import type { Component } from 'vue'
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

  const FormSoloPerformer = <Component>resolveComponent('FormSoloPerformer')
  const FormSoloTeacher = <Component>resolveComponent('FormSoloTeacher')
  const FormGroupInfo = <Component>resolveComponent('FormGroupInfo')
  const FormGroupPerformers = <Component>resolveComponent('FormGroupPerformers')
  const FormGroupTeacher = <Component>resolveComponent('FormGroupTeacher')
  const FormSchoolInfo = <Component>resolveComponent('FormSchoolInfo')
  const FormSchoolTeacher = <Component>resolveComponent('FormSchoolTeacher')
  const FormSchoolGroups = <Component>resolveComponent('FormSchoolGroups')
  const FormCommunityInfo = <Component>resolveComponent('FormCommunityInfo')
  const FormCommunityTeacher = <Component>(
    resolveComponent('FormCommunityTeacher')
  )
  const FormTypeClasses = <Component>resolveComponent('FormTypeClasses')
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

  definePageMeta({
    middleware: 'auth',
  })

  const currentTab = ref('')
  let tabs = {} as DynamicComponent

  switch (performerType.value) {
    case 'SOLO':
      currentTab.value = 'Performer'
      tabs = {
        Performer: FormSoloPerformer,
        Teacher: FormSoloTeacher,
        'Solo Classes': FormTypeClasses,
        Summary,
      }
      break
    case 'GROUP':
      currentTab.value = 'Group'
      tabs = {
        Group: FormGroupInfo,
        Performers: FormGroupPerformers,
        Teacher: FormGroupTeacher,
        'Group Classes': FormTypeClasses,
        Summary,
      }
      break
    case 'SCHOOL':
      currentTab.value = 'School'
      tabs = {
        School: FormSchoolInfo,
        Teacher: FormSchoolTeacher,
        Groups: FormSchoolGroups,
        'School Classes': FormTypeClasses,
        Summary,
      }
      break
    case 'COMMUNITY':
      currentTab.value = 'Community'
      tabs = {
        Community: FormCommunityInfo,
        Teacher: FormCommunityTeacher,
        'Community Classes': FormTypeClasses,
        Summary,
      }
      break
  }
</script>

<template>
  <div>
    <BaseInput
      v-model.string="registrationStore.registration.label"
      class="text-3xl"
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
  </div>
</template>

<style scoped></style>
