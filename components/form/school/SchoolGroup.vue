<script setup lang="ts">
  import * as yup from 'yup'
  import { useSchoolGroup } from '@/stores/useSchoolGroup'
  import type { SchoolGroup, SchoolGroupInput } from '@/graphql/gql/graphql'

  const props = defineProps<{
    modelValue: SchoolGroupInput
    schoolGroupIndex: number
    schoolGroupId: number
  }>()

  const emits = defineEmits<{
    'update:modelValue': [value: SchoolGroupInput]
  }>()

  const schoolGroupStore = useSchoolGroup()
  const fieldConfigStore = useFieldConfig()

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
    photoPermission: props.modelValue.photoPermission
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
    await nextTick()
    status[fieldName] = StatusEnum.pending
    await schoolGroupStore.updateSchoolGroup(props.schoolGroupId, fieldName)
    if (stat === 'saved') status[fieldName] = StatusEnum.saved
    else if (stat === 'remove') status[fieldName] = StatusEnum.removed
    else status[fieldName] = StatusEnum.null
  }

  const validationSchema = toTypedSchema(
    yup.object({
      groupName: yup.string().trim().required('Required'),
      earliestTime: yup
        .string()
        .matches(/[0-1]{0,1}[0-9]:[0-5][0-9]/, 'Enter a time')
        .default('08:00')
        .required('Required'),
      latestTime: yup
        .string()
        .matches(/[0-1]{0,1}[0-9]:[0-5][0-9]/, 'Enter a time')
        .default('17:00')
        .required('Required'),
      groupSize: yup
        .number()
        .min(2)
        .max(300)
        .integer()
        .typeError('Please enter a valid number')
        .required('Required'),
      chaperones: yup
        .number()
        .min(0)
        .max(100)
        .integer()
        .typeError('Please enter a valid number')
        .required('Required'),
      wheelchairs: yup
        .number()
        .min(0)
        .max(100)
        .integer()
        .typeError('Please enter a valid number')
        .required('Required'),
      unavailable: yup.string().trim().nullable(),
      conflictPerformers: yup.string().trim().nullable(),
      photoPermission: yup
        .string()
        .trim()
        .required('Required')
        .oneOf(['Yes', 'No']),
    })
  )

  const { errors, validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  const schoolGroupKeys = fieldConfigStore.performerTypeFields('SchoolGroup')
  watchEffect(() => {
    let count = 0
    for (const key of schoolGroupKeys) {
      if (status[key as keyof SchoolGroup] !== StatusEnum.saved) {
        count++
      }
    }
    let index = schoolGroupStore.schoolGroupErrors.findIndex(
      (item) => item.id === props.schoolGroupId
    )
    schoolGroupStore.schoolGroupErrors[index].count = count
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
        class="col-span-12 sm:col-span-4 lg:col-span-4 grid grid-cols-2 gap-x-3 items-start">
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="schoolGroup.groupSize"
            :status="status.groupSize"
            min="2"
            max="300"
            step="1"
            name="groupSize"
            label="Number of performers"
            type="number"
            @change-status="(stat: string) => fieldStatus(stat, 'groupSize')" />
        </div>
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="schoolGroup.chaperones"
            :status="status.chaperones"
            name="chaperones"
            min="0"
            max="100"
            step="1"
            label="Number of chaperones"
            type="number"
            @change-status="
              (stat: string) => fieldStatus(stat, 'chaperones')
            " />
        </div>
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="schoolGroup.wheelchairs"
            :status="status.wheelchairs"
            name="wheelchairs"
            min="0"
            max="100"
            step="1"
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
      <div class="col-span-3 sm:col-span-2 lg:col-span-2 self-end">
        <BaseSelect
          id="photo-permission"
          v-model="schoolGroup.photoPermission"
          :status="status.photoPermission"
          :options="[
            { id: 'Yes', name: 'Yes' },
            { id: 'No', name: 'No' },
          ]"
          name="photoPermission"
          @change-status="
            (stat: string) => fieldStatus(stat, 'photoPermission')
          " />
      </div>
      <div class="col-span-9 sm:col-span-10 lg:col-span-8 text-sm self-center">
        I give permission to use photographs of this participant in Winnipeg
        Music Festival newsletters, funding requests, archival purposes,
        marketing and social media.
      </div>
    </div>
    <div class="col-span-12 lg:col-span-5">
      <BaseTextarea
        v-model="schoolGroup.unavailable"
        :status="status.unavailable"
        name="unavailable"
        label="Scheduling Requests"
        rows="3"
        @change-status="(stat: string) => fieldStatus(stat, 'unavailable')" />
      <p class="text-sm mb-2">
        List any date/time when you are unavailable for performance, including
        school in-service days, using
        <strong>calendar dates</strong>, not school cycle days, between February
        23 and March 20, 2025.
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
