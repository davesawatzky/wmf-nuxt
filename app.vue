<script setup lang="ts">
  import Vpc from './components/vite-plugin-checker.vue'
</script>

<template>
  <NuxtLayout>
    <NuxtPage>
      <Vpc />
    </NuxtPage>
  </NuxtLayout>
</template>

<style>
  input.error,
  select.error {
    margin-bottom: 0;
  }
  input + p.errorMessage {
    margin-bottom: 24px;
  }
  .error {
    border: 1px solid red;
  }
  .errorMessage {
    color: red;
  }
</style>
