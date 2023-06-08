<script setup lang="ts">
  import BaseInput from '../components/base/BaseInput.vue'
</script>

<template>
  <Story
    title="Component/BaseInput"
    :layout="{ type: 'grid', width: '300px' }">
    <Variant title="Text">
      <BaseInput
        type="text"
        name="text" />
    </Variant>
    <Variant title="Number">
      <BaseInput
        type="number"
        name="number" />
    </Variant>
    <Variant title="Postal Code">
      <BaseInput
        type="text"
        name="postalCode" />
    </Variant>
    <Variant title="Phone">
      <BaseInput
        type="tel"
        name="telephone" />
    </Variant>
    <Variant title="Email">
      <BaseInput
        type="email"
        name="email" />
    </Variant>
  </Story>
</template>
