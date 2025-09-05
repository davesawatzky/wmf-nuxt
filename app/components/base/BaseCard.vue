<script setup lang="ts">
  defineProps<{
    label: string
    photo?: string
    altText?: string
  }>()
</script>

<template>
  <div class="mx-2 mt-2 text-center cursor-pointer">
    <div class="border border-sky-500 rounded-t-lg">
      <NuxtPicture
        :src="photo"
        :alt="altText"
        :img-attrs="{ class: 'mx-auto p-2' }" />
    </div>
    <div
      class="bg-sky-600 text-white mb-2 p-3 text-lg font-bold sm:text-xl sm:p-4 rounded-b-lg">
      {{ label }}
    </div>
  </div>
</template>

<style scoped></style>
