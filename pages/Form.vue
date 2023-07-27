<script setup lang="ts">
  import * as yup from 'yup'
  import type { Component } from 'vue'
  import { useAppStore } from '@/stores/appStore'
  import { useRegistration } from '@/stores/userRegistration'
  import type { Status, ErrorCounts } from '@/composables/types'

  interface DynamicComponent {
    [key: string]: Component
  }

  definePageMeta({
    middleware: 'auth',
  })

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
  const appStore = useAppStore()
  const performerType = toRef(appStore.performerType)
  const currentTab = ref('')
  const tabIndex = ref(0)
  const slideDirection = ref('slide-left')
  const status = reactive<Status>({
    label: StatusEnum.null,
  })
  let tabs = {} as DynamicComponent

  function setTab(tab: string, index: number) {
    currentTab.value = tab
    if (index > tabIndex.value) {
      slideDirection.value = 'slide-left'
    } else if (index < tabIndex.value) {
      slideDirection.value = 'slide-right'
    }
    tabIndex.value = index
  }

  async function fieldStatus(fieldName: string) {
    status[fieldName] = StatusEnum.pending
    await registrationStore.updateRegistration(fieldName)
    status[fieldName] = StatusEnum.saved
  }

  switch (performerType.value) {
    case 'SOLO':
      // currentTab.value = 'Performer'
      tabs = {
        Performer: FormSoloPerformer,
        Teacher: FormSoloTeacher,
        'Solo Classes': FormTypeClasses,
        Summary,
      }
      break
    case 'GROUP':
      // currentTab.value = 'Group'
      tabs = {
        Group: FormGroupInfo,
        Performers: FormGroupPerformers,
        Teacher: FormGroupTeacher,
        'Group Classes': FormTypeClasses,
        Summary,
      }
      break
    case 'SCHOOL':
      // currentTab.value = 'School'
      tabs = {
        School: FormSchoolInfo,
        Teacher: FormSchoolTeacher,
        Groups: FormSchoolGroups,
        'School Classes': FormTypeClasses,
        Summary,
      }
      break
    case 'COMMUNITY':
      // currentTab.value = 'Community'
      tabs = {
        Community: FormCommunityInfo,
        Contact: FormCommunityTeacher,
        'Community Classes': FormTypeClasses,
        Summary,
      }
      break
  }

  const fieldErrors = ref<ErrorCounts>({})

  function errorTally(tab: string, count: number) {
    fieldErrors.value[tab] = count
    console.log('currentTab: ', tab)
    console.log('fieldErrors: ', fieldErrors.value)
    console.log('Form: ', count)
  }

  const validationSchema = yup.object({
    label: yup.string().trim().required('Please enter a label for this form'),
  })

  const { values, errors, meta, handleSubmit } = useForm({
    validationSchema,
  })

  function onInvalidSubmit({ values, errors, results }: any) {
    console.log(values)
    console.log(errors)
    console.log(results)
  }

  const onSubmit = handleSubmit((values) => {
    alert(JSON.stringify(values, null, 2))
    navigateTo('Submission')
  }, onInvalidSubmit)
</script>

<template>
  <div>
    <form @submit="onSubmit">
      <BaseInput
        v-model="registrationStore.registration.label"
        class="text-3xl"
        label="Registration Label"
        name="registrationLabel"
        :disabled="!!registrationStore.registration.confirmation"
        placeholder="Enter a unique label"
        :status="status.label"
        type="text"
        @change="fieldStatus('label')" />

      <div v-if="!registrationStore.registration.confirmation">
        <div class="text-left">
          <BaseStepper
            :tabs="tabs"
            :field-errors="fieldErrors"
            @set-tab="setTab" />
        </div>
        <div
          class="border border-spacing-1 shadow-md rounded-lg border-sky-500 p-2 mb-6">
          <Transition
            :name="slideDirection"
            :css="true"
            mode="out-in">
            <KeepAlive>
              <component
                :is="tabs[currentTab]"
                @error-counts="(count:number) => errorTally(currentTab, count)" />
            </KeepAlive>
          </Transition>
        </div>
      </div>
      <div
        v-else
        class="border border-spacing-1 shadow-md rounded-lg border-sky-500 p-6 mb-6">
        <Summary @submitForm="onSubmit" />
      </div>
    </form>
  </div>
</template>

<style scoped>
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.2s;
  }
  .slide-left-enter-from {
    opacity: 0;
    transform: translate(50px, 0);
  }
  .slide-left-leave-to {
    opacity: 0;
    transform: translate(-50px, 0);
  }
  .slide-right-enter-from {
    opacity: 0;
    transform: translate(-50px, 0);
  }
  .slide-right-leave-to {
    opacity: 0;
    transform: translate(50px, 0);
  }
</style>
