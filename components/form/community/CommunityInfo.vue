<script lang="ts" setup>
  import * as yup from 'yup'
  import { useCommunity } from '@/stores/userCommunity'

  const communityStore = useCommunity()

  const status = reactive<Status>({
    name: communityStore.community.name ? StatusEnum.saved : StatusEnum.null,
    groupSize:
      communityStore.community.groupSize ||
      communityStore.community.groupSize === 0
        ? StatusEnum.saved
        : StatusEnum.null,
    chaperones:
      communityStore.community.chaperones ||
      communityStore.community.chaperones === 0
        ? StatusEnum.saved
        : StatusEnum.null,
    wheelchairs:
      communityStore.community.wheelchairs ||
      communityStore.community.wheelchairs === 0
        ? StatusEnum.saved
        : StatusEnum.null,
    conflictPerformers: communityStore.community.conflictPerformers
      ? StatusEnum.saved
      : StatusEnum.null,
  })

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    status[fieldName] = StatusEnum.pending
    await communityStore.updateCommunity(fieldName)
    if (stat === 'saved') status[fieldName] = StatusEnum.saved
    else if (stat === 'remove') status[fieldName] = StatusEnum.removed
    else status[fieldName] = StatusEnum.null
  }

  const validationSchema = toTypedSchema(
    yup.object({
      name: yup
        .string()
        .trim()
        .required('Enter a name for the community group'),
      groupSize: yup
        .number()
        .min(2)
        .max(300)
        .typeError('Please enter a valid number')
        .integer()
        .required('Please enter the size of the group'),
      chaperones: yup
        .number()
        .min(0)
        .max(100)
        .integer()
        .typeError('Please enter a valid number')
        .required('Indicate the number of chaperones'),
      wheelchairs: yup
        .number()
        .min(0)
        .max(100)
        .integer()
        .typeError('Please enter a valid number')
        .required('Indicate the number of wheelchairs'),
      conflictPerformers: yup.string().trim().nullable(),
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
            name="name"
            type="text"
            label="Community Group Name"
            @change-status="(stat: string) => fieldStatus(stat, 'name')" />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.number="communityStore.community.groupSize"
            v-maska
            :status="status.groupSize"
            min="2"
            max="300"
            step="1"
            data-maska="###"
            data-maska-eager
            name="groupSize"
            type="number"
            inputmode="numeric"
            label="Group Size"
            @change-status="(stat: string) => fieldStatus(stat, 'groupSize')" />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.number="communityStore.community.chaperones"
            v-maska
            :status="status.chaperones"
            name="chaperones"
            min="0"
            max="100"
            step="1"
            data-maska="###"
            data-maska-eager
            type="number"
            label="Number of chaperones"
            @change-status="
              (stat: string) => fieldStatus(stat, 'chaperones')
            " />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.number="communityStore.community.wheelchairs"
            v-maska
            :status="status.wheelchairs"
            name="wheelchairs"
            min="0"
            max="100"
            step="1"
            data-maska="###"
            data-maska-eager
            type="number"
            label="Number of wheelchairs"
            @change-status="
              (stat: string) => fieldStatus(stat, 'wheelchairs')
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
            name="conflictPerformers"
            label="Performers participating in other classes."
            rows="5"
            @change-status="
              (stat: string) => fieldStatus(stat, 'conflictPerformers')
            " />
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
