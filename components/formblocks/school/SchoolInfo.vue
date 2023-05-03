<script lang="ts" setup>
  import * as yup from 'yup'
  import { useSchool } from '@/stores/userSchool'
  import { useTeacher } from '@/stores/userTeacher'
  import { useCommunity } from '@/stores/userCommunity'
  import { useRegistration } from '@/stores/userRegistration'

  const teacherStore = useTeacher()
  const schoolStore = useSchool()
  const communityStore = useCommunity()
  const registrationStore = useRegistration()

  async function addSchoolGroup() {
    await communityStore.createCommunity(registrationStore.registrationId)
  }
  async function removeSchoolGroup(index: number) {
    await communityStore.deleteCommunity(communityStore.communityInfo[index].id!)
  }
  const validationSchema = yup.object({
    schoolName: yup.string().trim().nullable().required('Enter the name of the school'),
    schoolDivision: yup.string().trim().nullable().required('Enter the name of the school divison'),
  })

  useForm({ validationSchema })
</script>

<template>
  <form>
    <div
      v-auto-animate
      class="pt-8">
      <h2 class="pb-4">School Information</h2>
      <div class="grid grid-cols-12 gap-x-3 gap-y-2">
        <div class="col-span-12 sm:col-span-6">
          <BaseInput
            v-model="schoolStore.schoolInfo.name"
            name="schoolName"
            type="text"
            label="School Name" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <BaseInput
            v-model="schoolStore.schoolInfo.division"
            name="schoolDivision"
            label="School Division"
            type="text" />
        </div>
      </div>
      <contact-info
        v-model="schoolStore.schoolInfo"
        school />
      <div class="pt-8">
        <h2 class="pb-4">Teacher Information</h2>
        <div>
          <contact-info
            v-model="teacherStore.teacherInfo"
            teacher
            schoolteacher />
        </div>
      </div>
    </div>
    <h2>School Group Information</h2>
    <div v-auto-animate>
      <div
        v-for="(community, communityIndex) in communityStore.communityInfo"
        :key="communityIndex">
        <div class="py-4">
          <h4 class="pb-4">School Group #{{ communityIndex + 1 }}</h4>
          <SchoolGroup v-model="communityStore.communityInfo[communityIndex]" />
        </div>
        <div class="pt-4">
          <BaseButton
            v-if="communityIndex + 1 === communityStore.communityInfo.length ? true : false"
            class="btn btn-blue mb-6"
            @click="addSchoolGroup">
            Add School Group
          </BaseButton>
          <BaseButton
            v-if="communityStore.communityInfo.length > 1 ? true : false"
            id="index"
            class="btn btn-red mb-6"
            @click="removeSchoolGroup(communityIndex)">
            Remove School Group
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
