<script setup lang="ts">
  import * as yup from 'yup'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'
  import type { SchoolGroupInput } from '@/graphql/gql/graphql'
  import type { Status } from '@/composables/types'

  const props = defineProps<{
    modelValue: SchoolGroupInput
    schoolGroupIndex: number
    schoolGroupId: number
  }>()

  const emits = defineEmits<{
    'update:modelValue': [value: SchoolGroupInput]
  }>()

  const schoolGroupStore = useSchoolGroup()

  const schoolGroup = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const status = reactive<Status>({
    name: props.modelValue.name ? StatusEnum.saved : StatusEnum.null,
    earliestTime: props.modelValue.earliestTime
      ? StatusEnum.saved
      : StatusEnum.null,
    latestTime: props.modelValue.latestTime
      ? StatusEnum.saved
      : StatusEnum.null,
    groupSize:
      props.modelValue.groupSize || props.modelValue.groupSize === 0
        ? StatusEnum.saved
        : StatusEnum.null,
    chaperones:
      props.modelValue.chaperones || props.modelValue.chaperones === 0
        ? StatusEnum.saved
        : StatusEnum.null,
    wheelchairs:
      props.modelValue.wheelchairs || props.modelValue.wheelchairs === 0
        ? StatusEnum.saved
        : StatusEnum.null,
    unavailable: props.modelValue.unavailable
      ? StatusEnum.saved
      : StatusEnum.null,
    conflictPerformers: props.modelValue.conflictPerformers
      ? StatusEnum.saved
      : StatusEnum.null,
  })

  const totalParticipants = computed<number>(() => {
    return (
      (schoolGroup.value.groupSize ?? 0) +
      (schoolGroup.value.chaperones ?? 0) +
      (schoolGroup.value.wheelchairs ?? 0)
    )
  })

  async function fieldStatus(stat: string, fieldName: string) {
    status[fieldName] = StatusEnum.pending
    await schoolGroupStore.updateSchoolGroup(props.schoolGroupId, fieldName)
    if (stat === 'saved') {
      status[fieldName] = StatusEnum.saved
    } else if (stat === 'remove') {
      status[fieldName] = StatusEnum.removed
    } else {
      status[fieldName] = StatusEnum.null
    }
  }

  const validationSchema = toTypedSchema(
    yup.object({
      groupName: yup.string().trim().required('Enter a name for your group'),
      earliestTime: yup.string().required('Enter a time'),
      latestTime: yup.string().required('Enter a time'),
      groupSize: yup
        .number()
        .min(2)
        .max(300)
        .integer()
        .typeError('Please enter a valid number')
        .required('Enter the numer of performers'),
      chaperones: yup
        .number()
        .min(0)
        .max(100)
        .integer()
        .typeError('Please enter a valid number')
        .required('Enter the number of chaperones.'),
      wheelchairs: yup
        .number()
        .min(0)
        .max(100)
        .integer()
        .typeError('Please enter a valid number')
        .required('Enter the number of wheelchairs'),
      unavailable: yup.string().trim(),
      conflictPerformers: yup.string().trim(),
    })
  )

  const { errors, validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  onActivated(() => {
    validate()
  })
</script>

<template>
  <div class="grid grid-cols-12 gap-x-3 gap-y-2 items-start">
    <div class="col-span-12 lg:col-span-7 grid grid-cols-12 gap-x-3 gap-y-2">
      <div class="col-span-12 sm:col-span-8 lg:col-span-8">
        <BaseInput
          v-model="schoolGroup.name"
          :status="status.name"
          label="Group Name"
          name="groupName"
          type="text"
          @change-status="(stat: string) => fieldStatus(stat, 'name')" />

        <BaseInput
          v-model="schoolGroup.earliestTime"
          :status="status.earliestTime"
          name="earliestTime"
          label="Earliest time your group can perform"
          type="time"
          @change-status="
            (stat: string) => fieldStatus(stat, 'earliestTime')
          " />

        <BaseInput
          v-model="schoolGroup.latestTime"
          :status="status.latestTime"
          name="latestTime"
          label="Latest time your group can perform"
          type="time"
          @change-status="(stat: string) => fieldStatus(stat, 'latestTime')" />
      </div>
      <div
        class="col-span-12 sm:col-span-4 lg:col-span-4 grid grid-cols-2 gap-x-3 items-end">
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="schoolGroup.groupSize"
            v-maska
            :status="status.groupSize"
            min="2"
            max="300"
            step="1"
            data-maska="###"
            data-maska-eager
            name="groupSize"
            label="Number of performers"
            type="number"
            @change-status="(stat: string) => fieldStatus(stat, 'groupSize')" />
        </div>
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="schoolGroup.chaperones"
            v-maska
            :status="status.chaperones"
            name="chaperones"
            min="0"
            max="100"
            step="1"
            data-maska="###"
            data-maska-eager
            label="Number of chaperones"
            type="number"
            @change-status="
              (stat: string) => fieldStatus(stat, 'chaperones')
            " />
        </div>
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="schoolGroup.wheelchairs"
            v-maska
            :status="status.wheelchairs"
            name="wheelchairs"
            min="0"
            max="100"
            step="1"
            data-maska="###"
            data-maska-eager
            label="Number of wheelchairs"
            type="number"
            @change-status="
              (stat: string) => fieldStatus(stat, 'wheelchairs')
            " />
        </div>
        <div class="off col-1 sm:col-span-2 text-sm font-bold">
          Total Number: {{ totalParticipants }}
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-5">
      <BaseTextarea
        v-model="schoolGroup.unavailable"
        :status="status.unavailable"
        name="unavailable"
        label="Unavailable Dates/Times"
        rows="3"
        @change-status="(stat: string) => fieldStatus(stat, 'unavailable')" />
      <p class="text-sm mb-2">
        List any date/time when you are unavailable for performance, including
        school in-service days, using
        <strong>calendar dates</strong>, not school cycle days, between February
        23 and March 20, 2023.
      </p>

      <BaseTextarea
        v-model="schoolGroup.conflictPerformers"
        :status="status.conflictPerformers"
        name="conflictPerformers"
        label="Performers participating in other classes."
        rows="3"
        @change-status="
          (stat: string) => fieldStatus(stat, 'conflictPerformers')
        " />
      <p class="text-sm mb-2">
        If there are any students in your group participating in other festival
        classes, list the students' names so that we can do our best to avoid
        scheduling conflicts:
      </p>
    </div>
  </div>
</template>

<style scoped></style>
