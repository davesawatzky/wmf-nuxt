<script setup lang="ts"></script>

<template>
  <nuxt-link
    v-slot="{ navigate }"
    to=""
    custom>
    <button
      v-bind="$attrs"
      type="button"
      @click="navigate">
      <slot />
    </button>
  </nuxt-link>
</template>

<style scoped></style>
