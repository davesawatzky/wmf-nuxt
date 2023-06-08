<script setup lang="ts">
  import BaseTab from '../components/base/BaseTab.vue'
</script>

<template>
  <Story title="Component/BaseTab">
    <BaseTab :tabs="['north', 'south', 'east', 'west']" />
  </Story>
</template>
