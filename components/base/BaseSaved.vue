<script setup lang="ts">
  import { StatusEnum } from '@/composables/types'

  defineProps<{
    status?: StatusEnum
  }>()
</script>

<template>
  <div>
    <Icon
      v-if="status === StatusEnum.pending"
      class="animate-spin"
      name="icomoon-free:spinner9" />
    <div v-else-if="status === StatusEnum.saved">
      <!-- <label class="self-center text-xs text-gray-400 font-bold italic">
        Saved
      </label> -->
      <Icon
        class="self-center text-base font-normal text-green-600"
        name="mingcute:check-2-fill" />
    </div>
    <div v-else-if="status === StatusEnum.removed">
      <!-- <label class="self-center text-xs text-gray-400 font-bold italic">
        Removed
      </label> -->
      <Icon
        class="self-center text-base font-normal text-red-600"
        name="mingcute:forbid-circle-line" />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
