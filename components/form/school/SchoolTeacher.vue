<script setup lang="ts">
  import { useTeacher } from '@/stores/userTeacher'
  import { useUser } from '@/stores/useUser'

  const teacherStore = useTeacher()
  const userStore = useUser()
</script>

<template>
  <div class="pt-8">
    <h2 class="pb-4">Teacher Information</h2>
    <FormTeacherInfo
      v-model="teacherStore.teacher"
      :teacher-id="teacherStore.teacher.id"
      schoolteacher />
  </div>
</template>

<style lang="css" scoped></style>
