<!--
BaseButton
@param type The Type of button.

-->

<script setup lang="ts"></script>

<template>
  <button
    v-bind="$attrs"
    type="button">
    <slot />
  </button>
</template>

<style scoped></style>
