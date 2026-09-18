<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  helpMessage?: string
}>()
const toast = useToast()

</script>

<template>
  <button
    v-if="helpMessage"
    @click="toast.add({ severity: 'info', summary: 'Help', detail: helpMessage, life: 4000 })"
  >
    <Icon
      class="text-lg"
      name="fluent:question-circle-12-filled"
    />
  </button>
</template>

<style lang="css" scoped></style>
