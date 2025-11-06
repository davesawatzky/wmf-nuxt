<script setup lang="ts">
  import * as yup from 'yup'
  import type { Component } from 'vue'
  import { useAppStore } from '~/stores/appStore'
  import { useRegistration } from '~/stores/useRegistration'
  import type { Status } from '#imports'
  import {
    useStorage,
    StorageSerializers,
    useSwipe,
    breakpointsTailwind,
    useBreakpoints,
  } from '@vueuse/core'
  import { useToast } from 'vue-toastification'

  interface DynamicComponent {
    [key: string]: Component
  }

  definePageMeta({
    middleware: ['user', 'form'],
  })

  const FormSoloPerformer = resolveComponent('FormSoloPerformer') as Component
  const FormSoloTeacher = resolveComponent('FormSoloTeacher') as Component
  const FormGroupInfo = resolveComponent('FormGroupInfo') as Component
  const FormGroupPerformers = resolveComponent(
    'FormGroupPerformers'
  ) as Component
  const FormGroupTeacher = resolveComponent('FormGroupTeacher') as Component
  const FormSchoolInfo = resolveComponent('FormSchoolInfo') as Component
  const FormSchoolTeacher = resolveComponent('FormSchoolTeacher') as Component
  const FormSchoolGroups = resolveComponent('FormSchoolGroups') as Component
  const FormCommunityInfo = resolveComponent('FormCommunityInfo') as Component
  const FormCommunityTeacher = resolveComponent(
    'FormCommunityTeacher'
  ) as Component
  const FormCommunityGroups = resolveComponent(
    'FormCommunityGroups'
  ) as Component
  const FormTypeClasses = resolveComponent('FormTypeClasses') as Component
  const Summary = resolveComponent('Summary') as Component

  const registrationStore = useRegistration()
  const appStore = useAppStore()
  const performerType = toRef(appStore.performerType)
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const mobile = breakpoints.smaller('sm')
  const toast = useToast()

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

  const status = reactive<Status>({
    label: registrationStore.registration.label
      ? StatusEnum.saved
      : StatusEnum.null,
  })

  const tabs = computed((): DynamicComponent => {
    switch (performerType.value) {
      case 'SOLO':
        return {
          Performer: FormSoloPerformer,
          Teacher: FormSoloTeacher,
          'Solo Classes': FormTypeClasses,
          Summary,
        }
      case 'GROUP':
        return {
          Group: FormGroupInfo,
          Performers: FormGroupPerformers,
          Teacher: FormGroupTeacher,
          'Group Classes': FormTypeClasses,
          Summary,
        }
      case 'SCHOOL':
        return {
          School: FormSchoolInfo,
          Teacher: FormSchoolTeacher,
          Groups: FormSchoolGroups,
          'School Classes': FormTypeClasses,
          Summary,
        }
      case 'COMMUNITY':
        return {
          Community: FormCommunityInfo,
          Contact: FormCommunityTeacher,
          Groups: FormCommunityGroups,
          'Community Classes': FormTypeClasses,
          Summary,
        }
      default:
        return {}
    }
  })

  const tabNames = computed(() => Object.keys(tabs.value))

  function setTab(tab: string, index: number) {
    currentTab.value = tab
    if (index > tabIndex.value) {
      slideDirection.value = 'slide-left'
    } else if (index < tabIndex.value) {
      slideDirection.value = 'slide-right'
    }
    tabIndex.value = index
  }

  function previousTab() {
    setTab(Object.keys(tabs.value)[tabIndex.value - 1]!, tabIndex.value - 1)
  }
  function nextTab() {
    setTab(Object.keys(tabs.value)[tabIndex.value + 1]!, tabIndex.value + 1)
  }

  watch([isSwiping, direction], ([swiping, swipeDirection]) => {
    if (!swiping) return

    if (swipeDirection === 'right' && tabIndex.value > 0) {
      previousTab()
    } else if (
      swipeDirection === 'left' &&
      tabIndex.value < Object.keys(tabs).length - 1
    ) {
      nextTab()
    }
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

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    if (stat === 'valid') {
      status[fieldName] = StatusEnum.pending
      const result = await registrationStore.updateRegistration(fieldName)
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        if (registrationStore.registration.label !== null) {
          status[fieldName] = StatusEnum.saved
        }
      } else {
        console.error('Could not update field in registration: ', fieldName)
        toast.error(
          'Could not update field.  Please exit and reload Registration'
        )
      }
    } else if (stat === 'invalid') {
      status[fieldName] = StatusEnum.pending
      const result = await registrationStore.updateRegistration(fieldName)
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        status[fieldName] = StatusEnum.removed
      } else {
        console.error(
          'Could not remove invalid field in registration: ',
          fieldName
        )
        toast.error(
          'Could not remove invalid field. Please exit and reload Registration'
        )
      }
    } else if (stat === 'removed') {
      status[fieldName] = StatusEnum.pending
      const result = await registrationStore.updateRegistration(fieldName)
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        status[fieldName] = StatusEnum.removed
      } else {
        console.error('Could not remove field in registration: ', fieldName)
        toast.error(
          'Could not remove field.  Please exit and reload Registration'
        )
      }
    }
  }

  const validationSchema = yup.object({
    label: yup.string().trim().required('Please enter a label for this form'),
  })

  useForm({
    validationSchema,
  })

  async function gotoRegistrations() {
    await navigateTo('/registrations')
  }

  const queryLoading = useGlobalQueryLoading()
  const mutationLoading = useGlobalMutationLoading()
  const disableButton = computed(() => {
    return queryLoading.value || mutationLoading.value || appStore.dataLoading
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
      @change-status="
        async (stat: string) => await fieldStatus(stat, 'label')
      " />

    <div v-if="!registrationStore.registration.confirmation">
      <div class="text-left">
        <BaseStepper
          :current-tab="currentTab"
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
          v-show="tabIndex > 0"
          id="desktop-previous-button"
          class="btn btn-blue"
          :disabled="disableButton"
          @click="previousTab">
          <Icon name="bxs:left-arrow" />Previous
        </BaseButton>
        <BaseButton
          v-show="tabIndex < Object.keys(tabs).length - 1"
          id="desktop-next-button"
          class="btn btn-blue"
          :disabled="disableButton"
          @click="nextTab">
          Next<Icon name="bxs:right-arrow" />
        </BaseButton>
      </div>
      <div v-else>
        <KeepAlive>
          <BaseBottomBar class="flex justify-around">
            <BaseButton
              id="mobile-previous-button"
              :disabled="!(tabIndex > 0) || disableButton"
              class="text-sky-700 text-3xl disabled:text-slate-300"
              @click="previousTab">
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
              class="text-sky-700 text-3xl disabled:text-slate-300"
              @click="nextTab">
              <Icon name="bxs:right-arrow" />
            </BaseButton>
          </BaseBottomBar>
        </KeepAlive>
      </div>
    </div>
    <div
      v-else
      class="border border-spacing-1 shadow-md rounded-lg border-sky-500 p-2 sm:p-6 mb-6">
      <Summary/>
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
