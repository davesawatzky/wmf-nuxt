<script lang="ts" setup>
  import * as yup from 'yup'
  import { useCommunity } from '@/stores/userCommunity'
  import { useTeacher } from '@/stores/userTeacher'

  const teacherStore = useTeacher()
  const communityStore = useCommunity()

  const validationSchema = yup.object({
    name: yup.string().trim().required('Enter a name for the community group'),
    groupSize: yup
      .number()
      .integer()
      .nullable()
      .required('Give the size of the group'),
    numberOfChaperones: yup
      .number()
      .integer()
      .nullable()
      .required('Indicate the number of chaperones'),
    numberOfWheelchairs: yup
      .number()
      .integer()
      .nullable()
      .required('Indicate the number of wheelchairs'),
    conflictPerformers: yup.string().trim().nullable(),
  })

  useForm({
    validationSchema,
  })
</script>

<template>
  <form>
    <div
      v-auto-animate
      class="pt-8">
      <h2 class="pb-4">Community Group Information</h2>
      <div class="grid grid-cols-12 gap-x-3 gap-y-2">
        <div class="col-span-12">
          <BaseInput
            v-model="communityStore.community.name"
            name="name"
            type="text"
            label="Community Group Name" />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.number="communityStore.community.groupSize"
            name="groupSize"
            type="number"
            label="Group Size" />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.number="communityStore.community.chaperones"
            name="numberOfChaperones"
            type="number"
            label="Number of chaperones" />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.number="communityStore.community.wheelchairs"
            name="numberOfWheelchairs"
            type="number"
            label="Number of wheelchairs" />
        </div>
      </div>
    </div>
    <div class="pt-8">
      <h2 class="pb-4">Conductor/Contact Information</h2>
      <div>
        <FormTeacherInfo
          v-model="teacherStore.teacher"
          teacher />
      </div>

      <div class="grid grid-rows-1 grid-cols-12 gap-x-3 gap-y-2 items-start">
        <div class="col-span-12">
          <p>
            If there are any performers in the group participating in other
            festival classes, list the performers' names so that we can do our
            best to avoid scheduling conflicts:
          </p>
          <BaseTextarea
            v-model="communityStore.community.conflictPerformers"
            name="conflictPerformers"
            label="Performers participating in other classes."
            rows="5" />
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
