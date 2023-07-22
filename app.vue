<script setup lang="ts"></script>

<template>
  <NuxtLayout>
    <NuxtPage />
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
