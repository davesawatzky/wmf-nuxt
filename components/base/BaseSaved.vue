<script setup lang="ts">
import {StatusEnum} from '#imports'

defineProps<{
  status?: StatusEnum
}>()
</script>

<template>
  <span>
    <Icon
      v-if="status === StatusEnum.pending"
      class="animate-spin"
      name="icomoon-free:spinner9"
    />
    <Icon
      v-else-if="status === StatusEnum.saved"
      class="self-center text-base font-normal text-green-600"
      name="mingcute:check-2-fill"
    />

    <Icon
      v-else-if="status === StatusEnum.removed"
      class="self-center text-base font-normal text-red-600"
      name="mingcute:forbid-circle-line"
    />
  </span>
</template>

<style lang="css" scoped></style>
