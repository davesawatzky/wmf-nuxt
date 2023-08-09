<script setup lang="ts">
  import { useSchoolGroup } from '@/stores/userSchoolGroup'
  import { useSchool } from '@/stores/userSchool'

  const emits = defineEmits<{
    errorCounts: [count: number]
  }>()

  const schoolGroupStore = useSchoolGroup()
  const schoolStore = useSchool()
  const numberOfErrors = ref<number[]>([])

  async function addSchoolGroup(schoolId: number) {
    numberOfErrors.value.push(0)
    await schoolGroupStore.createSchoolGroup(schoolId)
  }
  async function removeSchoolGroup(schoolGroupId: number, index: number) {
    await schoolGroupStore.deleteSchoolGroup(schoolGroupId)
    numberOfErrors.value.splice(index, 1)
  }
  const totalErrors = computed(() => {
    return numberOfErrors.value.reduce((a, b) => {
      return a + b
    }, 0)
  })

  function errorCounts(count: number, index: number) {
    numberOfErrors.value[index] = count
  }

  watchEffect(
    () => {
      emits('errorCounts', totalErrors.value)
    },
    { flush: 'post' }
  )

  onActivated(() => {
    emits('errorCounts', totalErrors.value)
  })
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
            v-model="schoolGroupStore.schoolGroup[schoolGroupIndex]"
            :school-group-index="schoolGroupIndex"
            :school-group-id="schoolGrp.id"
            @error-counts="(count: number) => errorCounts(count, schoolGroupIndex)" />
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
            @click="removeSchoolGroup(schoolGrp.id, schoolGroupIndex)">
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
