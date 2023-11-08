<script setup lang="ts">
  const props = defineProps({
    error: Object,
  })

  const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <nuxt-layout name="error">
    <div class="text-center">
      <h2>{{ error!.statusCode }} {{ error!.message }}</h2>
      <button
        class="mt-8 btn btn-blue"
        @click="handleError">
        Back to Sign In
      </button>
    </div>
  </nuxt-layout>
</template>
