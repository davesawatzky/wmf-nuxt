<script setup lang="ts">
  import * as yup from 'yup'
  import type { Component } from 'vue'
  import { useAppStore } from '@/stores/appStore'
  import { useRegistration } from '@/stores/useRegistration'
  import type { Status } from '#imports'
  import {
    useStorage,
    StorageSerializers,
    useSwipe,
    breakpointsTailwind,
    useBreakpoints,
  } from '@vueuse/core'

  interface DynamicComponent {
    [key: string]: Component
  }

  definePageMeta({
    middleware: ['form'],
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
  const FormCommunityGroups = <Component>resolveComponent('FormCommunityGroups')
  const FormTypeClasses = <Component>resolveComponent('FormTypeClasses')
  const Summary = <Component>resolveComponent('Summary')

  const registrationStore = useRegistration()
  const appStore = useAppStore()
  const performerType = toRef(appStore.performerType)
  let tabs = {} as DynamicComponent
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const mobile = breakpoints.smaller('sm')

  const currentTab = useStorage('stepperTab', '', sessionStorage, {
    mergeDefaults: true,
    serializer: StorageSerializers.string,
  })
  const tabIndex = useStorage('stepperIdx', 0, sessionStorage, {
    mergeDefaults: true,
    serializer: StorageSerializers.number,
  })
  const slideDirection = ref('slide-left')
  const swipeElement = ref(null)
  const { isSwiping, direction } = useSwipe(swipeElement)
  if (isSwiping.value) {
    if (direction.value === 'right' && tabIndex.value > 0) {
      previousTab()
    } else if (
      direction.value === 'left' &&
      tabIndex.value < Object.keys(tabs).length - 1
    ) {
      nextTab()
    }
  }

  const status = reactive<Status>({
    label: registrationStore.registration.label
      ? StatusEnum.saved
      : StatusEnum.null,
  })

  onMounted(() => {
    currentTab.value = tabNames.value[0]
    tabIndex.value = 0
  })

  onBeforeMount(async () => {
    if (!registrationStore.registrationId) {
      await navigateTo('/registrations')
    }
  })

  onDeactivated(() => {
    currentTab.value = null
    tabIndex.value = null
  })

  function setTab(tab: string, index: number) {
    currentTab.value = tab
    if (index > tabIndex.value) {
      slideDirection.value = 'slide-left'
    } else if (index < tabIndex.value) {
      slideDirection.value = 'slide-right'
    }
    tabIndex.value = index
  }

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    status[fieldName] = StatusEnum.pending
    await registrationStore.updateRegistration(fieldName)
    if (stat === 'saved') {
      status[fieldName] = StatusEnum.saved
    } else if (stat === 'remove') {
      status[fieldName] = StatusEnum.removed
    } else {
      status[fieldName] = StatusEnum.null
    }
  }

  switch (performerType.value) {
    case 'SOLO':
      tabs = {
        Performer: FormSoloPerformer,
        Teacher: FormSoloTeacher,
        'Solo Classes': FormTypeClasses,
        Summary,
      }
      break
    case 'GROUP':
      tabs = {
        Group: FormGroupInfo,
        Performers: FormGroupPerformers,
        Teacher: FormGroupTeacher,
        'Group Classes': FormTypeClasses,
        Summary,
      }
      break
    case 'SCHOOL':
      tabs = {
        School: FormSchoolInfo,
        Teacher: FormSchoolTeacher,
        Groups: FormSchoolGroups,
        'School Classes': FormTypeClasses,
        Summary,
      }
      break
    case 'COMMUNITY':
      tabs = {
        Community: FormCommunityInfo,
        Contact: FormCommunityTeacher,
        Groups: FormCommunityGroups,
        'Community Classes': FormTypeClasses,
        Summary,
      }
      break
  }

  const tabNames = ref(Object.keys(tabs))

  function previousTab() {
    setTab(Object.keys(tabs)[tabIndex.value - 1], tabIndex.value - 1)
  }
  function nextTab() {
    setTab(Object.keys(tabs)[tabIndex.value + 1], tabIndex.value + 1)
  }

  const validationSchema = yup.object({
    label: yup.string().trim().required('Please enter a label for this form'),
  })

  const { values, errors, meta, handleSubmit } = useForm({
    validationSchema,
  })

  async function gotoRegistrations() {
    await navigateTo('/registrations')
  }

  const queryLoading = useGlobalQueryLoading()
  const mutationLoading = useGlobalMutationLoading()
  const disableButton = computed(() => {
    if (queryLoading.value || mutationLoading.value || appStore.dataLoading) {
      return true
    } else {
      return false
    }
  })
</script>

<template>
  <div>
    <BaseInput
      v-model="registrationStore.registration.label"
      class="text-3xl"
      label="Registration Label"
      name="label"
      :disabled="!!registrationStore.registration.confirmation"
      placeholder="Enter a unique label"
      :status="status.label"
      type="text"
      @change-status="(stat: string) => fieldStatus(stat, 'label')" />

    <div v-if="!registrationStore.registration.confirmation">
      <div class="text-left">
        <BaseStepper
          :currentTab="currentTab"
          :tabs="tabNames"
          @set-tab="setTab" />
      </div>
      <div
        ref="swipeElement"
        class="border border-spacing-1 shadow-md rounded-lg border-sky-500 p-2 mb-6">
        <Transition
          :name="slideDirection"
          :css="true"
          mode="out-in">
          <KeepAlive>
            <component :is="tabs[currentTab]" />
          </KeepAlive>
        </Transition>
      </div>
      <div
        v-if="!mobile"
        class="sm:flex sm:justify-between"
        :class="tabIndex === 0 ? 'flex-row-reverse' : ''">
        <BaseButton
          id="desktop-previous-button"
          v-show="tabIndex > 0"
          class="btn btn-blue"
          @click="previousTab"
          :disabled="disableButton">
          <Icon name="bxs:left-arrow" />Previous
        </BaseButton>
        <BaseButton
          id="desktop-next-button"
          v-show="tabIndex < Object.keys(tabs).length - 1"
          class="btn btn-blue"
          @click="nextTab"
          :disabled="disableButton">
          Next<Icon name="bxs:right-arrow" />
        </BaseButton>
      </div>
      <div v-else>
        <KeepAlive>
          <BaseBottomBar class="flex justify-around">
            <BaseButton
              id="mobile-previous-button"
              :disabled="!(tabIndex > 0) || disableButton"
              @click="previousTab"
              class="text-sky-700 text-3xl disabled:text-slate-300">
              <Icon name="bxs:left-arrow" />
            </BaseButton>
            <BaseButton
              id="mobile-registration-button"
              @click="gotoRegistrations()">
              <Icon
                name="ic:outline-app-registration"
                class="text-sky-700 text-4xl"
                :disabled="disableButton" />
            </BaseButton>
            <BaseButton
              id="mobile-next-button"
              :disabled="
                !(tabIndex < Object.keys(tabs).length - 1) || disableButton
              "
              @click="nextTab"
              class="text-sky-700 text-3xl disabled:text-slate-300">
              <Icon name="bxs:right-arrow" />
            </BaseButton>
          </BaseBottomBar>
        </KeepAlive>
      </div>
    </div>
    <div
      v-else
      class="border border-spacing-1 shadow-md rounded-lg border-sky-500 p-2 sm:p-6 mb-6">
      <Summary></Summary>
    </div>
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
