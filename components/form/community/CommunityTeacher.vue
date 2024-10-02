<script setup lang="ts">
  import { useTeacher } from '@/stores/useTeacher'

  const teacherStore = useTeacher()
</script>

<template>
  <div class="pt-8">
    <h2 class="pb-4">Community Conductor Information</h2>
    <FormTeacherInfo
      v-model="teacherStore.teacher"
      :teacher-id="teacherStore.teacher.id"
      communityConductor />
  </div>
</template>

<style lang="css" scoped></style>
