<script setup lang="ts">
  import { useSchoolGroup } from '~/stores/useSchoolGroup'
  import { useSchool } from '~/stores/useSchool'
  import { useToast } from 'vue-toastification'

  const schoolGroupStore = useSchoolGroup()
  const schoolStore = useSchool()
  const toast = useToast()

  async function addSchoolGroup(schoolId?: number) {
    try {
      if (schoolId) {
        await schoolGroupStore.createSchoolGroup(schoolId)
      } else {
        console.error('Cannot add school group.  School ID is missing')
        toast.error('Cannot add school group. School ID is missing')
      }
    } catch (error) {
      console.error('Error adding school group:', error)
      toast.error('Error adding school group')
    }
  }

  async function removeSchoolGroup(schoolGroupId: number) {
    await schoolGroupStore.deleteSchoolGroup(schoolGroupId)
  }
</script>

<template>
  <div>
    <div
      v-auto-animate
      class="py-8">
      <h2 class="pb-4">School Group Information</h2>
      <div
        v-for="(schoolGrp, schoolGroupIndex) in schoolGroupStore.schoolGroup"
        :key="schoolGrp.id">
        <div class="pt-8">
          <h4 class="pb-4">School Group #{{ schoolGroupIndex + 1 }}</h4>
          <FormSchoolGroup
            v-model="schoolGroupStore.schoolGroup[schoolGroupIndex]!"
            :school-group-index="schoolGroupIndex"
            :school-group-id="schoolGrp.id" />
        </div>
        <div class="pt-4">
          <BaseButton
            v-if="
              schoolGroupIndex + 1 === schoolGroupStore.schoolGroup.length
                ? true
                : false
            "
            class="btn btn-blue mb-6"
            @click="addSchoolGroup(schoolStore.school.id)">
            Add Another School Group
          </BaseButton>
          <BaseButton
            v-if="schoolGroupStore.schoolGroup.length > 1 ? true : false"
            class="btn btn-red mb-6"
            @click="removeSchoolGroup(schoolGrp.id)">
            Remove This School Group
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
  </div>
</template>

<style lang="css" scoped></style>
