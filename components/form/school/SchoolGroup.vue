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

  watch(
    () => [
      schoolGroupStore.schoolGroup[props.schoolGroupIndex].name,
      schoolGroupStore.schoolGroup[props.schoolGroupIndex].earliestTime,
      schoolGroupStore.schoolGroup[props.schoolGroupIndex].latestTime,
      schoolGroupStore.schoolGroup[props.schoolGroupIndex].groupSize,
      schoolGroupStore.schoolGroup[props.schoolGroupIndex].chaperones,
      schoolGroupStore.schoolGroup[props.schoolGroupIndex].wheelchairs,
      schoolGroupStore.schoolGroup[props.schoolGroupIndex].unavailable,
      schoolGroupStore.schoolGroup[props.schoolGroupIndex].conflictPerformers,
    ],
    async (
      [
        newName,
        newEarliestTime,
        newLatestTime,
        newGroupSize,
        newChaperones,
        newWheelchairs,
        newUnavailable,
        newConflictPerformers,
      ],
      [
        oldName,
        oldEarliestTime,
        oldLatestTime,
        oldGroupSize,
        oldChaperones,
        oldWheelchairs,
        oldUnavailable,
        oldConflictPerformers,
      ]
    ) => {
      if (newName !== oldName) {
        status.name = StatusEnum.saving
        await schoolGroupStore.updateSchoolGroup(props.schoolGroupId, 'name')
        status.name = StatusEnum.saved
      }
      if (newEarliestTime !== oldEarliestTime) {
        status.earliestTime = StatusEnum.saving
        await schoolGroupStore.updateSchoolGroup(
          props.schoolGroupId,
          'earliestTime'
        )
        status.earliestTime = StatusEnum.saved
      }
      if (newLatestTime !== oldLatestTime) {
        status.latestTime = StatusEnum.saving
        await schoolGroupStore.updateSchoolGroup(
          props.schoolGroupId,
          'latestTime'
        )
        status.latestTime = StatusEnum.saved
      }
      if (newGroupSize !== oldGroupSize) {
        status.groupSize = StatusEnum.saving
        await schoolGroupStore.updateSchoolGroup(
          props.schoolGroupId,
          'groupSize'
        )
        status.groupSize = StatusEnum.saved
      }
      if (newChaperones !== oldChaperones) {
        status.chaperones = StatusEnum.saving
        await schoolGroupStore.updateSchoolGroup(
          props.schoolGroupId,
          'chaperones'
        )
        status.chaperones = StatusEnum.saved
      }
      if (newWheelchairs !== oldWheelchairs) {
        status.wheelchairs = StatusEnum.saving
        await schoolGroupStore.updateSchoolGroup(
          props.schoolGroupId,
          'wheelchairs'
        )
        status.wheelchairs = StatusEnum.saved
      }
      if (newUnavailable !== oldUnavailable) {
        status.unavailable = StatusEnum.saving
        await schoolGroupStore.updateSchoolGroup(
          props.schoolGroupId,
          'unavailable'
        )
        status.unavailable = StatusEnum.saved
      }
      if (newConflictPerformers !== oldConflictPerformers) {
        status.conflictPerformers = StatusEnum.saving
        await schoolGroupStore.updateSchoolGroup(
          props.schoolGroupId,
          'conflictPerformers'
        )
        status.conflictPerformers = StatusEnum.saved
      }
    },
    { flush: 'post' }
  )

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
  <form>
    <div class="grid grid-cols-12 gap-x-3 gap-y-2 items-start">
      <div class="col-span-12 lg:col-span-7 grid grid-cols-12 gap-x-3 gap-y-2">
        <div class="col-span-12 sm:col-span-8 lg:col-span-8">
          <BaseInput
            v-model="schoolGroup.name"
            :status="status.name"
            label="Group Name"
            name="groupName"
            type="text" />

          <BaseInput
            v-model="schoolGroup.earliestTime"
            :status="status.earliestTime"
            name="earliestTime"
            label="Earliest time your group can perform"
            type="time" />

          <BaseInput
            v-model="schoolGroup.latestTime"
            :status="status.latestTime"
            name="latestTime"
            label="Latest time your group can perform"
            type="time" />
        </div>
        <div
          class="col-span-12 sm:col-span-4 lg:col-span-4 grid grid-cols-2 gap-x-3 items-end">
          <div class="col-1 sm:col-span-2">
            <BaseInput
              v-model.number="schoolGroup.groupSize"
              :status="status.groupSize"
              name="groupSize"
              label="Number of performers"
              type="number" />
          </div>
          <div class="col-1 sm:col-span-2">
            <BaseInput
              v-model.number="schoolGroup.chaperones"
              :status="status.chaperones"
              name="chaperones"
              label="Number of chaperones"
              type="number" />
          </div>
          <div class="col-1 sm:col-span-2">
            <BaseInput
              v-model.number="schoolGroup.wheelchairs"
              :status="status.wheelchairs"
              name="wheelchairs"
              label="Number of wheelchairs"
              type="number" />
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
          rows="3" />
        <p class="text-sm mb-2">
          List any date/time when you are unavailable for performance, including
          school in-service days, using
          <strong>calendar dates</strong>, not school cycle days, between
          February 23 and March 20, 2023.
        </p>

        <BaseTextarea
          v-model="schoolGroup.conflictPerformers"
          :status="status.conflictPerformers"
          name="conflictPerformers"
          label="Performers participating in other classes."
          rows="3" />
        <p class="text-sm mb-2">
          If there are any students in your group participating in other
          festival classes, list the students' names so that we can do our best
          to avoid scheduling conflicts:
        </p>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
