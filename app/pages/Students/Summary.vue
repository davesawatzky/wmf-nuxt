<script lang="ts" setup>
  definePageMeta({
    middleware: ['user'], // auth.global.ts runs automatically
  })
</script>

<template>
  <div
    class="border border-spacing-1 shadow-md rounded-lg border-sky-500 p-2 sm:p-6 mb-6">
    <Summary :teacher-summary="true" />
  </div>
</template>

<style lang="scss" scoped></style>
