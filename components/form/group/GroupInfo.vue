<script setup lang="ts">
  import * as yup from 'yup'
  import { useGroup } from '@/stores/useGroup'
  import type { Group } from '~/graphql/gql/graphql'

  const groupStore = useGroup()
  const classesStore = useClasses()
  const registrationStore = useRegistration()
  const isOpen = ref(false)
  const previousGroupType = ref('')
  const cancelGroupChange = ref(false)
  const changeGroupType = ref('')
  const fieldConfigStore = useFieldConfig()

  watch(
    () => groupStore.group.groupType,
    async (newGroupType, oldGroupType) => {
      console.log(changeGroupType.value)
      if (
        !!newGroupType &&
        !!classesStore.registeredClasses[0].discipline &&
        !cancelGroupChange.value
      ) {
        previousGroupType.value = oldGroupType ?? ''
        setIsOpen(true)
      } else if (cancelGroupChange.value) {
        cancelGroupChange.value = false
        setIsOpen(false)
      } else {
        cancelGroupChange.value = false
        setIsOpen(false)
        console.log('The else GroupType', changeGroupType.value, newGroupType)
        await fieldStatus(changeGroupType.value, 'groupType')
      }
    },
    { flush: 'post', immediate: true }
  )

  async function resetClasses() {
    setIsOpen(false)
    const regClassIdNumbers = []
    for (let i = 0; i < classesStore.registeredClasses.length; i++)
      regClassIdNumbers.push(classesStore.registeredClasses[i].id)
    for (const number of regClassIdNumbers)
      await classesStore.deleteClass(number)
    await classesStore.createClass(registrationStore.registrationId)
    await fieldStatus(changeGroupType.value, 'groupType')
  }

  function cancelGroupTypeChange() {
    cancelGroupChange.value = true
    groupStore.group.groupType = previousGroupType.value
  }

  function setIsOpen(value: boolean) {
    isOpen.value = value
  }

  const typeOptions = [
    {
      label: 'Vocal Group',
      description: 'Duets, Trios, Quartets, and Ensembles',
      value: 'vocal',
    },
    {
      label: 'Musical Theatre',
      description: 'Musical Theatre Duets, Trios, Quartets, and Ensembles',
      value: 'musicalTheatre',
    },
    {
      label: 'Instrumental Group',
      description: 'Duets, Trios, Ensembles, and Chamber Groups',
      value: 'instrumental',
    },
    {
      label: 'Mixed Group',
      description:
        'Mixed instrument chamber groups which include both instruments and voice.  Includes class 1945, "Family and/or Friends"',
      value: 'mixed',
    },
  ]

  const validationSchema = toTypedSchema(
    yup.object({
      name: yup.string().trim().required('Required'),
      groupType: yup.string().required('Required'),
    })
  )

  const status = reactive<Status>({
    name: groupStore.group.name ? StatusEnum.saved : StatusEnum.null,
    groupType: groupStore.group.groupType ? StatusEnum.saved : StatusEnum.null,
  })

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    status[fieldName] = StatusEnum.pending
    if (stat === 'saved') {
      status[fieldName] = StatusEnum.saved
      await groupStore.updateGroup(fieldName)
    } else if (stat === 'remove') status[fieldName] = StatusEnum.removed
    else status[fieldName] = StatusEnum.null
  }

  const { errors, validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  const groupKeys = fieldConfigStore.performerTypeFields('Group')
  watchEffect(() => {
    let count = 0
    for (const key of groupKeys) {
      if (status[key as keyof Group] !== StatusEnum.saved) {
        count++
      }
    }
    groupStore.groupErrors = count
  })

  onActivated(() => {
    validate()
  })
</script>

<template>
  <div
    v-auto-animate
    class="py-8">
    <h2 class="pb-4">Group Information</h2>
    <div class="grid grid-cols-6 gap-5">
      <div class="col-span-6 md:col-span-3">
        <BaseInput
          v-model="groupStore.group.name"
          name="name"
          label="Group Name"
          type="text"
          :status="status.name"
          @change-status="(stat: string) => fieldStatus(stat, 'name')" />
      </div>
      <div
        class="col-span-6 md:col-span-3 border border-spacing-1 border-sky-500 shadow-md rounded-lg px-6 pt-6">
        <h3>Group Type</h3>
        <div>
          <BaseRadioGroup
            v-model="groupStore.group.groupType"
            name="groupType"
            label="Selections"
            :options="typeOptions"
            :status="status.groupType"
            @change-status="(stat: string) => (changeGroupType = stat)" />
        </div>
      </div>
    </div>
    <UITransitionRoot
      :show="isOpen"
      enter="duration-1000 ease-out"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="duration-1000 ease-in"
      leave-from="opacity-100"
      leave-to="opacity-0">
      <UIDialog
        class="relative z-50"
        @close="cancelGroupTypeChange()">
        <UITransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div
            class="fixed inset-0 bg-black/30"
            aria-hidden="true" />
        </UITransitionChild>
        <div
          class="fixed inset-0 flex w-screen items-center justify-center p-4">
          <UITransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <UIDialogPanel
              class="p-4 w-full max-w-sm rounded-lg bg-white shadow-lg">
              <UIDialogTitle class="text-center text-xl font-bold">
                Change Musical Group Type
              </UIDialogTitle>
              <UIDialogDescription class="text-center">
                Are you sure? This will remove any classes already selected for
                this registration form.
              </UIDialogDescription>
              <div>
                <BaseButton
                  class="btn btn-blue"
                  @click="resetClasses()">
                  Change Instrument
                </BaseButton>
                <BaseButton
                  class="btn btn-blue"
                  @click="cancelGroupTypeChange()">
                  Cancel
                </BaseButton>
              </div>
            </UIDialogPanel>
          </UITransitionChild>
        </div>
      </UIDialog>
    </UITransitionRoot>
  </div>
</template>

<style lang="scss" scoped></style>
