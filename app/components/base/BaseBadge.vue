<script setup lang="ts">
const props = defineProps<{
  hasErrors?: boolean
}>()
</script>

<template>
  <div
    v-if="hasErrors"
    class="absolute bg-red-600 rounded-full text-xs font-bold z-50 px-[4px] py-[2px] min-w-[20px] text-white text-center"
  >
    <slot />
  </div>
  <Icon
    v-else
    class="absolute text-green-600 text-2xl z-50 top-0"
    name="mingcute:check-2-fill"
  />
</template>

<style lang="scss" scoped></style>
