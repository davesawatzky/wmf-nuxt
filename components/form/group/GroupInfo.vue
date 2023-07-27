<script setup lang="ts">
  import * as yup from 'yup'
  import { useGroup } from '@/stores/userGroup'
  import type { Status } from '@/composables/types'

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

  const validationSchema = toTypedSchema(
    yup.object({
      groupname: yup.string().trim().required('Enter a group name'),
    })
  )

  useForm({ validationSchema })

  const status = reactive<Status>({
    name: StatusEnum.null,
    groupType: StatusEnum.null,
    instruments: StatusEnum.null,
    age: StatusEnum.null,
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
          :status="status.name"
          @change="fieldStatus('name', groupStore.updateGroup)" />

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
            :status="status.groupType"
            @change="fieldStatus('groupType', groupStore.updateGroup)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
