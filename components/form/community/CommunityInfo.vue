<script lang="ts" setup>
  import * as yup from 'yup'
  import { useCommunity } from '@/stores/userCommunity'

  import type { Status } from '@/composables/types'

  const communityStore = useCommunity()

  const status = reactive<Status>({
    name: StatusEnum.null,
    groupSize: StatusEnum.null,
    chaperones: StatusEnum.null,
    wheelchairs: StatusEnum.null,
    conflictPerformers: StatusEnum.null,
  })

  async function fieldStatus(
    fieldName: string,
    updateFunction: any,
    id?: number
  ) {
    status[fieldName] = StatusEnum.saving
    await updateFunction(fieldName)
    status[fieldName] = StatusEnum.saved
  }

  const validationSchema = toTypedSchema(
    yup.object({
      communityInfo: yup.object({
        name: yup
          .string()
          .trim()
          .required('Enter a name for the community group'),
        groupSize: yup
          .number()
          .min(2)
          .max(300)
          .integer()
          .required('Give the size of the group'),
        numberOfChaperones: yup
          .number()
          .min(0)
          .max(100)
          .integer()
          .required('Indicate the number of chaperones'),
        numberOfWheelchairs: yup
          .number()
          .min(0)
          .max(100)
          .integer()
          .required('Indicate the number of wheelchairs'),
        conflictPerformers: yup.string().trim().nullable(),
      }),
    })
  )

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
            :status="status.name"
            name="communityInfo.name"
            type="text"
            label="Community Group Name"
            @change="fieldStatus('name', communityStore.updateCommunity)" />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.number="communityStore.community.groupSize"
            :status="status.groupSize"
            min="2"
            max="300"
            step="1"
            name="communityInfo.groupSize"
            type="number"
            label="Group Size"
            @change="
              fieldStatus('groupSize', communityStore.updateCommunity)
            " />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.number="communityStore.community.chaperones"
            :status="status.chaperones"
            name="communityInfo.numberOfChaperones"
            min="0"
            max="100"
            step="1"
            type="number"
            label="Number of chaperones"
            @change="
              fieldStatus('chaperones', communityStore.updateCommunity)
            " />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.number="communityStore.community.wheelchairs"
            :status="status.wheelchairs"
            name="communityInfo.numberOfWheelchairs"
            min="0"
            max="100"
            step="1"
            type="number"
            label="Number of wheelchairs"
            @change="
              fieldStatus('wheelchairs', communityStore.updateCommunity)
            " />
        </div>
      </div>
    </div>
    <div class="pt-8">
      <div class="grid grid-rows-1 grid-cols-12 gap-x-3 gap-y-2 items-start">
        <div class="col-span-12">
          <p>
            If there are any performers in the group participating in other
            festival classes, list the performers' names so that we can do our
            best to avoid scheduling conflicts:
          </p>
          <BaseTextarea
            v-model="communityStore.community.conflictPerformers"
            :status="status.conflictPerformers"
            name="communityInfo.conflictPerformers"
            label="Performers participating in other classes."
            rows="5"
            @change="
              fieldStatus('conflictPerformers', communityStore.updateCommunity)
            " />
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
