<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  } )

  const dates = ref('')
</script>

<template>
  <div class="">
  <Calendar v-model="dates" showIcon selectionMode="range" :manual-input="false"  />
  </div>
</template>

<style lang="scss" scoped></style>
