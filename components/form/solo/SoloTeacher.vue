<script lang="ts" setup>
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
    <h2 class="pb-4">Teacher Information</h2>
    <FormTeacherInfo
      v-model="teacherStore.teacher"
      :teacher-id="teacherStore.teacher.id"
      teacher
      @error-counts="errorCounts" />
  </div>
</template>

<style lang="scss" scoped></style>
