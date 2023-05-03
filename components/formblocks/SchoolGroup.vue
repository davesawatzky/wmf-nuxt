<script setup lang="ts">
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  })

  const emits = defineEmits(['update:modelValue'])

  const group = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const totalParticipants = computed(() => {
    return group.value.groupSize + group.value.chaperones + group.value.wheelchairs
  })

  const validationSchema = yup.object({
    groupName: yup.string().trim().nullable().required('Enter a name for your group'),
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
            v-model="group.name"
            label="Group Name"
            name="groupName"
            type="text" />

          <BaseInput
            v-model="group.earliestTime"
            name="earliestTime"
            label="Earliest time your group can perform"
            type="time" />

          <BaseInput
            v-model="group.latestTime"
            name="latestTime"
            label="Latest time your group can perform"
            type="time" />
        </div>
        <div class="col-span-12 sm:col-span-4 lg:col-span-4 grid grid-cols-2 gap-x-3 items-end">
          <div class="col-1 sm:col-span-2">
            <BaseInput
              v-model.number="group.groupSize"
              name="groupSize"
              label="Number of performers"
              type="number" />
          </div>
          <div class="col-1 sm:col-span-2">
            <BaseInput
              v-model.number="group.chaperones"
              name="chaperones"
              label="Number of chaperones"
              type="number" />
          </div>
          <div class="col-1 sm:col-span-2">
            <BaseInput
              v-model.number="group.wheelchairs"
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
          v-model="group.unavailable"
          name="unavailable"
          label="Unavailable Dates/Times"
          rows="3" />
        <p class="text-sm mb-2">
          List any date/time when you are unavailable for performance, including school in-service days, using
          <strong>calendar dates</strong>, not school cycle days, between February 23 and March 20, 2023.
        </p>

        <BaseTextarea
          v-model="group.conflictPerformers"
          name="conflictPerformers"
          label="Performers participating in other classes."
          rows="3" />
        <p class="text-sm mb-2">
          If there are any students in your group participating in other festival classes, list the students' names so
          that we can do our best to avoid scheduling conflicts:
        </p>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
