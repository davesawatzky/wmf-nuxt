<script lang="ts" setup>
  import { usePerformers } from '@/stores/userPerformer'

  const performerStore = usePerformers()
</script>

<template>
  <form>
    <div
      v-auto-animate
      class="pt-8">
      <h2 class="pb-4">Performer Information</h2>
      <div v-if="performerStore.performers[0]">
        <FormPerformerInfo
          v-model="performerStore.performers[0]"
          :performer-index="0"
          :performer-id="performerStore.performers[0].id" />
      </div>
      <div class="pt-4">
        <BaseTextarea :label="textAreaLabel" />
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
