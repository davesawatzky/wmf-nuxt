<script setup lang="ts">
  import * as yup from 'yup'
  import { useGroup } from '@/stores/userGroup'
  import { usePerformers } from '@/stores/userPerformer'
  import type { Status } from '@/composables/types'

  const performerStore = usePerformers()
  const groupStore = useGroup()

  const typeOptions = [
    {
      label: 'Vocal Group',
      description: 'Duets, Trios, Quartets, and Ensembles',
      value: 'vocal',
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

  const validationSchema = yup.object({
    groupname: yup.string().trim().required('Enter a group name'),
    numberOfPerformers: yup
      .number()
      .integer('Only whole numbers')
      .positive('Must be a positive number')
      .nullable()
      .required('Enter number of performers'),
    instrument: yup.string().trim().nullable().required(),
    level: yup.string().max(20).nullable().required(),
    otherClasses: yup.string().nullable(),
  })

  useForm({ validationSchema })

  const status = reactive<Status>({
    name: StatusEnum.null,
    groupType: StatusEnum.null,
    instruments: StatusEnum.null,
    age: StatusEnum.null,
  })

  watch(
    () => [
      groupStore.group.name,
      groupStore.group.groupType,
      groupStore.group.instruments,
      groupStore.group.age,
    ],
    async (
      [newName, newGroupType, newInstruments, newAge],
      [oldName, oldGroupType, oldInstruments, oldAge]
    ) => {
      if (newName !== oldName) {
        status.name = StatusEnum.saving
        await groupStore.updateGroup('name')
        status.name = StatusEnum.saved
      }
      if (newGroupType !== oldGroupType) {
        status.groupType = StatusEnum.saving
        await groupStore.updateGroup('groupType')
        status.groupType = StatusEnum.saved
      }
      if (newInstruments !== oldInstruments) {
        status.instruments = StatusEnum.saving
        await groupStore.updateGroup('instruments')
        status.instruments = StatusEnum.saved
      }
      if (newAge !== oldAge) {
        status.age = StatusEnum.saving
        await groupStore.updateGroup('age')
        status.age = StatusEnum.saved
      }
    }
  )
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
          name="groupname"
          label="Group Name"
          type="text"
          :status="status.name" />

        <p>Number of Performers</p>
        <p>
          {{ groupStore.group.numberOfPerformers }}
        </p>
      </div>
      <div
        class="col-span-6 md:col-span-3 border border-spacing-1 border-sky-500 shadow-md rounded-lg px-6 pt-6">
        <h3>Group Type</h3>
        <div>
          <BaseRadioGroup
            v-model="groupStore.group.groupType"
            name="groupType"
            :options="typeOptions"
            :status="status.groupType" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
