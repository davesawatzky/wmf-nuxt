<script setup lang="ts">
  defineProps({
    label: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      required: true,
    },
  })
</script>

<template>
  <div class="border border-sky-500 rounded-lg m-2 text-center cursor-pointer">
    <nuxt-img
      :src="photo"
      :alt="altText"
      class="mx-auto p-2" />
    <div
      class="bg-sky-600 text-white p-3 text-lg font-bold sm:text-2xl sm:p-4 rounded-b-lg">
      {{ label }}
    </div>
  </div>
</template>

<style scoped></style>
