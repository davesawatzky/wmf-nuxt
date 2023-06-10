<script setup lang="ts">
  const props = defineProps<{
    helpMessage?: string
  }>()

  const msg = () => alert(props.helpMessage)
</script>

<template>
  <button
    v-if="helpMessage"
    @click="msg">
    <Icon
      class="text-lg"
      name="fluent:question-circle-12-filled" />
  </button>
</template>

<style lang="css" scoped></style>
