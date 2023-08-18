<script setup lang="ts"></script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
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
