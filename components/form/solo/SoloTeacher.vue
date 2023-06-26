<script lang="ts" setup>
  import { useTeacher } from '@/stores/userTeacher'

  const teacherStore = useTeacher()
</script>

<template>
  <div class="pt-8">
    <h2 class="pb-4">Teacher Information</h2>
    <FormTeacherInfo
      v-model="teacherStore.teacher"
      teacher />
  </div>
</template>

<style lang="scss" scoped></style>
