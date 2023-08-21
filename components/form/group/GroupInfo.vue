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
      name: yup.string().trim().required('Enter a group name'),
      groupType: yup.string().required('Please select a group type'),
    })
  )

  const status = reactive<Status>({
    name: groupStore.group.name ? StatusEnum.saved : StatusEnum.null,
    groupType: groupStore.group.groupType ? StatusEnum.saved : StatusEnum.null,
  })

  async function fieldStatus(stat: string, fieldName: string) {
    status[fieldName] = StatusEnum.pending
    await groupStore.updateGroup(fieldName)
    if (stat === 'saved') {
      status[fieldName] = StatusEnum.saved
    } else if (stat === 'remove') {
      status[fieldName] = StatusEnum.removed
    } else {
      status[fieldName] = StatusEnum.null
    }
  }

  const { errors, validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  onActivated(() => {
    validate()
  })
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
          name="name"
          label="Group Name"
          type="text"
          :status="status.name"
          @change-status="(stat: string) => fieldStatus(stat, 'name')" />

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
            label="Selections"
            :options="typeOptions"
            :status="status.groupType"
            @change-status="(stat: string) => fieldStatus(stat, 'groupType')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
