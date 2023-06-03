<script lang="ts" setup>
  import { usePerformers } from '@/stores/userPerformer'

  const performerStore = usePerformers()
</script>

<template>
  <form>
    <div class="pt-8">
      <h2 class="pb-4">Performer Information</h2>
      <div v-if="performerStore.performers[0]">
        <FormContactInfo v-model="performerStore.performers[0]" />
      </div>
      <div class="pt-4">
        <BaseTextarea :label="textAreaLabel" />
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
