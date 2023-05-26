<script lang="ts" setup>
  import * as yup from 'yup'
  import { useSchool } from '@/stores/userSchool'
  import { useTeacher } from '@/stores/userTeacher'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'

  const teacherStore = useTeacher()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()

  async function addSchoolGroup(schoolId: number) {
    await schoolGroupStore.createSchoolGroup(schoolId)
  }
  async function removeSchoolGroup(schoolGroupId: number) {
    await schoolGroupStore.deleteSchoolGroup(schoolGroupId)
  }
  const validationSchema = yup.object({
    schoolName: yup
      .string()
      .trim()
      .nullable()
      .required('Enter the name of the school'),
    schoolDivision: yup
      .string()
      .trim()
      .nullable()
      .required('Enter the name of the school divison'),
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
            v-model="schoolStore.school.name"
            name="schoolName"
            type="text"
            label="School Name" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <BaseInput
            v-model="schoolStore.school.division"
            name="schoolDivision"
            label="School Division"
            type="text" />
        </div>
      </div>
      <FormContactInfo
        v-model="schoolStore.school"
        school />
      <div class="pt-8">
        <h2 class="pb-4">Teacher Information</h2>
        <div>
          <FormContactInfo
            v-model="teacherStore.teacher"
            teacher
            schoolteacher />
        </div>
      </div>
    </div>
    <h2>School Group Information</h2>
    <div v-auto-animate>
      <div
        v-for="(schoolGrp, groupIndex) in schoolGroupStore.schoolGroup"
        :key="schoolGrp.id">
        <div class="py-4">
          <h4 class="pb-4">School Group #{{ groupIndex + 1 }}</h4>
          <FormSchoolGroup v-model="schoolGroupStore.schoolGroup[groupIndex]" />
        </div>
        <div class="pt-4">
          <BaseButton
            v-if="
              groupIndex + 1 === schoolGroupStore.schoolGroup.length
                ? true
                : false
            "
            class="btn btn-blue mb-6"
            @click="addSchoolGroup(schoolStore.school.id)">
            Add School Group
          </BaseButton>
          <BaseButton
            v-if="schoolGroupStore.schoolGroup.length > 1 ? true : false"
            class="btn btn-red mb-6"
            @click="removeSchoolGroup(schoolGrp.id)">
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
