<script setup lang="ts">
  import { useTeacher } from '@/stores/userTeacher'

  const emits = defineEmits<{
    errorCounts: [count: number]
  }>()

  const teacherStore = useTeacher()

  function errorCounts(count: number) {
    emits('errorCounts', count)
  }
</script>

<template>
  <div class="pt-8">
    <h2 class="pb-4">Conductor/Contact Information</h2>
    <FormTeacherInfo
      v-model="teacherStore.teacher"
      :teacher-id="teacherStore.teacher.id"
      teacher
      @error-counts="errorCounts" />
  </div>
</template>

<style lang="css" scoped></style>
