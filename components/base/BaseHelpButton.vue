<script setup lang="ts">
import { useToast } from 'vue-toastification'

const props = defineProps<{
  helpMessage?: string
}>()
const toast = useToast()
</script>

<template>
  <button
    v-if="helpMessage"
    @click="toast.info(helpMessage)"
  >
    <Icon
      class="text-lg"
      name="fluent:question-circle-12-filled"
    />
  </button>
</template>

<style lang="css" scoped></style>
