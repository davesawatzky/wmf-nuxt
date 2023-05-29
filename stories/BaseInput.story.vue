<script setup lang="ts">
  import BaseInput from '../BaseInput.vue'
</script>

<template>
  <Story
    title="Component/BaseInput"
    :layout="{ type: 'grid', width: '300px' }">
    <Variant title="Text">
      <BaseInput type="text" />
    </Variant>
    <Variant title="Number">
      <BaseInput type="number" />
    </Variant>
    <Variant title="Postal Code">
      <BaseInput type="text" />
    </Variant>
    <Variant title="Phone">
      <BaseInput type="tel" />
    </Variant>
    <Variant title="Email">
      <BaseInput type="email" />
    </Variant>
  </Story>
</template>
