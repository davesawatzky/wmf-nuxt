<script setup lang="ts">
  defineProps<{
    status?: null | 'saving' | 'saved'
  }>()
</script>

<template>
  <div>
    <Icon
      v-if="status === 'saving'"
      class="animate-spin"
      name="icomoon-free:spinner9" />
    <div v-else-if="status === 'saved'">
      <label class="self-center text-xs text-gray-400 font-bold italic">
        Saved
      </label>
      <Icon
        class="self-center text-base font-normal text-green-600"
        name="mingcute:check-2-fill" />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
