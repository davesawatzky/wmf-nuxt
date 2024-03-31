<script lang="ts" setup>
import { useTeacher } from '@/stores/userTeacher'
import { useRegistration } from '@/stores/userRegistration'

const teacherStore = useTeacher()
const registrationStore = useRegistration()
</script>

<template>
  <div class="pt-8">
    <h2 class="pb-4">
      Teacher Information
    </h2>
    <FormTeacherInfo
      v-model="teacherStore.teacher"
      :teacher-id="teacherStore.teacher.id"
      teacher
    />
  </div>
</template>

<style lang="scss" scoped></style>
