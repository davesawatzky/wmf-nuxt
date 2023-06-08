<script setup lang="ts">
  import BaseRadioGroup from '../components/base/BaseRadioGroup.vue'

  const value = ref(2)
</script>

<template>
  <Story title="Component/BaseRadioGroup">
    <BaseRadioGroup
      v-model="value"
      name="Radio Group"
      horizontal
      :options="[
        { label: 'north', value: 1, description: '' },
        { label: 'south', value: 2, description: '' },
        { label: 'east', value: 3, description: '' },
        { label: 'west', value: 4, description: '' },
      ]" />
  </Story>
</template>
