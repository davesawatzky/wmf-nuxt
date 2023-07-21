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

  const emits = defineEmits<{ 'update:modelValue': [SchoolGroupInput] }>()

  const schoolGroupStore = useSchoolGroup()

  const status = reactive<Status>({
    name: StatusEnum.null,
    earliestTime: StatusEnum.null,
    latestTime: StatusEnum.null,
    groupSize: StatusEnum.null,
    chaperones: StatusEnum.null,
    wheelchairs: StatusEnum.null,
    unavailable: StatusEnum.null,
    conflictPerformers: StatusEnum.null,
  })

  const schoolGroup = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const totalParticipants = computed<number>(() => {
    return (
      schoolGroup.value.groupSize! +
      schoolGroup.value.chaperones! +
      schoolGroup.value.wheelchairs!
    )
  })

  async function fieldStatus(fieldName: string) {
    status[fieldName] = StatusEnum.saving
    await schoolGroupStore.updateSchoolGroup(props.schoolGroupId, fieldName)
    status[fieldName] = StatusEnum.saved
  }

  const validationSchema = yup.object({
    groupName: yup
      .string()
      .trim()
      .nullable()
      .required('Enter a name for your group'),
    earliestTime: yup.string().nullable().required('Enter a time'),
    latestTime: yup.string().nullable().required('Enter a time'),
    groupSize: yup.number().required('Enter the numer of performers'),
    chaperones: yup.number(),
    wheelchaires: yup.number(),
    unavailable: yup.string().trim().nullable(),
    conflictPerformers: yup.string().trim().nullable(),
  })

  useForm({ validationSchema })
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
          @change="fieldStatus('name')" />

        <BaseInput
          v-model="schoolGroup.earliestTime"
          :status="status.earliestTime"
          name="earliestTime"
          label="Earliest time your group can perform"
          type="time"
          @change="fieldStatus('earliestTime')" />

        <BaseInput
          v-model="schoolGroup.latestTime"
          :status="status.latestTime"
          name="latestTime"
          label="Latest time your group can perform"
          type="time"
          @change="fieldStatus('latestTime')" />
      </div>
      <div
        class="col-span-12 sm:col-span-4 lg:col-span-4 grid grid-cols-2 gap-x-3 items-end">
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="schoolGroup.groupSize"
            :status="status.groupSize"
            name="groupSize"
            label="Number of performers"
            type="number"
            @change="fieldStatus('groupSize')" />
        </div>
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="schoolGroup.chaperones"
            :status="status.chaperones"
            name="chaperones"
            label="Number of chaperones"
            type="number"
            @change="fieldStatus('chaperones')" />
        </div>
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="schoolGroup.wheelchairs"
            :status="status.wheelchairs"
            name="wheelchairs"
            label="Number of wheelchairs"
            type="number"
            @change="fieldStatus('wheelchairs')" />
        </div>
        <div class="off col-1 sm:col-span-2">
          <BaseInput
            v-model.number="totalParticipants"
            name="totalParticipants"
            label="Total Number"
            :value="totalParticipants"
            disabled
            type="number" />
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
        @change="fieldStatus('unavailable')" />
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
        @change="fieldStatus('conflictPerformers')" />
      <p class="text-sm mb-2">
        If there are any students in your group participating in other festival
        classes, list the students' names so that we can do our best to avoid
        scheduling conflicts:
      </p>
    </div>
  </div>
</template>

<style scoped></style>
