<script setup lang="ts">
  import { useTeacher } from '@/stores/userTeacher'

  const teacherStore = useTeacher()
</script>

<template>
  <div class="pt-8">
    <h2 class="pb-4">Teacher Information</h2>
    <FormTeacherInfo
      v-model="teacherStore.teacher"
      :teacher-id="teacherStore.teacher.id"
      teacher />
  </div>
</template>

<style lang="css" scoped></style>
