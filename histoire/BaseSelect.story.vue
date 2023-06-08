<script setup lang="ts">
  import BaseSelect from '../components/base/BaseSelect.vue'
</script>

<template>
  <Story title="Component/BaseSelect">
    <BaseSelect
      label="Select Component"
      :options="[
        { id: 'north', name: 'north' },
        { id: 'south', name: 'south' },
        { id: 'east', name: 'east' },
        { id: 'west', name: 'west' },
      ]" />
  </Story>
</template>
