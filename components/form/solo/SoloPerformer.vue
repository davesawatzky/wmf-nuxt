<script lang="ts" setup>
  import { usePerformers } from '@/stores/userPerformer'

  const emits = defineEmits<{
    errorCounts: [count: number]
  }>()

  const performerStore = usePerformers()

  function errorCounts(count: number) {
    emits('errorCounts', count)
  }
</script>

<template>
  <div
    v-auto-animate
    class="pt-8">
    <h2 class="pb-4">Performer Information</h2>
    <div v-if="performerStore.performers[0]">
      <FormPerformerInfo
        v-model="performerStore.performers[0]"
        :performer-index="0"
        :performer-id="performerStore.performers[0].id"
        @error-counts="errorCounts" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
