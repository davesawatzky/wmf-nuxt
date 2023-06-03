<script lang="ts" setup>
  import { useTeacher } from '@/stores/userTeacher'

  const teacherStore = useTeacher()
</script>

<template>
  <form>
    <div class="pt-8">
      <h2 class="pb-4">Teacher Information</h2>
      <div>
        <FormContactInfo
          v-model="teacherStore.teacher"
          teacher />
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>