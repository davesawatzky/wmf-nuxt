<script setup lang="ts">
  import * as yup from 'yup'
  import { useTeacher } from '@/stores/userTeacher'
  import { useGroup } from '@/stores/userGroup'
  import { usePerformers } from '@/stores/userPerformer'
  import { useRegistration } from '@/stores/userRegistration'

  const registrationStore = useRegistration()
  const teacherStore = useTeacher()
  const groupStore = useGroup()
  const performerStore = usePerformers()

  async function addPerformer() {
    await performerStore.createPerformer(registrationStore.registrationId)
  }
  async function removePerformer(index: number) {
    await performerStore.deletePerformer(performerStore.performer[index].id!)
  }

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
</script>

<template>
  <form>
    <div
      v-auto-animate
      class="py-8">
      <h2 class="pb-4">Group Information</h2>
      <div class="grid grid-cols-6 gap-5">
        <div class="col-span-6 md:col-span-3">
          <BaseInput
            v-model="groupStore.groupInfo.name"
            name="groupname"
            label="Group Name"
            type="text" />

          <BaseInput
            v-model="groupStore.groupInfo.numberOfPerformers"
            :value="(groupStore.groupInfo.numberOfPerformers = performerStore.numberOfPerformers)"
            disabled
            class="off"
            aria-disabled
            name="numberOfPerformers"
            label="Number of Performers"
            type="number" />
        </div>
        <div class="col-span-6 md:col-span-3 border border-spacing-1 border-sky-500 shadow-md rounded-lg px-6 pt-6">
          <h3>Group Type</h3>
          <div>
            <BaseRadioGroup
              v-model="groupStore.groupInfo.groupType"
              name="groupType"
              :options="typeOptions" />
          </div>
        </div>
      </div>

      <div class="py-8">
        <h2 class="pb-4">Teacher Information</h2>
        <ContactInfo
          v-model="teacherStore.teacherInfo"
          teacher />
      </div>
      <h2>Performer Information</h2>
      <div
        v-for="(person, personIndex) in performerStore.performer"
        :key="personIndex">
        <div class="py-4">
          <h4 class="pb-4">Performer #{{ personIndex + 1 }}</h4>
          <ContactInfo
            v-model="performerStore.performer[personIndex]"
            groupperformer />
        </div>
        <div class="pt-4">
          <BaseButton
            v-if="personIndex + 1 === performerStore.performer.length ? true : false"
            class="btn btn-blue mb-6"
            @click="addPerformer">
            Add Performer
          </BaseButton>
          <BaseButton
            v-if="performerStore.performer.length > 1 ? true : false"
            id="index"
            class="btn btn-red mb-6"
            @click="removePerformer(personIndex)">
            Remove Performer
          </BaseButton>
          <br /><br />
          <svg viewBox="0 0 800 2">
            <line
              x1="0"
              x2="800"
              stroke="black" />
          </svg>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
