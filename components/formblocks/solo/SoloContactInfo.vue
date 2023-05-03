<script lang="ts" setup>
  import { usePerformers } from '@/stores/userPerformer'
  import { useTeacher } from '@/stores/userTeacher'

  const performerStore = usePerformers()
  const teacherStore = useTeacher()
</script>

<template>
  <form>
    <div class="pt-8">
      <div>
        <h2 class="pb-4">Performer Information</h2>
        <div v-if="performerStore.performer[0]">
          <ContactInfo v-model="performerStore.performer[0]" />
        </div>
        <div class="pt-4">
          <BaseTextarea :label="textAreaLabel" />
        </div>
      </div>
      <div class="pt-8">
        <h2 class="pb-4">Teacher Information</h2>
        <div>
          <contact-info
            v-model="teacherStore.teacherInfo"
            teacher />
        </div>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
